import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

import Container from "../../components/common/Container";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import NewsletterSection from "../../components/sections/NewsletterSection";
import useLanguage from "../../hooks/useLanguage";
import blogService from "../../services/blogService";

import "./BlogPages.css";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

function getPageContent(pageData) {
  if (!pageData) return [];
  if (Array.isArray(pageData)) return pageData;
  if (Array.isArray(pageData.content)) return pageData.content;
  if (Array.isArray(pageData.data)) return pageData.data;
  return [];
}

function formatDate(value) {
  if (!value) return "";

  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function getReadingTime(content) {
  if (!content) return "2 min read";

  const words = String(content)
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

function normalizePageMeta(pageData) {
  if (!pageData || Array.isArray(pageData)) {
    return {
      page: 0,
      totalPages: 1,
      last: true,
      first: true,
    };
  }

  return {
    page: pageData.number ?? pageData.page ?? 0,
    totalPages: pageData.totalPages ?? 1,
    last: Boolean(pageData.last ?? true),
    first: Boolean(pageData.first ?? true),
  };
}

export default function BlogListPage() {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") || "";
  const selectedTag = searchParams.get("tag") || "";
  const currentPage = Number(searchParams.get("page") || 0);

  const [postsData, setPostsData] = useState(null);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [error, setError] = useState("");

  const posts = useMemo(() => getPageContent(postsData), [postsData]);
  const pageMeta = useMemo(() => normalizePageMeta(postsData), [postsData]);

  const categories = useMemo(() => {
    const values = posts
      .map((post) => post?.category)
      .filter(Boolean)
      .map((item) => item.trim())
      .filter(Boolean);

    return [...new Set(values)];
  }, [posts]);

  const tags = useMemo(() => {
    const values = posts.flatMap((post) =>
      Array.isArray(post?.tags) ? post.tags : [],
    );

    return [...new Set(values.filter(Boolean))].slice(0, 12);
  }, [posts]);

  useEffect(() => {
    let ignore = false;

    async function loadPosts() {
      setLoading(true);
      setError("");

      try {
        const params = {
          language,
          page:
            Number.isFinite(currentPage) && currentPage >= 0 ? currentPage : 0,
          size: 9,
        };

        let data;

        if (selectedCategory) {
          data = await blogService.getPostsByCategory(selectedCategory, params);
        } else if (selectedTag) {
          data = await blogService.getPostsByTag(selectedTag, params);
        } else {
          data = await blogService.getPublishedPosts(params);
        }

        if (!ignore) {
          setPostsData(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              t("states.failedToLoad", "Failed to load content"),
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      ignore = true;
    };
  }, [language, currentPage, selectedCategory, selectedTag, t]);

  useEffect(() => {
    let ignore = false;

    async function loadFeatured() {
      setFeaturedLoading(true);

      try {
        const data = await blogService.getFeaturedPosts({ language });
        if (!ignore) {
          setFeaturedPosts(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!ignore) {
          setFeaturedPosts([]);
        }
      } finally {
        if (!ignore) {
          setFeaturedLoading(false);
        }
      }
    }

    loadFeatured();

    return () => {
      ignore = true;
    };
  }, [language]);

  function updateFilter(nextValues = {}) {
    const next = new URLSearchParams(searchParams);

    Object.entries(nextValues).forEach(([key, value]) => {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });

    next.delete("page");
    setSearchParams(next);
  }

  function goToPage(page) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(Math.max(0, page)));
    setSearchParams(next);
  }

  return (
    <main className="blog-page">
      <section className="blog-hero">
        <Container>
          <motion.div
            className="blog-hero__grid"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="blog-hero__content" variants={fadeInUp}>
              <span className="blog-eyebrow">
                {t("blog.eyebrow", "InkFront Blog")}
              </span>

              <h1>{t("blog.title", "Ideas, strategy, and digital growth")}</h1>

              <p>
                {t(
                  "blog.subtitle",
                  "Read practical articles on websites, booking systems, automation, business visibility, and better digital operations.",
                )}
              </p>

              <div className="blog-hero__actions">
                <Link to="/contact" className="premium-btn premium-btn-primary">
                  {t("blog.startProject", "Start a project")}
                </Link>

                <a href="#blog-posts" className="premium-btn premium-btn-ghost">
                  {t("blog.readArticles", "Read articles")}
                </a>
              </div>
            </motion.div>

            <motion.aside className="blog-hero__panel" variants={fadeInUp}>
              <span>{t("blog.featuredLabel", "Featured insights")}</span>

              {featuredLoading ? (
                <p>{t("states.loading", "Loading...")}</p>
              ) : featuredPosts.length > 0 ? (
                <div className="blog-featured-mini">
                  {featuredPosts.slice(0, 3).map((post) => (
                    <Link
                      key={post.id || post.slug}
                      to={`/blog/${post.slug}`}
                      className="blog-featured-mini__item"
                    >
                      <strong>{post.title}</strong>
                      <small>
                        {formatDate(post.publishedAt || post.createdAt)} ·{" "}
                        {getReadingTime(post.content)}
                      </small>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>
                  {t(
                    "blog.noFeatured",
                    "Featured articles will appear here once published.",
                  )}
                </p>
              )}
            </motion.aside>
          </motion.div>
        </Container>
      </section>

      <section id="blog-posts" className="blog-section">
        <Container>
          <div className="blog-section__header">
            <div>
              <span className="blog-eyebrow">
                {t("blog.latestLabel", "Latest articles")}
              </span>
              <h2>{t("blog.latestTitle", "Fresh thinking for your brand")}</h2>
            </div>

            {(selectedCategory || selectedTag) && (
              <button
                type="button"
                className="blog-clear-filter"
                onClick={() => {
                  setSearchParams({});
                }}
              >
                {t("blog.clearFilters", "Clear filters")}
              </button>
            )}
          </div>

          {(categories.length > 0 || tags.length > 0) && (
            <div className="blog-filter-bar">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    selectedCategory === category
                      ? "blog-filter-pill blog-filter-pill--active"
                      : "blog-filter-pill"
                  }
                  onClick={() =>
                    updateFilter({
                      category: selectedCategory === category ? "" : category,
                      tag: "",
                    })
                  }
                >
                  {category}
                </button>
              ))}

              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={
                    selectedTag === tag
                      ? "blog-filter-pill blog-filter-pill--active"
                      : "blog-filter-pill"
                  }
                  onClick={() =>
                    updateFilter({
                      tag: selectedTag === tag ? "" : tag,
                      category: "",
                    })
                  }
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <LoadingSpinner
              label={t("states.loadingPage", "Loading page...")}
            />
          ) : error ? (
            <ErrorState message={error} />
          ) : posts.length === 0 ? (
            <div className="blog-empty">
              <h3>{t("blog.emptyTitle", "No articles found")}</h3>
              <p>
                {t(
                  "blog.emptyText",
                  "Published articles for this language or filter will appear here.",
                )}
              </p>
            </div>
          ) : (
            <>
              <motion.div
                className="blog-grid"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {posts.map((post, index) => (
                  <motion.article
                    key={post.id || post.slug}
                    className={
                      index === 0 && !selectedCategory && !selectedTag
                        ? "blog-card blog-card--large"
                        : "blog-card"
                    }
                    variants={fadeInUp}
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      className="blog-card__media"
                    >
                      {post.featuredImageUrl ? (
                        <img src={post.featuredImageUrl} alt={post.title} />
                      ) : (
                        <div className="blog-card__placeholder">
                          <span>IF</span>
                        </div>
                      )}

                      {post.featured ? (
                        <span className="blog-card__badge">
                          {t("blog.featured", "Featured")}
                        </span>
                      ) : null}
                    </Link>

                    <div className="blog-card__body">
                      <div className="blog-card__meta">
                        {post.category ? <span>{post.category}</span> : null}
                        <span>
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                        <span>{getReadingTime(post.content)}</span>
                      </div>

                      <h3>
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>

                      {post.excerpt ? <p>{post.excerpt}</p> : null}

                      {Array.isArray(post.tags) && post.tags.length > 0 ? (
                        <div className="blog-card__tags">
                          {post.tags.slice(0, 4).map((tag) => (
                            <button
                              type="button"
                              key={tag}
                              onClick={() =>
                                updateFilter({ tag, category: "" })
                              }
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      ) : null}

                      <Link
                        to={`/blog/${post.slug}`}
                        className="blog-read-link"
                      >
                        {t("blog.readMore", "Read article")} →
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </motion.div>

              {pageMeta.totalPages > 1 ? (
                <div className="blog-pagination">
                  <button
                    type="button"
                    disabled={pageMeta.first || pageMeta.page <= 0}
                    onClick={() => goToPage(pageMeta.page - 1)}
                  >
                    {t("pagination.previous", "Previous")}
                  </button>

                  <span>
                    {t("pagination.page", "Page")} {pageMeta.page + 1}{" "}
                    {t("pagination.of", "of")} {pageMeta.totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={
                      pageMeta.last || pageMeta.page + 1 >= pageMeta.totalPages
                    }
                    onClick={() => goToPage(pageMeta.page + 1)}
                  >
                    {t("pagination.next", "Next")}
                  </button>
                </div>
              ) : null}
            </>
          )}
        </Container>
      </section>

      <Container>
        <NewsletterSection />
      </Container>
    </main>
  );
}

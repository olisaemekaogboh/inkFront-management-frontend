import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import Container from "../../components/common/Container";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import useLanguage from "../../hooks/useLanguage";
import blogService from "../../services/blogService";

import "./BlogPages.css";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function formatDate(value) {
  if (!value) return "";

  try {
    return new Intl.DateTimeFormat("en", {
      month: "long",
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

function getSafeEmbedUrl(url) {
  if (!url) return "";

  const value = String(url).trim();

  if (!value) return "";

  if (value.includes("youtube.com/watch?v=")) {
    const videoId = value.split("watch?v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : value;
  }

  if (value.includes("youtu.be/")) {
    const videoId = value.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : value;
  }

  if (value.includes("vimeo.com/") && !value.includes("player.vimeo.com")) {
    const videoId = value.split("vimeo.com/")[1]?.split("?")[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : value;
  }

  return value;
}

function getPageContent(pageData) {
  if (!pageData) return [];
  if (Array.isArray(pageData)) return pageData;
  if (Array.isArray(pageData.content)) return pageData.content;
  if (Array.isArray(pageData.data)) return pageData.data;
  return [];
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { language, t } = useLanguage();

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState("");

  const embedUrl = useMemo(
    () => getSafeEmbedUrl(post?.embedVideoUrl || post?.videoUrl),
    [post],
  );

  const galleryImages = useMemo(() => {
    const media = Array.isArray(post?.media) ? post.media : [];

    return media
      .filter((item) => item?.mediaType === "IMAGE" && item?.mediaUrl)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [post]);

  const videoMedia = useMemo(() => {
    const media = Array.isArray(post?.media) ? post.media : [];

    return media
      .filter((item) => item?.mediaType === "VIDEO" && item?.mediaUrl)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [post]);

  useEffect(() => {
    let ignore = false;

    async function loadPost() {
      setLoading(true);
      setError("");

      try {
        const data = await blogService.getPostBySlug(slug, { language });

        if (!ignore) {
          setPost(data);
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

    loadPost();

    return () => {
      ignore = true;
    };
  }, [slug, language, t]);

  useEffect(() => {
    let ignore = false;

    async function loadRelated() {
      if (!post) return;

      setRelatedLoading(true);

      try {
        let related = [];

        if (post.category) {
          const categoryData = await blogService.getPostsByCategory(
            post.category,
            {
              language,
              page: 0,
              size: 4,
            },
          );
          related = getPageContent(categoryData);
        }

        if (related.length <= 1 && Array.isArray(post.tags) && post.tags[0]) {
          const tagData = await blogService.getPostsByTag(post.tags[0], {
            language,
            page: 0,
            size: 4,
          });
          related = getPageContent(tagData);
        }

        const cleaned = related
          .filter((item) => item?.slug && item.slug !== post.slug)
          .slice(0, 3);

        if (!ignore) {
          setRelatedPosts(cleaned);
        }
      } catch {
        if (!ignore) {
          setRelatedPosts([]);
        }
      } finally {
        if (!ignore) {
          setRelatedLoading(false);
        }
      }
    }

    loadRelated();

    return () => {
      ignore = true;
    };
  }, [post, language]);

  useEffect(() => {
    let ignore = false;

    async function loadFeatured() {
      try {
        const data = await blogService.getFeaturedPosts({ language });

        if (!ignore) {
          setFeaturedPosts(
            Array.isArray(data)
              ? data
                  .filter((item) => item?.slug && item.slug !== slug)
                  .slice(0, 4)
              : [],
          );
        }
      } catch {
        if (!ignore) {
          setFeaturedPosts([]);
        }
      }
    }

    loadFeatured();

    return () => {
      ignore = true;
    };
  }, [language, slug]);

  if (loading) {
    return (
      <LoadingSpinner label={t("states.loadingPage", "Loading page...")} />
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!post) {
    return (
      <main className="blog-page">
        <Container>
          <div className="blog-empty">
            <h1>{t("blog.notFoundTitle", "Article not found")}</h1>
            <p>
              {t(
                "blog.notFoundText",
                "This article may have been removed or unpublished.",
              )}
            </p>
            <Link to="/blog" className="premium-btn premium-btn-primary">
              {t("blog.backToBlog", "Back to blog")}
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="blog-page blog-detail-page">
      <section className="blog-detail-hero">
        <Container>
          <motion.div
            className="blog-detail-hero__inner"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <Link to="/blog" className="blog-back-link">
              ← {t("blog.backToBlog", "Back to blog")}
            </Link>

            <div className="blog-detail-hero__meta">
              {post.category ? <span>{post.category}</span> : null}
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              <span>{getReadingTime(post.content)}</span>
              {post.authorName ? <span>{post.authorName}</span> : null}
            </div>

            <h1>{post.title}</h1>

            {post.excerpt ? <p>{post.excerpt}</p> : null}

            {Array.isArray(post.tags) && post.tags.length > 0 ? (
              <div className="blog-detail-tags">
                {post.tags.map((tag) => (
                  <Link key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`}>
                    #{tag}
                  </Link>
                ))}
              </div>
            ) : null}
          </motion.div>
        </Container>
      </section>

      {post.featuredImageUrl ? (
        <section className="blog-detail-cover">
          <Container>
            <img src={post.featuredImageUrl} alt={post.title} />
          </Container>
        </section>
      ) : null}

      <section className="blog-detail-content-section">
        <Container>
          <div className="blog-detail-layout">
            <article className="blog-detail-article">
              {embedUrl ? (
                <div className="blog-video-embed">
                  <iframe
                    src={embedUrl}
                    title={post.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : null}

              {videoMedia.length > 0 ? (
                <div className="blog-video-list">
                  {videoMedia.map((item) => (
                    <a
                      key={item.id || item.mediaUrl}
                      href={item.mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="blog-video-link"
                    >
                      ▶ {t("blog.watchVideo", "Watch video")}
                    </a>
                  ))}
                </div>
              ) : null}

              {post.content ? (
                <div
                  className="blog-rich-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : null}

              {galleryImages.length > 0 ? (
                <div className="blog-gallery">
                  <h2>{t("blog.gallery", "Gallery")}</h2>

                  <div className="blog-gallery__grid">
                    {galleryImages.map((item) => (
                      <figure key={item.id || item.mediaUrl}>
                        <img src={item.mediaUrl} alt={post.title} />
                      </figure>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>

            <aside className="blog-detail-sidebar">
              <div className="blog-sidebar-card">
                <span className="blog-eyebrow">
                  {t("blog.articleSummary", "Article summary")}
                </span>

                <h3>{post.title}</h3>

                <p>
                  {post.excerpt ||
                    t(
                      "blog.summaryFallback",
                      "A practical insight from InkFront for business owners and digital teams.",
                    )}
                </p>

                <Link to="/contact" className="premium-btn premium-btn-primary">
                  {t("blog.discussProject", "Discuss your project")}
                </Link>
              </div>

              {featuredPosts.length > 0 ? (
                <div className="blog-sidebar-card">
                  <span className="blog-eyebrow">
                    {t("blog.moreFeatured", "More featured")}
                  </span>

                  <div className="blog-sidebar-links">
                    {featuredPosts.map((item) => (
                      <Link
                        key={item.id || item.slug}
                        to={`/blog/${item.slug}`}
                      >
                        <strong>{item.title}</strong>
                        <small>
                          {formatDate(item.publishedAt || item.createdAt)}
                        </small>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </Container>
      </section>

      <section className="blog-related-section">
        <Container>
          <div className="blog-section__header">
            <div>
              <span className="blog-eyebrow">
                {t("blog.relatedLabel", "Related reading")}
              </span>
              <h2>{t("blog.relatedTitle", "Continue exploring")}</h2>
            </div>

            <Link to="/blog" className="blog-read-link">
              {t("blog.viewAll", "View all")} →
            </Link>
          </div>

          {relatedLoading ? (
            <p className="blog-muted">{t("states.loading", "Loading...")}</p>
          ) : relatedPosts.length > 0 ? (
            <div className="blog-grid blog-grid--related">
              {relatedPosts.map((item) => (
                <article key={item.id || item.slug} className="blog-card">
                  <Link to={`/blog/${item.slug}`} className="blog-card__media">
                    {item.featuredImageUrl ? (
                      <img src={item.featuredImageUrl} alt={item.title} />
                    ) : (
                      <div className="blog-card__placeholder">
                        <span>IF</span>
                      </div>
                    )}
                  </Link>

                  <div className="blog-card__body">
                    <div className="blog-card__meta">
                      {item.category ? <span>{item.category}</span> : null}
                      <span>
                        {formatDate(item.publishedAt || item.createdAt)}
                      </span>
                    </div>

                    <h3>
                      <Link to={`/blog/${item.slug}`}>{item.title}</Link>
                    </h3>

                    {item.excerpt ? <p>{item.excerpt}</p> : null}

                    <Link to={`/blog/${item.slug}`} className="blog-read-link">
                      {t("blog.readMore", "Read article")} →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="blog-empty blog-empty--compact">
              <p>
                {t(
                  "blog.noRelated",
                  "More related articles will appear here soon.",
                )}
              </p>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}

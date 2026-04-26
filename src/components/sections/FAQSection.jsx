import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/publicPremium.css";

function normalizeList(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.data?.content)) return value.data.content;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  return [];
}

function text(...values) {
  return (
    values.find((value) => typeof value === "string" && value.trim()) || ""
  );
}

export default function FAQSection({
  title = "Questions people ask",
  description = "Answers to common questions.",
  faqs = [],
}) {
  const items = normalizeList(faqs);
  const [openIndex, setOpenIndex] = useState(0);

  if (!items.length) {
    return (
      <section className="premium-section">
        <div className="premium-container">
          <div className="premium-empty-card">
            <strong>{title}</strong>
            <p>No FAQ content available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="premium-section">
      <div className="premium-container premium-faq-layout">
        <div className="premium-section-head">
          <span className="premium-eyebrow">FAQ</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <div className="premium-faq-list">
          {items.map((item, index) => {
            const question = text(
              item.question,
              item.title,
              item.name,
              `Question ${index + 1}`,
            );

            const answer = text(
              item.answer,
              item.description,
              item.content,
              item.body,
              "Answer coming soon.",
            );

            const isOpen = openIndex === index;

            return (
              <article key={item.id ?? index} className="premium-faq-item">
                <button
                  type="button"
                  className="premium-faq-question"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span>{question}</span>
                  <strong>{isOpen ? "−" : "+"}</strong>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="premium-faq-answer"
                    >
                      <p>{answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

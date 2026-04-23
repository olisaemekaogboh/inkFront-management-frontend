export default function TestimonialCard({ testimonial }) {
  if (!testimonial) {
    return null;
  }

  return (
    <article className="card premium-card testimonial-card">
      <div className="card-content">
        <p className="testimonial-quote">
          {testimonial.quote ||
            testimonial.message ||
            testimonial.content ||
            ""}
        </p>

        <div className="testimonial-author">
          <h3>{testimonial.name || testimonial.clientName || "Anonymous"}</h3>
          <p>
            {testimonial.role || testimonial.position || ""}
            {testimonial.company ? `, ${testimonial.company}` : ""}
          </p>
        </div>
      </div>
    </article>
  );
}

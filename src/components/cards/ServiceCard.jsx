export default function ServiceCard({ service }) {
  return (
    <article className="card premium-card">
      <div className="card-content">
        <h3>{service.name}</h3>
        <p>{service.shortDescription}</p>
      </div>
    </article>
  );
}

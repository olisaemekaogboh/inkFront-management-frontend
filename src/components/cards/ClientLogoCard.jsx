export default function ClientLogoCard({ logo }) {
  return (
    <article className="client-logo-card">
      {logo.imageUrl ? (
        <img
          src={logo.imageUrl}
          alt={logo.altText || logo.name || "Client logo"}
        />
      ) : (
        <span>{logo.name}</span>
      )}
    </article>
  );
}

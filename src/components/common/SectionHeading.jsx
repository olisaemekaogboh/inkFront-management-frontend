import React from "react";

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}) {
  const alignment =
    align === "left"
      ? "text-left items-start"
      : align === "right"
        ? "text-right items-end"
        : "text-center items-center";

  return (
    <div className={`mb-10 flex flex-col ${alignment} ${className}`}>
      {eyebrow ? (
        <span className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          {eyebrow}
        </span>
      ) : null}

      {title ? (
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h2>
      ) : null}

      {subtitle ? (
        <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default SectionHeading;

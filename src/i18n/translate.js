export function resolveTranslation(messages, key) {
  return key.split(".").reduce((current, segment) => {
    if (current && Object.prototype.hasOwnProperty.call(current, segment)) {
      return current[segment];
    }
    return undefined;
  }, messages);
}

export function interpolate(template, values = {}) {
  if (typeof template !== "string") {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, token) => {
    return values[token] !== undefined && values[token] !== null
      ? String(values[token])
      : `{${token}}`;
  });
}

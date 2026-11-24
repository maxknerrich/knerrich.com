export const isExternal = (href: string) => /^https?:\/\//.test(href);

export const newTab = (href: string) =>
  isExternal(href) ? ({ target: "_blank", rel: "noopener" } as const) : {};

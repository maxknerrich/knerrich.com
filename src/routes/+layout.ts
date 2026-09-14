export const prerender = true;

// The page is static HTML. Keep HMR in development without shipping client JS.
export const csr = import.meta.env.DEV;

// Shared between the category Server Component page and the client-side
// CategoryBrowser. Deliberately its own tiny module (not exported from
// CategoryBrowser.tsx) — importing a plain constant across a "use client"
// boundary into a Server Component isn't a reliable pattern in Next.js's
// RSC model, so it lives here instead where both sides can import it
// safely.
export const PAGE_SIZE = 24;

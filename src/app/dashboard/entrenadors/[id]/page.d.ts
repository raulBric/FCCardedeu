// Type declaration to help resolve the page props type issue
declare namespace JSX {
  interface IntrinsicAttributes {
    // Add additional props that Next.js might expect
    params?: { id: string };
    searchParams?: Record<string, string | string[] | undefined>;
  }
}

// Augment Next.js types
declare module 'next' {
  interface PageProps {
    params?: { id: string };
  }
}

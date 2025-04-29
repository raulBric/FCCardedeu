// This file is used to help fix Next.js 15 internal type issues
// It extends the Next.js PageProps interface to match what the type system expects

import type { GetStaticProps, GetServerSideProps } from 'next';

declare module 'next' {
  interface PageProps {
    params?: any;
    searchParams?: any;
  }
}

// Add other type enhancements if needed

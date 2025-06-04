import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
      <div className="w-16 h-1 bg-fcCardedeu mx-auto mt-4"></div>
    </div>
  );
}

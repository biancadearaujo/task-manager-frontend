import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[url(/background.png)] bg-cover bg-center bg-fixed bg-gray-900 text-gray-100 antialiased">
      {children}
    </div>
  );
}
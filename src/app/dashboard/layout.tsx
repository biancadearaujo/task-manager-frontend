import { withAuth } from "@/components/withAuth";
import React from 'react';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

export default withAuth(DashboardLayout);
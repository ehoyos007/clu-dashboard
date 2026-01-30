'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Activity, MessageCircle } from 'lucide-react';

const navigation = [
  { name: 'Tasks', href: '/', icon: LayoutDashboard },
  { name: 'Activity', href: '/activity', icon: Activity },
  { name: 'Chat', href: '/chat', icon: MessageCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b">
          <span className="text-2xl">🟠</span>
          <span className="ml-2 text-xl font-semibold">Clu</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground">
            Connected to OpenClaw
            <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}

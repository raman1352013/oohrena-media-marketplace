import { Outlet, Link, NavLink } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu } from "lucide-react";
import { useState } from "react";

/** Dashboard layout with a left sidebar and top bar */
export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sections = [
    { name: "Overview", to: "/dashboard" },
    { name: "Inventory", to: "/dashboard/inventory" },
    { name: "Enquiries", to: "/dashboard/enquiries" },
    { name: "Quotes", to: "/dashboard/quotes" },
    { name: "Bookings", to: "/dashboard/bookings" },
    { name: "Reports", to: "/dashboard/reports" },
    { name: "Settings", to: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white border-r border-border transition-transform duration-300 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h1 className="text-xl font-semibold text-primary">OOHRENA</h1>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            {sections.map((sec) => (
              <NavLink
                key={sec.to}
                to={sec.to}
                className={({ isActive }) =>
                  cn(
                    "block rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-primary text-white"
                      : "text-muted hover:bg-primary/10 hover:text-primary"
                  )
                }
              >
                {sec.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:ml-64">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4">
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            {/* Placeholder for user avatar / menu */}
            <Button variant="ghost" size="icon">
              <Sun className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Moon className="h-5 w-5" />
            </Button>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useState } from "react";
import { CampaignSelector } from "./CampaignSelector";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Sparkles, Sword, Users, Layout } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
}

interface SidebarProps {
  campaigns?: Campaign[];
  currentPath?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: typeof Layout;
  requiresCampaign?: boolean;
}

const navItems: NavItem[] = [
  {
    name: "My Campaigns",
    href: "/campaigns",
    icon: Layout,
    requiresCampaign: false,
  },
  {
    name: "Monsters Library",
    href: "/monsters",
    icon: BookOpen,
    requiresCampaign: false,
  },
  {
    name: "Spells Library",
    href: "/spells",
    icon: Sparkles,
    requiresCampaign: false,
  },
  {
    name: "Combat",
    href: "/combat",
    icon: Sword,
    requiresCampaign: true,
  },
  {
    name: "Player Characters",
    href: "/characters",
    icon: Users,
    requiresCampaign: true,
  },
];

export function Sidebar({ campaigns = [], currentPath = "" }: SidebarProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  );

  const isActive = (href: string) => {
    if (href === "/campaigns") {
      return currentPath === href || currentPath === "/";
    }
    return currentPath.startsWith(href);
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Logo/Header */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <h1 className="text-xl font-bold text-sidebar-foreground">
          Initiative Forge
        </h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-4">
          {/* Campaign Selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/70">
              Campaign
            </label>
            <CampaignSelector
              campaigns={campaigns}
              onCampaignChange={setSelectedCampaignId}
            />
          </div>

          <Separator className="bg-sidebar-border" />

          {/* Global Modules */}
          <nav className="space-y-1" aria-label="Global navigation">
            <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/70">
              Global
            </p>
            {navItems
              .filter((item) => !item.requiresCampaign)
              .map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
          </nav>

          <Separator className="bg-sidebar-border" />

          {/* Campaign Modules */}
          <nav className="space-y-1" aria-label="Campaign navigation">
            <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/70">
              Campaign
            </p>
            {navItems
              .filter((item) => item.requiresCampaign)
              .map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const disabled = !selectedCampaignId;
                return (
                  <a
                    key={item.href}
                    href={disabled ? undefined : item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      disabled
                        ? "cursor-not-allowed opacity-50"
                        : active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                    aria-current={active ? "page" : undefined}
                    aria-disabled={disabled}
                    onClick={(e) => {
                      if (disabled) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
          </nav>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs text-sidebar-foreground/70">
          Initiative Forge v0.1
        </p>
      </div>
    </aside>
  );
}

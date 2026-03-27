'use client';

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { transKey } from "@/components/common/locales/normal";
import { cn } from "@/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Home,
    User,
    FileText,
    StickyNote,
    Image,
    ChevronDown,
    LayoutDashboard,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type NavItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
};

type NavGroup = {
    id: string;
    label: string;
    icon: React.ReactNode;
    items: NavItem[];
    defaultOpen?: boolean;
};

// ── Main sidebar (RSC-passable: receives lang from server, state lives here) ─

export function ConsoleSidebar({ lang }: { lang: string }) {
    const pathname = usePathname();

    const groups: NavGroup[] = [
        {
            id: "personal",
            label: transKey(lang, "console.personal"),
            icon: <LayoutDashboard size={15} />,
            defaultOpen: true,
            items: [
                {
                    label: transKey(lang, "common.userInfo"),
                    href: `/${lang}/console/userinfo`,
                    icon: <User size={15} />,
                },
                {
                    label: transKey(lang, "common.files"),
                    href: `/${lang}/console/personal/files`,
                    icon: <FileText size={15} />,
                },
                {
                    label: transKey(lang, "common.notes"),
                    href: `/${lang}/console/personal/notes`,
                    icon: <StickyNote size={15} />,
                },
                {
                    label: transKey(lang, "common.images"),
                    href: `/${lang}/console/personal/images`,
                    icon: <Image size={15} />,
                },
            ],
        },
    ];

    return (
        <aside
            className="flex flex-col h-full w-64 flex-shrink-0 overflow-y-auto"
            style={{
                background: "var(--sidebar)",
                borderRight: "1px solid var(--sidebar-border)",
            }}
        >
            {/* Section label */}
            <div
                className="px-4 py-3"
                style={{ borderBottom: "1px solid var(--sidebar-border)" }}
            >
                <span
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--text-secondary-color)" }}
                >
                    Console
                </span>
            </div>

            {/* Home — standalone link */}
            <div className="px-3 pt-3">
                <a
                    href={`/${lang}`}
                    className={cn(
                        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium",
                        "transition-colors duration-150",
                    )}
                    style={
                        pathname === `/${lang}`
                            ? {
                                  background: "var(--sidebar-primary)",
                                  color: "var(--sidebar-primary-foreground)",
                              }
                            : {
                                  color: "var(--sidebar-foreground)",
                              }
                    }
                    onMouseEnter={(e) => {
                        if (pathname !== `/${lang}`) {
                            (e.currentTarget as HTMLElement).style.background =
                                "var(--sidebar-accent)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (pathname !== `/${lang}`) {
                            (e.currentTarget as HTMLElement).style.background =
                                "transparent";
                        }
                    }}
                >
                    <Home size={16} />
                    <span>{transKey(lang, "common.home")}</span>
                </a>
            </div>

            {/* Divider */}
            <div className="px-3 py-2">
                <div style={{ height: "1px", background: "var(--sidebar-border)" }} />
            </div>

            {/* Collapsible groups */}
            <div className="flex-1 px-3 pb-4 space-y-1">
                {groups.map((group) => (
                    <CollapsibleNavGroup
                        key={group.id}
                        group={group}
                        pathname={pathname}
                    />
                ))}
            </div>
        </aside>
    );
}

// ── Collapsible group ─────────────────────────────────────────────────────────

function CollapsibleNavGroup({
    group,
    pathname,
}: {
    group: NavGroup;
    pathname: string;
}) {
    const [open, setOpen] = useState(group.defaultOpen ?? true);

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            {/* Group trigger */}
            <CollapsibleTrigger asChild>
                <button
                    className={cn(
                        "w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold",
                        "transition-colors duration-150 cursor-pointer",
                    )}
                    style={{ color: "var(--text-secondary-color)" }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                            "var(--sidebar-accent)";
                        (e.currentTarget as HTMLElement).style.color =
                            "var(--sidebar-accent-foreground)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                            "transparent";
                        (e.currentTarget as HTMLElement).style.color =
                            "var(--text-secondary-color)";
                    }}
                >
                    {group.icon}
                    <span className="flex-1 text-left">{group.label}</span>
                    <ChevronDown
                        size={14}
                        style={{
                            transform: open ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 200ms ease",
                        }}
                    />
                </button>
            </CollapsibleTrigger>

            {/* Group items */}
            <CollapsibleContent>
                <div className="mt-0.5 space-y-0.5">
                    {group.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2.5 rounded-md pl-8 pr-3 py-2 text-sm",
                                    "transition-colors duration-150",
                                )}
                                style={
                                    isActive
                                        ? {
                                              background:
                                                  "color-mix(in srgb, var(--sidebar-primary) 12%, transparent)",
                                              color: "var(--sidebar-primary)",
                                              fontWeight: 600,
                                          }
                                        : {
                                              color: "var(--sidebar-foreground)",
                                          }
                                }
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        (
                                            e.currentTarget as HTMLElement
                                        ).style.background =
                                            "var(--sidebar-accent)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        (
                                            e.currentTarget as HTMLElement
                                        ).style.background = "transparent";
                                    }
                                }}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </a>
                        );
                    })}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "./BrandLogo";
import { SearchModal } from "./SearchModal";
import { useAtlasStore } from "@/lib/store";
import {
  Search,
  Menu,
  X,
  Sparkles,
  BookOpen,
  Wrench,
  Network,
  Bot,
  User as UserIcon,
  Shield,
  Layers,
  HardDrive,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, setRole } = useAtlasStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const navLinks = [
    { label: "Fundamentals", href: "/fundamentals", icon: BookOpen },
    { label: "AI Tools", href: "/tools", icon: Wrench },
    { label: "Learn", href: "/learn", icon: Layers },
    { label: "Prompt Lab", href: "/prompt-lab", icon: Sparkles },
    { label: "Agents", href: "/agents", icon: Bot },
    { label: "Dev Lab", href: "/dev-lab", icon: Bot },
    { label: "Models", href: "/models", icon: Layers },
    { label: "Graph", href: "/graph", icon: Network },
    { label: "Local AI", href: "/local-ai", icon: HardDrive },
    { label: "Tutor", href: "/tutor", icon: Sparkles },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-atlas-border bg-atlas-bg/90 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <BrandLogo size="md" />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "text-white bg-atlas-card border border-atlas-border shadow-sm text-atlas-cyan"
                      : "text-atlas-textMuted hover:text-white hover:bg-atlas-surface/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Tools & User Controls */}
          <div className="flex items-center gap-2.5">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-atlas-surface border border-atlas-border text-atlas-textMuted hover:text-white hover:border-atlas-blue/50 transition-all text-xs"
              title="Search knowledge base"
            >
              <Search className="w-3.5 h-3.5 text-atlas-cyan" />
              <span className="hidden sm:inline">Search AI Atlas...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-atlas-card border border-atlas-border rounded text-atlas-textFaint">
                ⌘K
              </kbd>
            </button>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-atlas-card border border-atlas-border hover:border-atlas-violet/50 transition-colors text-xs font-mono"
              >
                {user.role === "admin" ? (
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <UserIcon className="w-3.5 h-3.5 text-atlas-blue" />
                )}
                <span className="capitalize text-white hidden md:inline">{user.role}</span>
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-atlas-card border border-atlas-border rounded-xl shadow-xl p-1 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-atlas-border/50 text-[11px] text-atlas-textMuted font-mono">
                    Switch Test Role:
                  </div>
                  {(["visitor", "user", "contributor", "editor", "admin"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs capitalize flex items-center justify-between ${
                        user.role === r ? "bg-atlas-blue/20 text-atlas-cyan font-semibold" : "text-white hover:bg-atlas-surface"
                      }`}
                    >
                      {r}
                      {user.role === r && <span className="w-1.5 h-1.5 rounded-full bg-atlas-cyan" />}
                    </button>
                  ))}
                  <div className="border-t border-atlas-border/50 mt-1 pt-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsRoleDropdownOpen(false)}
                      className="block px-3 py-1.5 text-xs text-atlas-textMuted hover:text-white hover:bg-atlas-surface rounded-lg"
                    >
                      Learner Dashboard
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsRoleDropdownOpen(false)}
                        className="block px-3 py-1.5 text-xs text-amber-400 hover:bg-atlas-surface rounded-lg font-medium"
                      >
                        Admin Control Center
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-atlas-surface border border-atlas-border text-atlas-textMuted hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-atlas-border bg-atlas-bg/95 px-4 pt-3 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  pathname.startsWith(link.href)
                    ? "bg-atlas-card text-atlas-cyan border border-atlas-border"
                    : "text-atlas-textMuted hover:bg-atlas-surface hover:text-white"
                }`}
              >
                <link.icon className="w-4 h-4 text-atlas-blue" />
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-atlas-border/50 mt-2">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white hover:bg-atlas-surface"
              >
                <UserIcon className="w-4 h-4 text-atlas-cyan" />
                Personal Dashboard
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-amber-400 hover:bg-atlas-surface"
                >
                  <Shield className="w-4 h-4" />
                  Admin Console
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Command/Search Dialog */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

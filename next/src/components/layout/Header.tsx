"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/nieuws", label: "Nieuws" },
    { path: "/agenda", label: "Agenda" },
    { path: "/sponsors", label: "Partners" },
    { path: "/over-levy", label: "Levy Opbergen" },
    { path: "/media", label: "Media" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 md:h-12 md:w-12">
              <Image
                src="https://wordpress-474222-5959679.cloudwaysapps.com/wp-content/uploads/2025/11/cropped-VSG-Talent-Logo-1080x1080-Transparant.png"
                alt="VSG Talent logo"
                fill
                sizes="48px"
                className="object-contain drop-shadow-md"
              />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-headline font-bold text-lg">VSG Talent</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Altijd 100%</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 hover:bg-secondary ${
                  isActive(link.path) ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild className="gradient-orange shadow-orange hover-lift">
              <Link href="/club-van-100">Word Partner</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors duration-300 ${
                    isActive(link.path)
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="gradient-orange shadow-orange mt-2">
                <Link href="/club-van-100" onClick={() => setIsMenuOpen(false)}>
                  Word Partner
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

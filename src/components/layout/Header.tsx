import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useWordPressSettings } from "@/hooks/use-wordpress";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const { data: settings } = useWordPressSettings();
  const logoUrl = settings?.logo?.url || settings?.icon?.url || "";
  const siteTitle = settings?.title || "VSG Talent";
  const siteTagline = settings?.description || "Altijd 100%, in weer en wind";

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/nieuws", label: "Nieuws" },
    { path: "/agenda", label: "Agenda" },
    { path: "/sponsors", label: "Partners" },
    { path: "/over-levy", label: "Levy Opbergen" },
    { path: "/media", label: "Media" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={siteTitle}
                className="h-16 w-auto object-contain transition-smooth group-hover:shadow-orange"
                style={{ backgroundColor: "transparent" }}
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-orange rounded-lg flex items-center justify-center font-headline font-bold text-xl transition-smooth group-hover:shadow-orange">
                VSG
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-smooth hover:bg-secondary ${
                  isActive(link.path)
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild className="gradient-orange shadow-orange hover-lift">
              <Link to="/club-van-100">Word Partner</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-smooth"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition-smooth ${
                    isActive(link.path)
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="gradient-orange shadow-orange mt-2">
                <Link to="/club-van-100" onClick={() => setIsMenuOpen(false)}>
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
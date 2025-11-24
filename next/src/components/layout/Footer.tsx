import Link from "next/link";
import { Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const buildTimestamp = new Date().toLocaleString("nl-NL", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
  });

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-orange rounded-lg flex items-center justify-center font-headline font-bold text-sm">
                VSG
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-headline font-bold">VSG Talent</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Altijd 100%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              VSG Talent ondersteunt veelbelovende sporters in Nederland. Een initiatief van VSG Dakwerken.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/vsgdakwerken.nl/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary hover:bg-primary flex items-center justify-center transition-colors duration-300 hover-lift"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/vsg-dakwerken/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary hover:bg-primary flex items-center justify-center transition-colors duration-300 hover-lift"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-headline font-semibold mb-4">Navigatie</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/nieuws" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  Nieuws
                </Link>
              </li>
              <li>
                <Link href="/agenda" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  Agenda
                </Link>
              </li>
              <li>
                <Link href="/over-levy" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  Levy Opbergen
                </Link>
              </li>
              <li>
                <Link href="/media" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  Media
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="font-headline font-semibold mb-4">Partnerships</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/sponsors" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  Onze Partners
                </Link>
              </li>
              <li>
                <Link href="/club-van-100" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  Word Partner
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact VSG Dakwerken */}
          <div>
            <h4 className="font-headline font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                <div>
                  <div>Söderblomstraat 181</div>
                  <div>2131 GE Hoofddorp</div>
                </div>
              </div>
              <a href="tel:+31651664731" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0 text-primary" />
                <span>+31 6 51664731</span>
              </a>
              <a href="mailto:info@vsgdakwerken.nl" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0 text-primary" />
                <span>info@vsgdakwerken.nl</span>
              </a>
              <a 
                href="https://www.vsgdakwerken.nl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block text-xs mt-2 text-primary hover:underline"
              >
                www.vsgdakwerken.nl →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-sm text-muted-foreground">© {currentYear} VSG Dakwerken B.V. Alle rechten voorbehouden.</p>
              <p className="text-xs text-muted-foreground/70 italic">Altijd 100%, in weer en wind</p>
              <p className="text-[10px] text-muted-foreground/60">Build: {buildTimestamp}</p>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                Privacy
              </Link>
              <Link href="/algemene-voorwaarden" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                Algemene Voorwaarden
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

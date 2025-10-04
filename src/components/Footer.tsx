import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-racing bg-clip-text text-transparent mb-4">
              EL Bouch Auto
            </h3>
            <p className="text-sm text-muted-foreground">
              Votre spécialiste en accessoires et décorations automobiles de qualité premium.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-accent transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/categories/eclairage" className="text-muted-foreground hover:text-accent transition-colors">
                  Éclairage
                </Link>
              </li>
              <li>
                <Link to="/categories/jantes-enjoliveurs" className="text-muted-foreground hover:text-accent transition-colors">
                  Jantes & Enjoliveurs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: contact@elbouchauto.com</li>
              <li>Tél: +33 1 23 45 67 89</li>
              <li>Adresse: Paris, France</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EL Bouch Auto. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

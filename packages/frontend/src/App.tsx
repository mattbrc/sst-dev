import "./App.css";
import { Button } from "./components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import Routes from "./Routes.tsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link to="/" className="font-semibold text-lg">
              SST Dev Notes
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="hover:text-gray-600 transition-colors">
                Home
              </Link>
              <Link
                to="/notes"
                className="hover:text-gray-600 transition-colors"
              >
                Notes
              </Link>
              <Button asChild variant="ghost">
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-4">
                  <Link
                    to="/"
                    className="hover:text-gray-600 transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    to="/notes"
                    className="hover:text-gray-600 transition-colors"
                  >
                    Notes
                  </Link>
                  <Button asChild variant="ghost" className="w-full">
                    <Link to="/signin">Sign In</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes />
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          © 2024 SST Dev Notes. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;

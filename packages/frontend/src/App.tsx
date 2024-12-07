import "./App.css";
import { Button } from "./components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet";
import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Routes from "./Routes.tsx";
import { useEffect, useState } from "react";
import { AppContext, AppContextType } from "./lib/contextLib";
import { Auth } from "aws-amplify";
import { onError } from "./lib/errorLib.ts";

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);
    nav("/login");
  }

  return (
    !isAuthenticating && (
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="border-b">
          <div className="container px-4 py-3 mx-auto">
            <nav className="flex items-center justify-between">
              {/* Logo/Brand */}
              <Link to="/" className="text-lg font-semibold">
                SST Dev Notes
              </Link>

              {/* Desktop Navigation */}
              <div className="items-center hidden gap-6 md:flex">
                <Link to="/" className="transition-colors hover:text-gray-600">
                  Home
                </Link>
                <Link
                  to="/notes"
                  className="transition-colors hover:text-gray-600"
                >
                  Notes
                </Link>
                {isAuthenticated ? (
                  <Button variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="ghost">
                      <Link to="/Login">Login</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Navigation */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-4 mt-4">
                    <Link
                      to="/"
                      className="transition-colors hover:text-gray-600"
                    >
                      Home
                    </Link>
                    <Link
                      to="/notes"
                      className="transition-colors hover:text-gray-600"
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
        <main className="container flex-1 px-4 py-8 mx-auto">
          <AppContext.Provider
            value={{ isAuthenticated, userHasAuthenticated } as AppContextType}
          >
            <Routes />
          </AppContext.Provider>
        </main>

        {/* Footer */}
        <footer className="border-t">
          <div className="container px-4 py-6 mx-auto text-sm text-center text-gray-600">
            © 2024 SST Dev Notes. All rights reserved.
          </div>
        </footer>
      </div>
    )
  );
}

export default App;

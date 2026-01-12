import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Flower, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Don't show nav on public scan pages
  if (location.startsWith("/scan/")) return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="p-2 bg-pink-100 rounded-full group-hover:bg-pink-200 transition-colors">
              <Flower className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">
              Bloom Heaven
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link href="/dashboard">
                  <span className={`text-sm font-medium cursor-pointer transition-colors hover:text-primary ${location === '/dashboard' ? 'text-primary' : 'text-gray-600'}`}>
                    Dashboard
                  </span>
                </Link>
                <Link href="/create">
                   <Button variant="default" className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-pink-200/50">
                    Send Flowers
                   </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
                  <LogOut className="h-5 w-5 text-gray-500 hover:text-destructive transition-colors" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <span className="text-sm font-medium text-gray-600 hover:text-primary cursor-pointer transition-colors">
                    Login
                  </span>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="rounded-full border-primary/20 hover:bg-pink-50 text-primary">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 text-gray-600">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-pink-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4 flex flex-col">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <span className="block py-2 text-lg font-medium text-gray-800">Dashboard</span>
                  </Link>
                  <Link href="/create" onClick={() => setIsOpen(false)}>
                    <span className="block py-2 text-lg font-medium text-primary">Send Flowers</span>
                  </Link>
                  <button 
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex items-center gap-2 py-2 text-lg font-medium text-gray-500"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <span className="block py-2 text-lg font-medium text-gray-800">Login</span>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <span className="block py-2 text-lg font-medium text-primary">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

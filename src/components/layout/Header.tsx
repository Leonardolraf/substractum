
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogIn, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "../auth/AuthModal";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
                <img 
                  src="/images/c0ce5059-3d02-41c0-8248-65fbf3d85d91.png" 
                  alt="Substractum - Farmácia de Manipulação Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold text-green-900">Substractum</h1>
                <p className="text-xs md:text-sm text-green-600">Farmácia de Manipulação</p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {(!user || user.role === 'user') && (
                <>
                  <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">Início</Link>
                  <Link to="/products" className="text-gray-700 hover:text-green-600 transition-colors">Produtos</Link>
                  <Link to="/send-prescription" className="text-gray-700 hover:text-green-600 transition-colors">Enviar Receita</Link>
                  <Link to="/about" className="text-gray-700 hover:text-green-600 transition-colors">Sobre Nós</Link>
                </>
              )}
              {isAuthenticated && user?.role === 'admin' && (
                <Link to="/admin" className="text-gray-700 hover:text-green-600 transition-colors">Admin</Link>
              )}
              {isAuthenticated && user?.role === 'seller' && (
                <Link to="/seller-dashboard" className="text-gray-700 hover:text-green-600 transition-colors">Dashboard</Link>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {(!user || user.role === 'user') && (
                <Button variant="ghost" size="sm" onClick={() => handleNavigation('/cart')} className="flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Carrinho</span>
                </Button>
              )}
              
              {!isAuthenticated ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/login')}
                    className="flex items-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Entrar</span>
                  </Button>
                  
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/signup')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Cadastrar
                  </Button>
                </>
              ) : (
                <>
                  <div 
                    className="flex items-center space-x-2 text-sm cursor-pointer hover:text-green-600 transition-colors"
                    onClick={() => handleNavigation('/profile')}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-gray-700">{user?.email || 'Usuário'} ({user?.role || 'user'})</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-green-100">
              <nav className="flex flex-col space-y-3 mt-4">
                {(!user || user.role === 'user') && (
                  <>
                    <Link 
                      to="/" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-green-600 transition-colors py-2"
                    >
                      Início
                    </Link>
                    <Link 
                      to="/products" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-green-600 transition-colors py-2"
                    >
                      Produtos
                    </Link>
                    <Link 
                      to="/send-prescription" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-green-600 transition-colors py-2"
                    >
                      Enviar Receita
                    </Link>
                    <Link 
                      to="/about" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-green-600 transition-colors py-2"
                    >
                      Sobre Nós
                    </Link>
                  </>
                )}
                {isAuthenticated && user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-green-600 transition-colors py-2"
                  >
                    Admin
                  </Link>
                )}
                {isAuthenticated && user?.role === 'seller' && (
                  <Link 
                    to="/seller-dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-green-600 transition-colors py-2"
                  >
                    Dashboard
                  </Link>
                )}
              </nav>
              
              <div className="mt-4 pt-4 border-t border-green-100">
                {!isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => handleAuthClick('login')}
                      className="justify-start"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Entrar
                    </Button>
                    <Button 
                      onClick={() => handleAuthClick('register')}
                      className="bg-green-600 hover:bg-green-700 justify-start"
                    >
                      Cadastrar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div 
                      className="flex items-center space-x-2 py-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
                      onClick={() => handleNavigation('/profile')}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-gray-700">{user.email} ({user.role})</span>
                    </div>
                    {(!user || user.role === 'user') && (
                      <Button 
                        variant="ghost" 
                        onClick={() => handleNavigation('/cart')}
                        className="justify-start w-full"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Carrinho
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      onClick={handleLogout}
                      className="justify-start w-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};

export default Header;

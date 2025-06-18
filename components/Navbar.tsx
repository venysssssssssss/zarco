"use client";

import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';

// Advanced TypeScript interfaces following SOLID principles
interface NavbarProps {
  cartItemCount?: number;
  wishlistItemCount?: number;
  className?: string;
}

interface NavigationItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  requiresAuth?: boolean;
  external?: boolean;
}

interface LogoProps {
  size: 'sm' | 'md' | 'lg';
  className?: string;
}

// Design system constants
const NAVBAR_CONSTANTS = {
  heights: {
    mobile: 'h-16', // increased height
    desktop: 'h-20', // increased height
    compact: 'h-14'
  },
  logoSizes: {
    sm: { width: 65, height: 25 },
    md: { width: 85, height: 33 },
    lg: { width: 105, height: 41 }
  },
  animations: {
    duration: 0.2,
    easing: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
  },
  colors: {
    primary: '#000000',
    secondary: '#FFFFFF',
    accent: '#1e3a8a', // Navy blue accent
    accentHover: '#1e40af',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827'
    }
  }
} as const;

// Enhanced responsive logo component with actual logo image
const ResponsiveLogo = memo(function ResponsiveLogo({ 
  size, 
  className = '' 
}: LogoProps) {
  const logoSize = NAVBAR_CONSTANTS.logoSizes[size];
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: NAVBAR_CONSTANTS.animations.duration }}
      className={`flex items-center focus-visible:ring-2 focus-visible:ring-orange-500 outline-none rounded-lg p-2 ${className}`}
      tabIndex={0}
      aria-label="ZARCO - Página inicial"
      role="img"
    >
      {/* Logo Image */}
      <div className="relative">
        <Image
          src="/zarcologo.png"
          alt="ZARCO Logo"
          width={logoSize.width}
          height={logoSize.height}
          className="object-contain"
        />
      </div>
      
      {/* ZARCO Text */}
      <div className="ml-3">
        <h1 className={`font-black tracking-tight relative ${
          size === 'sm' ? 'text-xl' : 
          size === 'md' ? 'text-2xl' : 
          'text-3xl'
        }`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          <span className="bg-gradient-to-r from-gray-900 via-black to-gray-900 bg-clip-text text-transparent">
            ZARCO
          </span>
        </h1>
      </div>
    </motion.div>
  );
});

// Enhanced theme toggle with modern accent colors
const ThemeToggle = memo(function ThemeToggle({
  toggleTheme
}: {
  toggleTheme: () => void;
}) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = useCallback(async () => {
    if (isToggling) return;
    setIsToggling(true);
    await new Promise(resolve => setTimeout(resolve, 150));
    toggleTheme();
    setIsToggling(false);
  }, [toggleTheme, isToggling]);

  return (
    <motion.button
      onClick={handleToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      disabled={isToggling}
      className="relative p-3 text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300 bg-gray-100 dark:bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 rounded-xl group disabled:opacity-50 focus-visible:ring-4 focus-visible:ring-blue-300 outline-none border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 shadow-md hover:shadow-lg"
      aria-label="Alternar tema claro/escuro"
      tabIndex={0}
    >
      <motion.div
        animate={{ rotate: isToggling ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2.5" 
            d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      </motion.div>
      {/* Enhanced Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700 dark:border-gray-600">
        Alternar tema
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
      </div>
    </motion.button>
  );
});

// Enhanced navigation link component with orange accents
const NavLink = memo(function NavLink({
  href,
  children,
  isActive = false,
  className = '',
  onClick
}: {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} tabIndex={0} aria-current={isActive ? "page" : undefined}>
      <motion.span
        className={`
          relative px-5 py-3 text-lg font-bold transition-all duration-300 rounded-xl outline-none border-2
          ${isActive 
            ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 border-blue-600 shadow-lg focus-visible:ring-4 focus-visible:ring-blue-300' 
            : 'text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:border-blue-600 hover:shadow-lg focus-visible:ring-4 focus-visible:ring-blue-300'
          }
          ${className}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        tabIndex={-1}
      >
        {children}
        {isActive && (
          <motion.div
            layoutId="navbar-active-indicator"
            className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-blue-600/30 rounded-xl pointer-events-none"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.span>
    </Link>
  );
});

// Enhanced action button with orange accent
const ActionButton = memo(function ActionButton({
  href,
  icon,
  badge,
  ariaLabel,
  onClick
}: {
  href?: string;
  icon: React.ReactNode;
  badge?: number;
  ariaLabel: string;
  onClick?: () => void;
}) {
  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-3 text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300 bg-gray-100 dark:bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 rounded-xl group focus-visible:ring-4 focus-visible:ring-blue-300 outline-none border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 shadow-md hover:shadow-lg"
      tabIndex={0}
    >
      <div className="w-6 h-6">
        {icon}
      </div>
      {badge !== undefined && badge > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-full w-7 h-7 flex items-center justify-center font-bold shadow-lg ring-3 ring-white dark:ring-gray-900"
        >
          {badge > 99 ? '99+' : badge}
        </motion.span>
      )}
      {/* Enhanced Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700 dark:border-gray-600">
        {ariaLabel}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} tabIndex={0}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} aria-label={ariaLabel} tabIndex={0}>
      {buttonContent}
    </button>
  );
});

// Enhanced user menu with modern orange accents
const UserMenu = memo(function UserMenu({
  user,
  onLogout
}: {
  user: any;
  onLogout: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" data-user-menu>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-blue-500 outline-none border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        tabIndex={0}
      >
        <motion.div 
          className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-900"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </motion.div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {user?.name || 'Usuário'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user?.email?.slice(0, 20)}...
          </p>
        </div>
        <motion.svg 
          className="w-4 h-4 text-gray-500 transition-transform duration-200"
          animate={{ rotate: isOpen ? 180 : 0 }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 backdrop-blur-sm"
            role="menu"
          >
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20 rounded-t-xl">
              <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide font-semibold">
                Minha Conta
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            {[
              { href: '/profile', label: 'Meu Perfil', icon: '👤' },
              { href: '/orders', label: 'Meus Pedidos', icon: '📦' },
              { href: '/settings', label: 'Configurações', icon: '⚙️' }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300 rounded focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
                onClick={() => setIsOpen(false)}
                tabIndex={0}
                role="menuitem"
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 rounded focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
                tabIndex={0}
                role="menuitem"
              >
                <span className="mr-3 text-lg">🚪</span>
                Sair da conta
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Enhanced mobile menu with better UX
const MobileMenu = memo(function MobileMenu({
  isOpen,
  onClose,
  isAuthenticated,
  isGuest,
  user,
  onLogout,
  cartItemCount,
  wishlistItemCount,
  currentPath
}: {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  isGuest: boolean;
  user: any;
  onLogout: () => void;
  cartItemCount: number;
  wishlistItemCount: number;
  currentPath: string;
}) {
  const navigationItems = useMemo(() => [
    { href: '/welcome', label: 'Início', icon: '🏠' },
    { href: '/products', label: 'Produtos', icon: '🛍️' },
    ...(isAuthenticated ? [
      { href: '/cart', label: 'Carrinho', icon: '🛒', badge: cartItemCount },
      { href: '/wishlist', label: 'Favoritos', icon: '❤️', badge: wishlistItemCount }
    ] : [])
  ], [isAuthenticated, cartItemCount, wishlistItemCount]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Fechar menu"
            tabIndex={0}
          />
          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: NAVBAR_CONSTANTS.animations.easing }}
            className="fixed right-0 top-0 h-full w-80 max-w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-l border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <ResponsiveLogo size="md" />
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-orange-500 outline-none"
                aria-label="Fechar menu"
                tabIndex={0}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
            {/* Navigation */}
            <nav className="flex flex-col p-6 space-y-2" role="menu">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`
                      flex items-center justify-between p-3 rounded-xl transition-all duration-300 outline-none
                      ${currentPath === item.href 
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-400 shadow focus-visible:ring-2 focus-visible:ring-blue-500' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500'
                      }
                    `}
                    onClick={onClose}
                    tabIndex={0}
                    role="menuitem"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-semibold">{item.label}</span>
                    </div>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-red-600 text-white text-xs rounded-full px-2 py-1 font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
              {isGuest && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4"
                >
                  <Link
                    href="/auth"
                    className="flex items-center justify-center p-3 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl focus-visible:ring-2 focus-visible:ring-blue-500 outline-none tracking-wide"
                    onClick={onClose}
                    tabIndex={0}
                    role="menuitem"
                  >
                    <span className="mr-2">🔐</span>
                    Fazer Login
                  </Link>
                </motion.div>
              )}
            </nav>
            {/* User Info (Bottom) */}
            {isAuthenticated && user && (
              <div className="absolute bottom-6 left-6 right-6">
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center space-x-3 mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white dark:text-black font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-blue-700 dark:text-blue-400 text-sm truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center p-3 text-red-600 dark:text-red-400 font-semibold border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
                    tabIndex={0}
                  >
                    <span className="mr-2">🚪</span>
                    Sair da conta
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// Main Navbar component with enhanced professional design
export default memo(function Navbar({ 
  cartItemCount = 0, 
  wishlistItemCount = 0, 
  className = '' 
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isGuest, user, logout } = useAuthContext();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Scroll detection for navbar styling
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  // Determine logo size based on screen size and scroll state
  const logoSize = useMemo(() => {
    if (isScrolled) return 'sm';
    return 'md';
  }, [isScrolled]);

  // Navigation items configuration
  const navigationItems = useMemo<NavigationItem[]>(() => [
    { href: '/welcome', label: 'Início' },
    { href: '/products', label: 'Produtos' }
  ], []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, [logout, router]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Enhanced cart and wishlist icons
  const cartIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );

  const wishlistIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );

  return (
    <>
      <motion.nav
        initial={false}
        className={`
          sticky top-0 z-50 border-b
          bg-white
          text-gray-900 dark:text-white
          border-gray-200 dark:border-gray-700
          shadow-lg dark:shadow-gray-900/20
          ${className}
        `}
        role="navigation"
        aria-label="Barra de navegação principal"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`
            flex justify-between items-center transition-all duration-300
            ${isScrolled ? 'py-3' : 'py-4'}
          `}>
            {/* Enhanced Logo with Image */}
            <Link href="/welcome" className="flex items-center focus-visible:ring-2 focus-visible:ring-orange-500 outline-none rounded-lg" tabIndex={0} aria-label="ZARCO - Página inicial">
              <ResponsiveLogo size={logoSize} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  isActive={pathname === item.href}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              <ThemeToggle toggleTheme={toggleTheme} />
              {isAuthenticated && (
                <>
                  <ActionButton
                    href="/cart"
                    icon={cartIcon}
                    badge={cartItemCount}
                    ariaLabel={`Carrinho (${cartItemCount} itens)`}
                  />
                  <ActionButton
                    href="/wishlist"
                    icon={wishlistIcon}
                    badge={wishlistItemCount}
                    ariaLabel={`Favoritos (${wishlistItemCount} itens)`}
                  />
                  <UserMenu user={user} onLogout={handleLogout} />
                </>
              )}
              {isGuest && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/auth"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-7 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl focus-visible:ring-4 focus-visible:ring-blue-300 outline-none tracking-wide border-2 border-blue-600 hover:border-blue-700"
                    tabIndex={0}
                  >
                    Fazer Login
                  </Link>
                </motion.div>
              )}
            </div>
            
            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center space-x-3">
              <ThemeToggle toggleTheme={toggleTheme} />
              <motion.button
                onClick={() => setIsMobileMenuOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 bg-gray-100 dark:bg-gray-800 rounded-xl transition-all duration-300 focus-visible:ring-4 focus-visible:ring-blue-300 outline-none border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 shadow-md hover:shadow-lg"
                aria-label="Abrir menu"
                tabIndex={0}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>
      
      {/* Mobile Sidebar with enhanced design */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        isAuthenticated={isAuthenticated}
        isGuest={isGuest}
        user={user}
        onLogout={handleLogout}
        cartItemCount={cartItemCount}
        wishlistItemCount={wishlistItemCount}
        currentPath={pathname}
      />
    </>
  );
});
"use client";

import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

// Enhanced interfaces following Interface Segregation Principle
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  badge?: 'new' | 'sale' | 'trending';
  rating?: number;
  size?: string[];
  color?: string[];
}

interface Category {
  name: string;
  icon: string;
  href: string;
  count: number;
}

interface PromoSlide {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  description: string;
  cta: string;
  href: string;
}

// Promotional Carousel Component
const PromoCarousel = memo(function PromoCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const promoSlides: PromoSlide[] = useMemo(() => [
    {
      id: '1',
      title: 'Camisas Premium',
      subtitle: 'Coleção Executiva',
      discount: '40% OFF',
      description: 'Camisas sociais de alta qualidade para o homem moderno',
      cta: 'Comprar Agora',
      href: '/products?category=social'
    },
    {
      id: '2',
      title: 'Casual Friday',
      subtitle: 'Estilo Descontraído',
      discount: '30% OFF',
      description: 'Camisas casuais perfeitas para o ambiente de trabalho',
      cta: 'Ver Coleção',
      href: '/products?category=casual'
    },
    {
      id: '3',
      title: 'Slim Fit',
      subtitle: 'Corte Moderno',
      discount: '35% OFF',
      description: 'Modelagem ajustada para um visual contemporâneo',
      cta: 'Descobrir',
      href: '/products?category=slim'
    },
    {
      id: '4',
      title: 'Básicas Essential',
      subtitle: 'Versatilidade Total',
      discount: '25% OFF',
      description: 'Camisas básicas que combinam com tudo',
      cta: 'Explorar',
      href: '/products?category=basicas'
    }
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [promoSlides.length]);

  return (
    <div className="relative h-20 bg-black text-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Link href={promoSlides[currentSlide].href} className="flex items-center space-x-6 hover:bg-gray-900 px-8 py-4 rounded-lg transition-colors duration-200">
            <div className="text-center">
              <span className="text-2xl font-bold text-white">{promoSlides[currentSlide].discount}</span>
              <span className="text-sm ml-2 text-gray-300">em {promoSlides[currentSlide].title}</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-gray-300">{promoSlides[currentSlide].description}</p>
            </div>
            <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              {promoSlides[currentSlide].cta}
            </button>
          </Link>
        </motion.div>
      </AnimatePresence>
      
      {/* Slide indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {promoSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              currentSlide === index ? 'bg-white' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
});

// Memoized Hero Section with carousel
const HeroSection = memo(function HeroSection() {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  
  const heroSlides = useMemo(() => [
    {
      id: 'inicial',
      slogan: '"Superar limites começa no espelho"',
      title: 'Elegância e Qualidade',
      subtitle: 'em Cada Camisa',
      description: 'Descubra nossa coleção exclusiva de camisas premium.',
      subdescription: 'Desde o casual ao executivo, temos o estilo perfeito para você.',
      primaryBtn: 'EXPLORAR COLEÇÃO',
      secondaryBtn: 'VER DESTAQUES',
      primaryHref: '/products',
      secondaryHref: '/products?featured=true'
    },
    {
      id: 'destaque',
      slogan: null,
      title: 'Produtos em Destaque',
      subtitle: 'Seleção Premium',
      description: 'Peças cuidadosamente selecionadas pelos nossos especialistas.',
      subdescription: 'Qualidade excepcional, design moderno e conforto incomparável.',
      primaryBtn: 'VER DESTAQUES',
      secondaryBtn: 'NOVA COLEÇÃO',
      primaryHref: '/products?featured=true',
      secondaryHref: '/products?new=true'
    },
    {
      id: 'promocao',
      slogan: null,
      title: 'Ofertas Exclusivas',
      subtitle: 'Até 50% OFF',
      description: 'Aproveite nossas promoções em camisas selecionadas.',
      subdescription: 'Oportunidade única para renovar seu guarda-roupa com qualidade.',
      primaryBtn: 'VER OFERTAS',
      secondaryBtn: 'TODOS PRODUTOS',
      primaryHref: '/products?sale=true',
      secondaryHref: '/products'
    }
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const currentSlide = heroSlides[currentHeroSlide];

  return (
    <div className="relative bg-gradient-to-br from-gray-100 via-gray-50 to-white text-black overflow-hidden min-h-[85vh] flex items-center">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3a8a' fill-opacity='0.08'%3E%3Cpath d='M30 30c0-16.5-13.5-30-30-30s-30 13.5-30 30 13.5 30 30 30 30-13.5 30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-12"
          >
            {/* Enhanced Slogan - only show if slogan exists */}
            {currentSlide.slogan && (
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <p className="text-3xl md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 bg-clip-text text-transparent font-bold italic leading-tight">
                    {currentSlide.slogan}
                  </p>
                </div>
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: currentSlide.slogan ? 0.4 : 0.2 }}
              className="space-y-8"
            >
              <h1 className="text-4xl md:text-6xl font-light text-black leading-tight max-w-4xl mx-auto">
                <span className="bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent">
                  {currentSlide.title}
                </span>
                <span className="block mt-2 font-bold">
                  {currentSlide.subtitle.includes('OFF') ? (
                    <span className="text-blue-900">{currentSlide.subtitle}</span>
                  ) : (
                    <>
                      {currentSlide.subtitle.split(' ').slice(0, -1).join(' ')} <span className="text-blue-900">{currentSlide.subtitle.split(' ').slice(-1)}</span>
                    </>
                  )}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
                {currentSlide.description}
                <span className="block mt-2 text-black font-medium">
                  {currentSlide.subdescription}
                </span>
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: currentSlide.slogan ? 0.6 : 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                href={currentSlide.primaryHref}
                className="group px-12 py-4 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-center min-w-[200px] transform hover:-translate-y-1"
              >
                <span className="tracking-wide">{currentSlide.primaryBtn}</span>
              </Link>
              <Link
                href={currentSlide.secondaryHref}
                className="group px-12 py-4 border-2 border-blue-900 text-blue-900 rounded-xl font-semibold hover:bg-blue-900 hover:text-white transition-all duration-300 text-center min-w-[200px] transform hover:-translate-y-1"
              >
                <span className="tracking-wide">{currentSlide.secondaryBtn}</span>
              </Link>
            </motion.div>
            
            {/* Enhanced Stats with blue accents - only show on initial slide */}
            {currentSlide.id === 'inicial' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="grid grid-cols-3 gap-12 pt-16 border-t border-blue-200 max-w-2xl mx-auto"
              >
                {[
                  { label: 'Modelos Exclusivos', value: '200+', icon: '👔' },
                  { label: 'Clientes Satisfeitos', value: '5K+', icon: '⭐' },
                  { label: 'Qualidade Premium', value: '100%', icon: '🏆' }
                ].map((stat, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center group cursor-default"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                      {stat.icon}
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium tracking-wide">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentHeroSlide === index 
                  ? 'bg-blue-900 scale-110' 
                  : 'bg-gray-400 hover:bg-blue-600'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-blue-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Slide anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-blue-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Próximo slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
});

// Enhanced Product Card with availability indicators like Insider
const FeaturedProductCard = memo(function FeaturedProductCard({ 
  product,
  onAddToCart,
  index 
}: { 
  product: Product;
  onAddToCart: (productId: string) => void;
  index: number;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Simulated availability data (like Insider)
  const availability = useMemo(() => ({
    inStock: Math.random() > 0.2,
    lowStock: Math.random() > 0.7,
    fastShipping: Math.random() > 0.5,
    bestseller: Math.random() > 0.6,
    newArrival: Math.random() > 0.8
  }), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-gray-50 border border-gray-200 hover:border-blue-900 transition-all duration-300 overflow-hidden hover:shadow-xl"
      whileHover={{ y: -4 }}
    >
      {/* Product Display Area */}
      <div className="aspect-square relative bg-gray-100 overflow-hidden flex items-center justify-center">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        {/* Product representation with better styling */}
        <div className="text-center p-8 group-hover:scale-105 transition-transform duration-300">
          <div className="text-6xl mb-4 filter drop-shadow-sm">👔</div>
          <p className="text-sm text-gray-600 font-medium tracking-wide">{product.category}</p>
        </div>
        
        {/* Enhanced Badges like Insider */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {availability.bestseller && (
            <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-sm">
              BEST SELLER
            </span>
          )}
          {availability.newArrival && (
            <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-sm">
              NOVO
            </span>
          )}
          {product.badge && (
            <span className={`px-2 py-1 text-xs font-bold rounded-full shadow-sm ${
              product.badge === 'new' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 
              product.badge === 'sale' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' : 
              'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
            }`}>
              {product.badge === 'new' ? 'NOVO' : 
               product.badge === 'sale' ? 'OFERTA' : 
               'TREND'}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full shadow-sm">
              -{discount}% OFF
            </span>
          )}
        </div>
        
        {/* Availability Indicators */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {availability.fastShipping && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-blue-900 text-white p-1.5 rounded-full shadow-lg"
              title="Entrega Rápida"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12L8 10l2-2 2 2-2 2z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
            </motion.div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors border border-gray-200"
          >
            <motion.svg
              whileTap={{ scale: 1.2 }}
              className={`w-3 h-3 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </motion.svg>
          </button>
        </div>
        
        {/* Quick Add to Cart */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product.id);
            }}
            disabled={!availability.inStock}
            className={`w-full px-4 py-2 font-medium transition-colors duration-200 text-sm tracking-wide rounded-lg shadow-lg ${
              availability.inStock 
                ? 'bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            {availability.inStock ? 'ADICIONAR AO CARRINHO' : 'INDISPONÍVEL'}
          </button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4 space-y-3 bg-white">
        <div>
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">
            {product.category}
          </p>
          <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2">
            {product.name}
          </h3>
        </div>
        
        {/* Availability Status like Insider */}
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${
            availability.inStock 
              ? availability.lowStock 
                ? 'bg-yellow-500' 
                : 'bg-green-500'
              : 'bg-red-500'
          }`} />
          <span className={`font-medium ${
            availability.inStock 
              ? availability.lowStock 
                ? 'text-yellow-600' 
                : 'text-green-600'
              : 'text-red-600'
          }`}>
            {availability.inStock 
              ? availability.lowStock 
                ? 'Últimas unidades' 
                : 'Disponível'
              : 'Indisponível'}
          </span>
        </div>
        
        {/* Size indicators */}
        {product.size && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Tamanhos:</span>
            <div className="flex gap-1">
              {product.size.slice(0, 3).map((size, i) => (
                <span key={i} className="text-xs border border-gray-300 px-1.5 py-0.5 rounded text-gray-600 bg-gray-50">
                  {size}
                </span>
              ))}
              {product.size.length > 3 && (
                <span className="text-xs text-gray-400">+{product.size.length - 3}</span>
              )}
            </div>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-lg font-bold text-gray-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// Enhanced Category Card with better color scheme
const CategoryCard = memo(function CategoryCard({ 
  category,
  index 
}: { 
  category: Category;
  index: number;
}) {
  return (
    <Link href={category.href} className="group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 group-hover:border-blue-900 transition-all duration-300 overflow-hidden h-64 shadow-sm hover:shadow-xl group-hover:from-blue-50 group-hover:to-blue-100"
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-900 group-hover:to-blue-800 transition-all duration-300 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>
            
            <span className="text-6xl group-hover:text-white transition-colors duration-300 relative z-10 filter drop-shadow-sm">
              {category.icon}
            </span>
          </div>
          
          <div className="p-4 bg-white group-hover:bg-blue-50 transition-colors duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-900 transition-colors text-center">
              {category.name}
            </h3>
            <div className="flex items-center justify-center">
              <p className="text-sm text-gray-600 group-hover:text-blue-700">
                {category.count} modelos
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
});

export default memo(function WelcomePage() {
  const router = useRouter();
  const { isAuthenticated, isGuest, user, loading } = useAuthContext();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced mock data focused on shirts
  const featuredProducts = useMemo<Product[]>(() => [
    {
      id: '1',
      name: 'Camisa Social Executiva Premium',
      price: 189.90,
      originalPrice: 249.90,
      category: 'Social',
      badge: 'sale',
      rating: 4.8,
      size: ['P', 'M', 'G', 'GG'],
      color: ['Branco', 'Azul', 'Preto']
    },
    {
      id: '2',
      name: 'Camisa Casual Slim Fit',
      price: 129.90,
      category: 'Casual',
      badge: 'trending',
      rating: 4.6,
      size: ['P', 'M', 'G'],
      color: ['Branco', 'Cinza']
    },
    {
      id: '3',
      name: 'Camisa Básica Essential',
      price: 89.90,
      originalPrice: 119.90,
      category: 'Básica',
      badge: 'sale',
      rating: 4.9,
      size: ['P', 'M', 'G', 'GG', 'XGG'],
      color: ['Branco', 'Preto', 'Cinza']
    },
    {
      id: '4',
      name: 'Camisa Polo Moderna',
      price: 159.90,
      category: 'Polo',
      badge: 'new',
      rating: 4.7,
      size: ['P', 'M', 'G'],
      color: ['Branco', 'Preto', 'Marinho']
    }
  ], []);

  const categories = useMemo<Category[]>(() => [
    { 
      name: 'Social', 
      icon: '👔', 
      href: '/products?category=social', 
      count: 45
    },
    { 
      name: 'Casual', 
      icon: '👕', 
      href: '/products?category=casual', 
      count: 38
    },
    { 
      name: 'Polo', 
      icon: '🎽', 
      href: '/products?category=polo', 
      count: 22
    },
    { 
      name: 'Básicas', 
      icon: '⚫', 
      href: '/products?category=basicas', 
      count: 28
    }
  ], []);

  // Fetch counts
  useEffect(() => {
    const fetchCounts = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const [cartRes, wishlistRes] = await Promise.all([
          fetch('/api/cart'),
          fetch('/api/wishlist')
        ]);

        if (cartRes.ok) {
          const cartData = await cartRes.json();
          setCartItemCount(cartData.items?.length || 0);
        }

        if (wishlistRes.ok) {
          const wishlistData = await wishlistRes.json();
          setWishlistItemCount(wishlistData.items?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, [isAuthenticated]);

  const handleAddToCart = useCallback(async (productId: string) => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      if (response.ok) {
        setCartItemCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }, [isAuthenticated, router]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
          <p className="text-gray-600">Carregando experiência...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartItemCount={cartItemCount} wishlistItemCount={wishlistItemCount} />

      {/* Promotional Carousel */}
      <PromoCarousel />

      {/* Hero Section */}
      <HeroSection />

      {/* Welcome Message with better colors */}
      {(isAuthenticated || isGuest) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {isAuthenticated && user 
                  ? `Bem-vindo de volta, ${user.name}!` 
                  : 'Descubra Sua Camisa Perfeita'
                }
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto font-light">
                {isAuthenticated 
                  ? 'Explore nossa nova coleção de camisas premium e encontre o estilo ideal para cada ocasião.' 
                  : 'Camisas de alta qualidade, cortes modernos e tecidos premium. Elegância e conforto em cada peça.'
                }
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Categories Section with enhanced colors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-black mb-6">
            Nossas Coleções
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Encontre o estilo perfeito para cada momento da sua vida
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <CategoryCard 
              key={category.name} 
              category={category} 
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Featured Products with better background */}
      <section className="bg-gradient-to-br from-gray-100 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-between items-end mb-16"
          >
            <div>
              <h2 className="text-4xl font-bold text-black mb-6">
                Produtos em Destaque
              </h2>
              <p className="text-xl text-gray-600 font-light">
                Selecionados especialmente para você
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex border-2 border-blue-900 text-blue-900 px-8 py-3 font-medium hover:bg-blue-900 hover:text-white transition-all duration-300 tracking-wide"
            >
              VER TODOS OS PRODUTOS
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <FeaturedProductCard 
                key={product.id}
                product={product} 
                onAddToCart={handleAddToCart}
                index={index}
              />
            ))}
          </div>
          
          {/* Mobile View All Button */}
          <div className="mt-12 text-center sm:hidden">
            <Link
              href="/products"
              className="bg-blue-900 text-white px-12 py-4 font-medium hover:bg-blue-800 transition-all duration-300 tracking-wide"
            >
              VER TODOS OS PRODUTOS
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-4xl font-bold text-white">
              Fique por dentro das <span className="text-blue-200">novidades</span>
            </h2>
            <p className="text-xl text-blue-100 font-light">
              Receba lançamentos exclusivos, ofertas especiais e dicas de estilo
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor email"
                className="flex-1 px-6 py-4 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 font-semibold transition-all duration-300 tracking-wide rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                INSCREVER-SE
              </button>
            </form>
            
            <p className="text-sm text-blue-200">
              Seus dados estão seguros. Não enviamos spam.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="text-3xl font-bold tracking-wider text-black">
                ZARCO
              </div>
              <p className="text-gray-600 font-light">
                Sua loja especializada em camisas premium. Qualidade, estilo e elegância em cada peça.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-black mb-6 tracking-wide">PRODUTOS</h3>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="/products?category=social" className="hover:text-black transition-colors">Camisas Sociais</Link></li>
                <li><Link href="/products?category=casual" className="hover:text-black transition-colors">Camisas Casuais</Link></li>
                <li><Link href="/products?category=polo" className="hover:text-black transition-colors">Polos</Link></li>
                <li><Link href="/products?category=basicas" className="hover:text-black transition-colors">Básicas</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-black mb-6 tracking-wide">SUPORTE</h3>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="/help" className="hover:text-black transition-colors">Central de Ajuda</Link></li>
                <li><Link href="/shipping" className="hover:text-black transition-colors">Entrega</Link></li>
                <li><Link href="/returns" className="hover:text-black transition-colors">Devoluções</Link></li>
                <li><Link href="/contact" className="hover:text-black transition-colors">Contato</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-black mb-6 tracking-wide">CONECTE-SE</h3>
              <div className="flex space-x-4">
                {['Instagram', 'Facebook', 'Twitter'].map((social) => (
                  <a
                    key={social}
                    href={`#${social.toLowerCase()}`}
                    className="w-12 h-12 border-2 border-gray-300 hover:border-blue-900 flex items-center justify-center hover:bg-blue-900 hover:text-white transition-all duration-300"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-current"></div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-16 pt-8 text-center">
            <p className="text-gray-600">
              © {new Date().getFullYear()} ZARCO. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
});

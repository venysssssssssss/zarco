"use client";

import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthContext } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

// Enhanced interfaces following Interface Segregation Principle
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image_url: string;
  category: string;
  badge?: 'new' | 'sale' | 'trending';
  rating?: number;
}

interface Category {
  name: string;
  icon: string;
  href: string;
  count: number;
  image?: string;
}

// Memoized Hero Section with modern design
const HeroSection = memo(function HeroSection() {
  return (
    <div className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium"
              >
                ✨ Nova Coleção Disponível
              </motion.div>
              
              <h1 className="heading-hero text-white">
                Bem-vindo ao
                <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Zarco
                </span>
              </h1>
              
              <p className="text-body-large text-gray-300 max-w-lg">
                Descubra produtos únicos e exclusivos que definem seu estilo. 
                Qualidade premium, design inovador e tendências que inspiram.
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/products"
                className="btn-brand-primary text-center"
              >
                Explorar Coleção
              </Link>
              <Link
                href="/products?featured=true"
                className="btn-brand-secondary text-center border-white text-white hover:bg-white hover:text-black"
              >
                Ver Destaques
              </Link>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20"
            >
              {[
                { label: 'Produtos', value: '500+' },
                { label: 'Clientes', value: '10k+' },
                { label: 'Avaliação', value: '4.9★' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:ml-8"
          >
            {/* Hero Image Container with modern styling */}
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-3xl backdrop-blur-sm" />
              <div className="relative p-8 h-full flex items-center justify-center">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-full h-full relative"
                >
                  <Image
                    src="/hero-fashion.jpg"
                    alt="Fashion Collection"
                    fill
                    className="object-cover rounded-2xl"
                    priority
                    onError={(e: any) => {
                      e.target.src = '/products/placeholder.svg';
                    }}
                  />
                </motion.div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-white text-black px-4 py-2 rounded-xl font-semibold shadow-lg"
              >
                30% OFF
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl shadow-lg"
              >
                Frete Grátis
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
});

// Enhanced Category Card with better visual hierarchy
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
        className="card-primary group-hover:shadow-elevated transition-all duration-300 overflow-hidden"
      >
        <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </span>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-black dark:group-hover:text-white transition-colors">
            {category.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {category.count} produtos
            </p>
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
            >
              →
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
});

// Enhanced Product Card with modern e-commerce features
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group card-primary overflow-hidden"
      whileHover={{ y: -4 }}
    >
      {/* Image Container */}
      <div className="aspect-square relative bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setImageLoaded(true)}
          onError={(e: any) => {
            e.target.src = '/products/placeholder.svg';
            setImageLoaded(true);
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.badge && (
            <span className={`badge ${
              product.badge === 'new' ? 'badge-success' : 
              product.badge === 'sale' ? 'badge-error' : 
              'badge-warning'
            }`}>
              {product.badge === 'new' ? 'Novo' : 
               product.badge === 'sale' ? 'Promoção' : 
               'Tendência'}
            </span>
          )}
          {discount > 0 && (
            <span className="badge badge-error">
              -{discount}%
            </span>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
          >
            <motion.svg
              whileTap={{ scale: 1.2 }}
              className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`}
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
            className="w-full btn-brand-primary py-2 text-sm"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-black dark:group-hover:text-white transition-colors">
            {product.name}
          </h3>
        </div>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.rating})</span>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
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

export default memo(function WelcomePage() {
  const router = useRouter();
  const { isAuthenticated, isGuest, user, loading } = useAuthContext();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced mock data with more realistic e-commerce features
  const featuredProducts = useMemo<Product[]>(() => [
    {
      id: '1',
      name: 'Camiseta Premium Essential',
      price: 89.90,
      originalPrice: 129.90,
      image_url: '/products/tshirt-1.jpg',
      category: 'Camisetas',
      badge: 'sale',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Calça Jeans Slim Fit Premium',
      price: 149.90,
      image_url: '/products/jeans-1.jpg',
      category: 'Calças',
      badge: 'trending',
      rating: 4.6
    },
    {
      id: '3',
      name: 'Tênis Casual Urbano',
      price: 299.90,
      originalPrice: 399.90,
      image_url: '/products/sneaker-1.jpg',
      category: 'Calçados',
      badge: 'sale',
      rating: 4.9
    },
    {
      id: '4',
      name: 'Jaqueta Bomber Exclusiva',
      price: 399.90,
      image_url: '/products/jacket-1.jpg',
      category: 'Jaquetas',
      badge: 'new',
      rating: 4.7
    }
  ], []);

  const categories = useMemo<Category[]>(() => [
    { 
      name: 'Camisetas', 
      icon: '👕', 
      href: '/products?category=camisetas', 
      count: 25,
      image: '/categories/tshirts.jpg'
    },
    { 
      name: 'Calças', 
      icon: '👖', 
      href: '/products?category=calcas', 
      count: 18,
      image: '/categories/pants.jpg'
    },
    { 
      name: 'Calçados', 
      icon: '👟', 
      href: '/products?category=calcados', 
      count: 12,
      image: '/categories/shoes.jpg'
    },
    { 
      name: 'Acessórios', 
      icon: '⌚', 
      href: '/products?category=acessorios', 
      count: 8,
      image: '/categories/accessories.jpg'
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
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando experiência...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar cartItemCount={cartItemCount} wishlistItemCount={wishlistItemCount} />

      {/* Hero Section */}
      <HeroSection />

      {/* Welcome Message with enhanced design */}
      {(isAuthenticated || isGuest) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isAuthenticated && user 
                  ? `Olá, ${user.name}! 👋` 
                  : 'Bem-vindo à nossa loja! 👋'
                }
              </h2>
              <p className="text-body-large max-w-2xl mx-auto">
                {isAuthenticated 
                  ? 'Que bom te ver de volta! Confira nossas novidades e ofertas especiais.' 
                  : 'Explore nossa coleção exclusiva de produtos premium com os melhores preços.'
                }
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Categories Section with enhanced grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="heading-section mb-4">
            Explore por Categoria
          </h2>
          <p className="text-body-large max-w-2xl mx-auto">
            Descubra nossa seleção cuidadosa de produtos organizados por categoria
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard 
              key={category.name} 
              category={category} 
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Featured Products with enhanced presentation */}
      <section className="bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="heading-section mb-4">
                Produtos em Destaque
              </h2>
              <p className="text-body-large">
                Selecionados especialmente para você
              </p>
            </div>
            <Link
              href="/products"
              className="btn-brand-secondary hidden sm:inline-flex"
            >
              Ver Todos os Produtos
            </Link>
          </motion.div>
          
          <div className="product-grid">
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
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/products"
              className="btn-brand-primary"
            >
              Ver Todos os Produtos
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-900 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto space-y-8"
          >
            <h2 className="heading-section text-white">
              Fique por dentro das novidades
            </h2>
            <p className="text-body-large text-gray-300">
              Receba em primeira mão lançamentos, ofertas exclusivas e tendências de moda
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor email"
                className="flex-1 form-input-modern bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
              <button
                type="submit"
                className="btn-brand-primary bg-white text-black hover:bg-gray-100"
              >
                Inscrever-se
              </button>
            </form>
            
            <p className="text-sm text-gray-400">
              Seus dados estão seguros. Não enviamos spam.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Image
                src="/zarcologo.png"
                alt="Zarco Logo"
                width={120}
                height={40}
                className="dark:invert"
              />
              <p className="text-gray-600 dark:text-gray-400">
                Sua loja de moda moderna com os melhores produtos e atendimento excepcional.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Produtos</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><Link href="/products?category=camisetas" className="hover:text-gray-900 dark:hover:text-white">Camisetas</Link></li>
                <li><Link href="/products?category=calcas" className="hover:text-gray-900 dark:hover:text-white">Calças</Link></li>
                <li><Link href="/products?category=calcados" className="hover:text-gray-900 dark:hover:text-white">Calçados</Link></li>
                <li><Link href="/products?category=acessorios" className="hover:text-gray-900 dark:hover:text-white">Acessórios</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><Link href="/help" className="hover:text-gray-900 dark:hover:text-white">Central de Ajuda</Link></li>
                <li><Link href="/shipping" className="hover:text-gray-900 dark:hover:text-white">Entrega</Link></li>
                <li><Link href="/returns" className="hover:text-gray-900 dark:hover:text-white">Devoluções</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900 dark:hover:text-white">Contato</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Conecte-se</h3>
              <div className="flex space-x-4">
                {['facebook', 'instagram', 'twitter'].map((social) => (
                  <a
                    key={social}
                    href={`#${social}`}
                    className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-gray-600 dark:bg-gray-400 rounded"></div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Zarco. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
});
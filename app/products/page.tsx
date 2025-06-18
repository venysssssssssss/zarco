"use client";

import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthContext } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

// Optimized Product interface
interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  description?: string;
}

// Memoized ProductCard for performance
// Enhanced ProductCard with availability indicators
const ProductCard = memo(function ProductCard({ 
  product,
  onAddToCart,
  onAddToWishlist 
}: { 
  product: Product;
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Simulated availability data
  const availability = useMemo(() => ({
    inStock: product.stock > 0,
    lowStock: product.stock <= 3 && product.stock > 0,
    fastShipping: Math.random() > 0.5,
    bestseller: Math.random() > 0.7
  }), [product.stock]);

  return (
    <motion.div
      className="bg-white border border-gray-200 hover:border-blue-900 overflow-hidden hover:shadow-xl transition-all duration-200 group"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <div className="aspect-square relative bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        <Image
          src={product.image_url || '/products/placeholder.svg'}
          alt={product.name}
          fill
          className={`object-cover transition-all duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setImageLoaded(true)}
          onError={(e: any) => {
            e.target.src = '/products/placeholder.svg';
            setImageLoaded(true);
          }}
        />
        
        {/* Enhanced badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {availability.bestseller && (
            <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-sm">
              BEST SELLER
            </span>
          )}
          {availability.fastShipping && (
            <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-sm">
              ENTREGA RÁPIDA
            </span>
          )}
        </div>
        
        {/* Availability indicator */}
        <div className="absolute top-3 right-3">
          <div className={`w-3 h-3 rounded-full shadow-sm ${
            availability.inStock 
              ? availability.lowStock 
                ? 'bg-yellow-500' 
                : 'bg-green-500'
              : 'bg-red-500'
          }`} />
        </div>
      </div>
      
      <div className="p-4 bg-white">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {product.category}
        </p>
        
        {/* Availability status */}
        <div className="flex items-center gap-2 text-xs mb-3">
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
                ? `Restam ${product.stock} unidades` 
                : 'Disponível'
              : 'Indisponível'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => onAddToWishlist(product.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-150 bg-gray-50 hover:bg-red-50 rounded-lg"
              aria-label="Add to wishlist"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button
              onClick={() => onAddToCart(product.id)}
              disabled={!availability.inStock}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                availability.inStock
                  ? 'bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {availability.inStock ? 'Comprar' : 'Indisponível'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Loading skeleton component
const ProductSkeleton = memo(function ProductSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-2/3" />
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
        </div>
      </div>
    </div>
  );
});

export default memo(function ProductsPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  // Fetch products data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback mock data for development
        setProducts([
          {
            id: '1',
            name: 'Camiseta Premium',
            price: 89.90,
            image_url: '/products/placeholder.svg',
            category: 'Camisetas',
            stock: 10
          },
          {
            id: '2',
            name: 'Calça Jeans Slim',
            price: 149.90,
            image_url: '/products/placeholder.svg',
            category: 'Calças',
            stock: 5
          },
          {
            id: '3',
            name: 'Tênis Esportivo',
            price: 299.90,
            image_url: '/products/placeholder.svg',
            category: 'Calçados',
            stock: 8
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch cart and wishlist counts
  useEffect(() => {
    const fetchCounts = async () => {
      if (!isAuthenticated) return;

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
      }
    };

    fetchCounts();
  }, [isAuthenticated]);

  // Optimized handlers
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

  const handleAddToWishlist = useCallback(async (productId: string) => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });

      if (response.ok) {
        setWishlistItemCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  }, [isAuthenticated, router]);

  // Optimized filtering and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = products.filter(p => p.category === selectedCategory);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [products, selectedCategory, sortBy]);

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartItemCount={cartItemCount} wishlistItemCount={wishlistItemCount} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with better styling */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Nossos Produtos
          </h1>
          <p className="text-gray-700">
            Descubra nossa coleção exclusiva de produtos premium
          </p>
        </div>

        {/* Enhanced Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >
              <option value="all">Todas as categorias</option>
              {categories.filter(cat => cat !== 'all').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >
              <option value="name">Nome</option>
              <option value="price-low">Menor preço</option>
              <option value="price-high">Maior preço</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }, (_, i) => (
              <ProductSkeleton key={i} />
            ))
          ) : filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Tente ajustar os filtros para encontrar o que procura
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
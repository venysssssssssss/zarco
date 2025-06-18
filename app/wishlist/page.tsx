"use client";

import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthContext } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

// Optimized interfaces
interface WishlistItem {
  id: string;
  product_id: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    category: string;
    stock: number;
  };
}

// Memoized WishlistItemCard for performance
const WishlistItemCard = memo(function WishlistItemCard({ 
  item,
  onRemove,
  onAddToCart 
}: { 
  item: WishlistItem;
  onRemove: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow duration-200"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      layout
    >
      <div className="flex flex-col sm:flex-row">
        {/* Product Image */}
        <div className="sm:w-48 h-48 sm:h-auto relative bg-gray-100 dark:bg-gray-800">
          <Image
            src={item.product?.image_url || '/products/placeholder.svg'}
            alt={item.product?.name || 'Produto'}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 192px"
            onError={(e: any) => {
              e.target.src = '/products/placeholder.svg';
            }}
          />
        </div>
        
        {/* Product Details */}
        <div className="flex-1 p-6">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {item.product?.name || 'Produto indisponível'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Categoria: {item.product?.category || 'N/A'}
              </p>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {item.product?.price
                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price)
                  : 'Preço indisponível'
                }
              </div>
              {item.product?.stock !== undefined && (
                <p className={`text-sm mb-4 ${
                  item.product.stock > 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {item.product.stock > 0 
                    ? `${item.product.stock} em estoque` 
                    : 'Fora de estoque'
                  }
                </p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onAddToCart(item.product_id)}
                disabled={!item.product || item.product.stock <= 0}
                className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-150 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
              >
                {item.product?.stock > 0 ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
              </button>
              <button
                onClick={() => onRemove(item.product_id)}
                className="px-6 py-3 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Loading skeleton component
const WishlistSkeleton = memo(function WishlistSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-48 sm:h-auto bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="flex-1 p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 w-1/3" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 w-1/4" />
          <div className="flex gap-3">
            <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-24 h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default memo(function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthContext();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, loading, router]);

  // Fetch wishlist and cart data
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      try {
        const [wishlistRes, cartRes] = await Promise.all([
          fetch('/api/wishlist'),
          fetch('/api/cart')
        ]);

        if (wishlistRes.ok) {
          const wishlistData = await wishlistRes.json();
          setWishlistItems(wishlistData.items || []);
        }

        if (cartRes.ok) {
          const cartData = await cartRes.json();
          setCartItemCount(cartData.items?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback mock data for development
        setWishlistItems([
          {
            id: '1',
            product_id: '1',
            product: {
              id: '1',
              name: 'Camiseta Premium Zarco',
              price: 89.90,
              image_url: '/products/placeholder.svg',
              category: 'Camisetas',
              stock: 10
            }
          },
          {
            id: '2',
            product_id: '2',
            product: {
              id: '2',
              name: 'Calça Jeans Slim',
              price: 149.90,
              image_url: '/products/placeholder.svg',
              category: 'Calças',
              stock: 0
            }
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Optimized handlers
  const handleRemoveFromWishlist = useCallback(async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setWishlistItems(prevItems => 
          prevItems.filter(item => item.product_id !== productId)
        );
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  }, []);

  const handleAddToCart = useCallback(async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      if (response.ok) {
        setCartItemCount(prev => prev + 1);
        // Optionally remove from wishlist after adding to cart
        // handleRemoveFromWishlist(productId);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }, []);

  const handleClearWishlist = useCallback(async () => {
    try {
      const response = await fetch('/api/wishlist?clear=true', {
        method: 'DELETE'
      });

      if (response.ok) {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  }, []);

  const handleAddAllToCart = useCallback(async () => {
    const availableItems = wishlistItems.filter(item => 
      item.product && item.product.stock > 0
    );

    try {
      const promises = availableItems.map(item =>
        fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: item.product_id, quantity: 1 })
        })
      );

      await Promise.all(promises);
      setCartItemCount(prev => prev + availableItems.length);
    } catch (error) {
      console.error('Error adding all to cart:', error);
    }
  }, [wishlistItems]);

  // Computed values
  const availableItemsCount = useMemo(() => 
    wishlistItems.filter(item => item.product && item.product.stock > 0).length,
    [wishlistItems]
  );

  const totalValue = useMemo(() => 
    wishlistItems.reduce((total, item) => 
      total + (item.product?.price || 0), 0
    ),
    [wishlistItems]
  );

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar cartItemCount={cartItemCount} wishlistItemCount={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64 mb-4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96" />
          </div>
          <div className="space-y-6">
            {Array.from({ length: 3 }, (_, i) => (
              <WishlistSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar cartItemCount={cartItemCount} wishlistItemCount={wishlistItems.length} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Meus Favoritos
          </h1>
          {wishlistItems.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-gray-600 dark:text-gray-400">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'itens'} na sua lista de desejos
                {availableItemsCount !== wishlistItems.length && (
                  <span className="text-orange-600 dark:text-orange-400 ml-2">
                    ({availableItemsCount} disponíveis)
                  </span>
                )}
              </p>
              
              <div className="flex gap-3">
                {availableItemsCount > 0 && (
                  <button
                    onClick={handleAddAllToCart}
                    className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-150"
                  >
                    Adicionar Disponíveis ao Carrinho
                  </button>
                )}
                
                <button
                  onClick={handleClearWishlist}
                  className="px-6 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                >
                  Limpar Lista
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wishlist Content */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">
                Sua lista de favoritos está vazia
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Explore nossos produtos e adicione seus favoritos aqui. Assim você pode acompanhar os itens que mais gosta!
              </p>
              <Link 
                href="/products" 
                className="inline-flex items-center justify-center px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200"
              >
                Explorar Produtos
              </Link>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Summary Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center sm:text-left">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Total de Itens
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {wishlistItems.length}
                  </p>
                </div>
                
                <div className="text-center sm:text-left">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Disponíveis
                  </h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                    {availableItemsCount}
                  </p>
                </div>
                
                <div className="text-center sm:text-left">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Valor Total
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                  </p>
                </div>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="space-y-6">
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <WishlistItemCard
                    item={item}
                    onRemove={handleRemoveFromWishlist}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Zarco. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
});
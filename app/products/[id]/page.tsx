"use client";

import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthContext } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

// Optimized interfaces
interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  description: string;
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

// Memoized components
const ProductImageGallery = memo(function ProductImageGallery({ 
  product 
}: { 
  product: Product 
}) {
  return (
    <div className="space-y-6">
      {/* Main Product Display */}
      <div className="aspect-square bg-gray-50 border-2 border-gray-200 flex items-center justify-center">
        <div className="text-center p-12">
          <div className="text-8xl mb-6">👔</div>
          <h3 className="text-2xl font-bold text-black mb-2">{product.name}</h3>
          <p className="text-lg text-gray-600">{product.category}</p>
        </div>
      </div>
      
      {/* Product Features */}
      <div className="grid grid-cols-3 gap-4">
        {['Qualidade Premium', '100% Algodão', 'Corte Moderno'].map((feature, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 border border-gray-200">
            <div className="text-2xl mb-2">✓</div>
            <p className="text-sm font-medium text-gray-700">{feature}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

const RelatedProductCard = memo(function RelatedProductCard({ 
  product,
  onAddToCart 
}: { 
  product: RelatedProduct;
  onAddToCart: (productId: string) => void;
}) {
  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        className="bg-white border-2 border-gray-200 hover:border-black transition-all duration-300 overflow-hidden"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
      >
        <div className="aspect-square relative bg-gray-50 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="text-4xl mb-3">👔</div>
            <p className="text-sm text-gray-600">{product.category}</p>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-bold text-black mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {product.category}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-black">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(product.id);
              }}
              className="px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors duration-150 tracking-wide"
            >
              COMPRAR
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
});

// Troque a assinatura do componente para async se for server component:
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);

  // Resolve params first
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setProductId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        
        if (response.ok) {
          const data = await response.json();
          setProduct(data.product);
        } else {
          // Fallback mock data for development
          setProduct({
            id: productId,
            name: 'Camiseta Premium Zarco',
            price: 89.90,
            image_url: '/products/placeholder.svg',
            category: 'Camisetas',
            stock: 10,
            description: 'Uma camiseta premium feita com materiais de alta qualidade. Design moderno e confortável, perfeita para o dia a dia. Disponível em várias cores e tamanhos.'
          });
        }

        // Mock related products
        setRelatedProducts([
          {
            id: '2',
            name: 'Calça Jeans Slim',
            price: 149.90,
            image_url: '/products/placeholder.svg',
            category: 'Calças'
          },
          {
            id: '3',
            name: 'Tênis Esportivo',
            price: 299.90,
            image_url: '/products/placeholder.svg',
            category: 'Calçados'
          },
          {
            id: '4',
            name: 'Jaqueta de Couro',
            price: 399.90,
            image_url: '/products/placeholder.svg',
            category: 'Jaquetas'
          },
          {
            id: '5',
            name: 'Relógio Clássico',
            price: 199.90,
            image_url: '/products/placeholder.svg',
            category: 'Acessórios'
          }
        ]);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Fetch counts and wishlist status
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !productId) return;

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
          
          // Check if current product is in wishlist
          const isInList = wishlistData.items?.some((item: any) => 
            item.product_id === productId
          );
          setIsInWishlist(isInList || false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isAuthenticated, productId]);

  // Handlers
  const handleAddToCart = useCallback(async () => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    if (!product) return;

    setIsAddingToCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity })
      });

      if (response.ok) {
        setCartItemCount(prev => prev + quantity);
        // Show success feedback (could be a toast notification)
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  }, [isAuthenticated, router, product, quantity]);

  const handleToggleWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    if (!product) return;

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist?productId=${product.id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setIsInWishlist(false);
          setWishlistItemCount(prev => prev - 1);
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        });

        if (response.ok) {
          setIsInWishlist(true);
          setWishlistItemCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  }, [isAuthenticated, router, product, isInWishlist]);

  const handleRelatedProductAddToCart = useCallback(async (productId: string) => {
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

  // Loading state
  if (loading || isLoading || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartItemCount={cartItemCount} wishlistItemCount={wishlistItemCount} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              <div className="flex space-x-2">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
              </div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartItemCount={cartItemCount} wishlistItemCount={wishlistItemCount} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/welcome" className="text-gray-500 hover:text-black transition-colors">
                Início
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/products" className="text-gray-500 hover:text-black transition-colors">
                  Produtos
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-black font-medium">
                  {product.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProductImageGallery product={product} />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-black mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600">
                Categoria: {product.category}
              </p>
            </div>

            <div className="text-4xl font-bold text-black">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </div>

            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description}
              </p>
              
              <div className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                product.stock > 0 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {product.stock > 0 ? `${product.stock} em estoque` : 'Fora de estoque'}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <label className="text-lg font-medium text-black">
                  Quantidade:
                </label>
                <div className="flex items-center border-2 border-gray-300">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-16 h-12 flex items-center justify-center text-black bg-white font-medium">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || isAddingToCart}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center tracking-wide rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
                >
                  {isAddingToCart ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l-3-2.647z"></path>
                      </svg>
                      ADICIONANDO...
                    </>
                  ) : product.stock <= 0 ? (
                    'FORA DE ESTOQUE'
                  ) : (
                    'ADICIONAR AO CARRINHO'
                  )}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`px-8 py-4 font-semibold transition-all duration-200 flex items-center justify-center tracking-wide rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                    isInWishlist
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                      : 'border-2 border-orange-500 text-orange-600 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isInWishlist ? 'REMOVER DOS FAVORITOS' : 'ADICIONAR AOS FAVORITOS'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-black mb-12">
            Produtos Relacionados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <RelatedProductCard
                  product={relatedProduct}
                  onAddToCart={handleRelatedProductAddToCart}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-2xl font-bold tracking-wider text-black mb-4">
              ZARCO
            </div>
            <p className="text-gray-600">
              © {new Date().getFullYear()} ZARCO. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  inWishlist?: boolean;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
}

export default function ProductCard({
  product,
  inWishlist = false,
  onAddToCart,
  onToggleWishlist
}: ProductCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    
    if (isAddingToCart || !product.stock || product.stock <= 0) return;
    
    setIsAddingToCart(true);
    
    try {
      if (onAddToCart) {
        await onAddToCart(product.id);
      } else {
        // Fallback caso onAddToCart não seja fornecido
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId: product.id, quantity: 1 })
        });

        if (res.ok) {
          // Mostrar feedback visual (opcional)
        } else {
          console.error('Erro ao adicionar ao carrinho');
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    
    if (isTogglingWishlist) return;
    
    setIsTogglingWishlist(true);
    
    try {
      if (onToggleWishlist) {
        await onToggleWishlist(product.id);
      } else {
        // Fallback caso onToggleWishlist não seja fornecido
        const method = inWishlist ? 'DELETE' : 'POST';
        const url = inWishlist 
          ? `/api/wishlist?productId=${product.id}` 
          : '/api/wishlist';
        
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          ...(method === 'POST' && {
            body: JSON.stringify({ productId: product.id })
          })
        });

        if (res.ok) {
          // Atualizar estado local (em um componente real, você provavelmente usaria Context ou SWR)
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar wishlist:', error);
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  return (
    <motion.div 
      className="group bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Badges */}
      {product.featured && (
        <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-white px-2 py-1 text-xs font-medium rounded">
          Destaque
        </div>
      )}
      
      {product.stock === 0 && (
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
          Esgotado
        </div>
      )}
      
      {product.discount_percentage > 0 && (
        <div className="absolute top-2 right-2 z-10 bg-green-500 text-white px-2 py-1 text-xs font-medium rounded">
          -{product.discount_percentage}%
        </div>
      )}

      {/* Imagem do Produto */}
      <div className="aspect-[3/4] relative overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <Image
            src={product.image_url || '/products/placeholder.svg'}
            alt={product.name}
            fill
            className="object-cover object-center transform transition-transform duration-300 group-hover:scale-105"
            onError={(e: any) => {
              e.target.onerror = null; 
              e.target.src = '/products/placeholder.svg';
            }}
          />
        </Link>
        
        {/* Overlay com ações do produto ao passar o mouse */}
        <div 
          className={`absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Link
            href={`/products/${product.id}`}
            className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition transform hover:scale-105 w-3/4 text-center"
          >
            Ver detalhes
          </Link>
          
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock <= 0}
            className="bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition transform hover:scale-105 w-3/4 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isAddingToCart ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adicionando...
              </>
            ) : (
              product.stock > 0 ? 'Adicionar ao carrinho' : 'Esgotado'
            )}
          </button>
        </div>
        
        {/* Botão de Favoritos */}
        <button
          onClick={handleToggleWishlist}
          disabled={isTogglingWishlist}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            product.discount_percentage > 0 ? 'top-12' : 'top-2'
          } ${
            inWishlist 
              ? 'bg-red-500 text-white' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          } hover:scale-110 transition shadow-sm`}
        >
          {isTogglingWishlist ? (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg 
              className={`h-5 w-5 ${inWishlist ? 'fill-current' : 'stroke-current'}`} 
              viewBox="0 0 24 24" 
              fill={inWishlist ? 'currentColor' : 'none'} 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Detalhes do Produto */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
          {product.description}
        </p>
        
        {/* Preço */}
        <div className="flex items-center justify-between">
          <div>
            {product.discount_percentage > 0 ? (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    product.price * (1 + product.discount_percentage / 100)
                  )}
                </span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </span>
            )}
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
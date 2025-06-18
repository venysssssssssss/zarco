"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CartItem } from '@/types/product';
import { useAuthContext } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Estado para controlar o checkout
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      try {
        const cartRes = await fetch('/api/cart');
        const wishlistRes = await fetch('/api/wishlist');

        const [cartData, wishlistData] = await Promise.all([
          cartRes.json(),
          wishlistRes.json()
        ]);

        setCartItems(cartData.items);
        setWishlistItemCount(wishlistData.items.length);
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await handleRemoveItem(productId);
        return;
      }

      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity })
      });

      if (res.ok) {
        // Atualizar carrinho localmente
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.product_id === productId 
              ? { ...item, quantity } 
              : item
          )
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const res = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setCartItems(prevItems => 
          prevItems.filter(item => item.product_id !== productId)
        );
      }
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await fetch(`/api/cart?clear=true`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulando processamento de pedido
    setIsCheckingOut(true);
    
    setTimeout(() => {
      // Em um app real, aqui você enviaria os dados para o backend
      // e processaria o pagamento
      alert('Pedido realizado com sucesso!');
      handleClearCart();
      setIsCheckingOut(false);
      router.push('/welcome');
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Calcular o subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);

  // Taxa de entrega
  const shippingFee = subtotal > 0 ? 15 : 0;

  // Total
  const total = subtotal + shippingFee;

  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-black dark:text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar cartItemCount={cartItems.length} wishlistItemCount={wishlistItemCount} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">Carrinho de Compras</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">Seu carrinho está vazio</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Adicione alguns produtos ao seu carrinho para continuar com a compra.
            </p>
            <Link 
              href="/products" 
              className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition"
            >
              Explorar produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de Itens */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      Seus Itens ({cartItems.length})
                    </h2>
                    <button 
                      onClick={handleClearCart}
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      Limpar carrinho
                    </button>
                  </div>
                </div>

                <ul>
                  {cartItems.map((item, index) => (
                    <motion.li 
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`p-6 ${
                        index !== cartItems.length - 1
                          ? 'border-b border-gray-200 dark:border-gray-800'
                          : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Imagem do Produto */}
                        <div className="sm:w-1/4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                          <div className="aspect-square relative">
                            <Image
                              src={item.product?.image_url || '/products/placeholder.svg'}
                              alt={item.product?.name || 'Produto'}
                              fill
                              className="object-cover object-center"
                              onError={(e: any) => {
                                e.target.onerror = null; 
                                e.target.src = '/products/placeholder.svg';
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Detalhes do Produto */}
                        <div className="flex-1 flex flex-col">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {item.product?.name || 'Produto indisponível'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              Categoria: {item.product?.category || 'N/A'}
                            </p>
                          </div>
                          
                          <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-700 dark:text-gray-300 mr-4">Quantidade:</span>
                              <div className="flex items-center">
                                <button 
                                  onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                                  </svg>
                                </button>
                                
                                <span className="w-10 text-center text-gray-900 dark:text-white">
                                  {item.quantity}
                                </span>
                                
                                <button 
                                  onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                                  disabled={(item.product?.stock || 0) <= item.quantity}
                                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-50"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between sm:block">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {item.product?.price
                                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price * item.quantity)
                                  : 'Preço indisponível'
                                }
                              </div>
                              
                              <button 
                                onClick={() => handleRemoveItem(item.product_id)}
                                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 sm:mt-2"
                              >
                                Remover
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden sticky top-24">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Resumo do Pedido
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-700 dark:text-gray-300">Frete</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shippingFee)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsCheckingOut(true)}
                    disabled={isCheckingOut}
                    className="w-full bg-black text-white mt-6 py-3 px-6 rounded-md font-medium hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isCheckingOut ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processando...
                      </>
                    ) : (
                      'Finalizar Compra'
                    )}
                  </button>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                    Ao finalizar a compra, você concorda com nossos termos de serviço.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Checkout */}
      {isCheckingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Finalizar Pedido
              </h2>
              <button
                onClick={() => setIsCheckingOut(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCheckout} className="p-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">Informações Pessoais</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="form-label">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Digite seu nome completo"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              
              <h3 className="font-medium text-gray-900 dark:text-white mt-6 mb-4">Endereço de Entrega</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="form-label">
                    Endereço
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Rua, número, complemento"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="form-label">
                      Cidade
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="Sua cidade"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="form-label">
                      CEP
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium text-gray-900 dark:text-white mt-6 mb-4">Informações de Pagamento</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="form-label">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cardExpiry" className="form-label">
                      Validade
                    </label>
                    <input
                      type="text"
                      id="cardExpiry"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      placeholder="MM/AA"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cardCVC" className="form-label">
                      CVC
                    </label>
                    <input
                      type="text"
                      id="cardCVC"
                      name="cardCVC"
                      value={formData.cardCVC}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  type="submit"
                  className="btn-primary w-full"
                >
                  Pagar {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Footer simplificado */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            © {new Date().getFullYear()} Zarco. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
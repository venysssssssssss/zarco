"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import Image from "next/image";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Performance optimization: throttled mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    });
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  // Fixed animation variants for performance
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }), []);

  // Minimalist floating elements
  const floatingElements = useMemo(() => 
    Array.from({ length: 3 }, (_, i) => {
      const size = Math.random() * 2 + 1;
      const delay = i * 3;
      const duration = 12 + Math.random() * 6;
      
      return (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-3 will-change-transform"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            background: "#ffffff",
            left: `${25 + Math.random() * 50}%`,
            top: `${25 + Math.random() * 50}%`,
          }}
          animate={{
            x: [0, Math.random() * 30 - 15],
            y: [0, Math.random() * 30 - 15],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
            repeatType: "reverse",
          }}
        />
      );
    }), []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Minimal Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-white opacity-15" />

        {/* Minimal floating particles */}
        {floatingElements}

        {/* Subtle mouse follower */}
        <motion.div
          className="absolute w-[200px] h-[200px] rounded-full will-change-transform"
          style={{
            background: "radial-gradient(circle, rgba(0,0,0,0.015) 0%, transparent 70%)",
            left: mousePosition.x - 100,
            top: mousePosition.y - 100,
            filter: "blur(1px)",
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Side - Minimalist Brand Section */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-black via-gray-900 to-black text-white flex-col justify-center items-center p-16 relative overflow-hidden"
          variants={itemVariants}
        >
          {/* Minimal Background Effects */}
          <div className="absolute inset-0">
            {/* Subtle animated overlay */}
            <motion.div
              className="absolute inset-0 opacity-10"
              style={{
                background: "linear-gradient(45deg, rgba(255,255,255,0.02) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)",
                backgroundSize: "400% 400%",
              }}
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            
            {/* Minimal grid pattern */}
            <div className="absolute inset-0 bg-grid-black opacity-5" />
          </div>
          
          {/* Minimal geometric accents */}
          <motion.div
            className="absolute top-24 left-16 w-12 h-12 border border-white/8 rounded-lg"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <motion.div
            className="absolute bottom-28 right-20 w-8 h-8 border border-white/8"
            style={{ 
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
            animate={{
              rotate: [0, 360],
              opacity: [0.08, 0.15, 0.08],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="text-center z-10 max-w-lg">
            {/* Logo */}
            <motion.div
              whileHover={{ 
                scale: 1.02,
                filter: "brightness(1.05)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="mb-16"
            >
              <Image
                src="/zarcologo.png"
                alt="Zarco Logo"
                width={140}
                height={50}
                className="brightness-0 invert mx-auto"
                priority
              />
            </motion.div>

            {/* Main Message */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {/* Enhanced Quote with Animated Gradient */}
              <motion.div
                className="relative group"
                whileHover={{ 
                  scale: 1.02,
                  y: -3,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Subtle background for better contrast */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Main text with animated gradient */}
                <motion.div
                  className="text-3xl lg:text-4xl font-light leading-relaxed tracking-wide relative z-10 px-4 py-6"
                  style={{
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                    fontWeight: 600,
                    letterSpacing: 0,
                    background: "linear-gradient(90deg, #1e3a8a 0%, #1e40af 20%, #1d4ed8 40%, #2563eb 50%, #1d4ed8 60%, #1e40af 80%, #1e3a8a 100%)",
                    backgroundSize: "300% 100%",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    filter: "drop-shadow(0 2px 8px rgba(30,58,138,0.3))",
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Superar limites começa no espelho
                </motion.div>
                
                {/* Glow effect for enhanced visibility */}
                <motion.div
                  className="absolute inset-0 text-3xl lg:text-4xl font-semibold leading-relaxed text-blue-900/25 blur-sm px-4 py-6 pointer-events-none"
                  style={{
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                    fontWeight: 600,
                    letterSpacing: 0,
                  }}
                  animate={{
                    opacity: [0.25, 0.4, 0.25],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Superar limites começa no espelho
                </motion.div>
                
                {/* Subtle decorative accents */}
                <motion.div
                  className="absolute -top-2 -left-2 w-3 h-3 bg-white/30 rounded-full opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute -bottom-2 -right-2 w-2 h-2 bg-white/20 rounded-full opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              </motion.div>
            </motion.div>

            {/* Minimalist Feature List */}
            <motion.div
              className="space-y-6"
              variants={itemVariants}
            >
              {[
                { 
                  text: "Experiência premium personalizada",
                  color: "#3b82f6",
                },
                { 
                  text: "Produtos exclusivos e únicos",
                  color: "#8b5cf6",
                },
                { 
                  text: "Estilo inovador",
                  color: "#ef4444",
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="group flex items-center space-x-4"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.15, duration: 0.6 }}
                  whileHover={{ x: 6 }}
                >
                  {/* Colored dot */}
                  <motion.div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: feature.color }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.8,
                    }}
                  />
                  
                  {/* Text */}
                  <motion.span 
                    className="text-white/90 font-light text-base lg:text-lg leading-relaxed tracking-wide group-hover:text-white transition-colors duration-300"
                  >
                    {feature.text}
                  </motion.span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Minimal corner accents */}
          <motion.div
            className="absolute bottom-12 left-12 w-8 h-8"
            style={{
              borderLeft: "1px solid rgba(255,255,255,0.1)",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.div
            className="absolute top-12 right-12 w-8 h-8"
            style={{
              borderRight: "1px solid rgba(255,255,255,0.1)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.5,
            }}
          />
        </motion.div>

        {/* Right Side - Forms Section */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center p-8 relative"
          variants={itemVariants}
        >
          <div className="w-full max-w-md relative">
            {/* Toggle Buttons */}
            <motion.div
              className="flex bg-white rounded-2xl p-2 mb-8 shadow-lg border border-gray-200 relative"
              variants={itemVariants}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="absolute inset-y-2 w-[calc(50%-4px)] bg-black rounded-xl shadow-md"
                animate={{
                  x: isLogin ? 4 : "calc(100% + 4px)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              />
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-6 text-sm font-semibold rounded-xl transition-all duration-200 relative z-10 ${
                  isLogin 
                    ? "text-white" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-6 text-sm font-semibold rounded-xl transition-all duration-200 relative z-10 ${
                  !isLogin 
                    ? "text-white" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Cadastrar
              </button>
            </motion.div>

            {/* Form Container */}
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 relative overflow-hidden"
              whileHover={{
                y: -4,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-black via-gray-600 to-black" />
              
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "radial-gradient(circle at 2px 2px, #000 1px, transparent 0)",
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>

              <div className="p-8 relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <AnimatePresence mode="wait">
                  {isLogin ? (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <LoginForm />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <RegisterForm />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Minimal decorative elements */}
            <motion.div
              className="absolute -top-3 -left-3 w-6 h-6 border border-black/5 rounded-full"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute -bottom-3 -right-3 w-4 h-4 bg-black/5 rounded-full"
              animate={{
                y: [0, -8, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse",
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Minimal bottom accent */}
      <div className="absolute bottom-0 left-0 w-full h-16 opacity-3">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,32L80,28C160,24,320,16,480,16C640,16,800,24,960,26.7C1120,29,1280,21,1360,17.3L1440,14L1440,64L1360,64C1280,64,1120,64,960,64C800,64,640,64,480,64C320,64,160,64,80,64L0,64Z"
            fill="currentColor"
            className="text-black"
          />
        </svg>
      </div>
    </div>
  );
}
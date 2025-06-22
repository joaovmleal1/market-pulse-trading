import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    >
      <div className="text-center px-6">
        <h1 className="text-6xl font-extrabold mb-4 text-white">404</h1>
        <p className="text-2xl text-gray-300 mb-6">Oops! Página não encontrada</p>
        <a
          href="/"
          className="text-green-400 hover:text-green-300 underline text-lg font-medium transition-colors duration-300"
        >
          Voltar para o Início
        </a>
      </div>
    </motion.div>
  );
};

export default NotFound;

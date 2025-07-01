import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
      className="min-h-screen flex items-center justify-center bg-[#1E1E1E] px-6"
    >
      <div className="text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-4 text-[#24C3B5]">404</h1>
        <p className="text-2xl text-[#A9B1B8] mb-6">
          Oops! A página que você está procurando não foi encontrada.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-white bg-[#24C3B5] hover:bg-[#3ED6C8] px-6 py-3 rounded-md text-lg font-medium transition-colors duration-300"
        >
          Voltar
        </button>
      </div>
    </motion.div>
  );
};

export default NotFound;
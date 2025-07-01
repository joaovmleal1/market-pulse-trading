import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
        '404 Error: User attempted to access non-existent route:',
        location.pathname
    );
  }, [location.pathname]);

  return (
      <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E1E1E] via-[#20232A] to-[#1E1E1E] px-6"
      >
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center"
        >
          <motion.h1
              className="text-6xl md:text-7xl font-extrabold mb-4 text-[#24C3B5]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 180 }}
          >
            404
          </motion.h1>
          <p className="text-xl md:text-2xl text-[#A9B1B8] mb-6">
            Oops! A página que você está procurando não foi encontrada.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <motion.button
                onClick={() => navigate(-1)}
                className="text-white bg-[#24C3B5] hover:bg-[#3ED6C8] px-6 py-3 rounded-md text-lg font-medium transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
              Voltar
            </motion.button>

            <motion.button
                onClick={() => navigate('/')}
                className="text-[#24C3B5] border border-[#24C3B5] hover:text-white hover:bg-[#24C3B5]/10 px-6 py-3 rounded-md text-lg font-medium transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
              Ir para o Início
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
  );
};

export default NotFound;

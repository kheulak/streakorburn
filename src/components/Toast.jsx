import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react';

const ToastItem = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000); // Auto close after 4s
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const variants = {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, x: 20, scale: 0.9 }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success': return 'border-green-500/30 bg-green-900/20';
      case 'error': return 'border-red-500/30 bg-red-900/20';
      default: return 'border-blue-500/30 bg-blue-900/20';
    }
  };

  return (
    <motion.div
      layout
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl min-w-[300px] pointer-events-auto ${getBorderColor()}`}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <p className="text-xs font-bold text-white flex-1">{message}</p>
      <button onClick={() => onClose(id)} className="text-white/50 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <ToastItem key={n.id} {...n} onClose={removeNotification} />
        ))}
      </AnimatePresence>
    </div>
  );
};

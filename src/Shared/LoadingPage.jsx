import { motion } from "framer-motion";

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-sky-500 via-black to-purple-500 text-white overflow-hidden">
      {/* Spinning ring */}
      <motion.div
        className="w-32 h-32 border-t-4 border-b-4 border-white rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      />

      {/* Glowing text */}
      <motion.h1
        className="mt-10 text-4xl font-extrabold tracking-wide"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 0.8, 1],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      >
        <span className="bg-clip-text text-transparent bg-linear-to-r from-green-500 to-red-500">
          Loading<span className="animate-pulse">...</span>
        </span>
      </motion.h1>
    </div>
  );
};

export default LoadingPage;

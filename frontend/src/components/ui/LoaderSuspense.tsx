import { motion } from "framer-motion";
import { LoaderSkeleton } from "./LoaderSkeleton";

export function LoaderSuspense() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <LoaderSkeleton />
    </motion.div>
  );
}
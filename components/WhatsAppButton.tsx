import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";

export function WhatsAppButton() {
  const whatsappNumber = "+96512345678"; // Replace with actual number
  const message = encodeURIComponent(
    "Hello! I'm interested in learning more about Gulf Empire's services."
  );

  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <MessageCircle className="w-7 h-7" />
    </motion.a>
  );
}

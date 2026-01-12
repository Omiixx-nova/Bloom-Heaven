import { useRoute } from "wouter";
import { useMessages } from "@/hooks/use-bouquets";
import { Loader2, QrCode, Share2, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Helper to determine styles based on ID (mock data strategy for demo)
// In real app, we'd fetch bouquet details too, but for MVP we rely on message data mostly
export default function PublicView() {
  const [, params] = useRoute("/scan/:id");
  const messageId = params ? parseInt(params.id) : undefined;
  
  // Note: We're reusing useMessage hook, but in reality we'd need a public endpoint
  // that doesn't require auth. Assuming the API handles this based on route.
  const { useMessage } = useMessages();
  const { data: message, isLoading, error } = useMessage(messageId || 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <Flower2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-primary font-medium">Unwrapping your gift...</p>
        </div>
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Gift Not Found</h1>
          <p className="text-gray-500">This digital bouquet might have expired or the link is incorrect.</p>
        </div>
      </div>
    );
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.5 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", bounce: 0.4 }
    }
  };

  const shareUrl = window.location.href;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#faf3f3] flex flex-col items-center justify-center py-12 px-4">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-primary rounded-full blur-[100px]" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-purple-400 rounded-full blur-[80px]" 
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-lg relative z-10"
      >
        {/* The Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-pink-200/50 border border-white/60 overflow-hidden">
          
          {/* Media Header */}
          {message.imageUrl && (
            <motion.div variants={item} className="h-64 sm:h-80 w-full relative bg-gray-100">
               <img src={message.imageUrl} alt="Gift" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
               <div className="absolute bottom-4 left-6 text-white">
                 <p className="text-sm font-medium opacity-90 uppercase tracking-widest mb-1">A Gift From</p>
                 <p className="text-3xl font-display font-bold">{message.senderName}</p>
               </div>
            </motion.div>
          )}

          {/* Content Body */}
          <div className="p-8 sm:p-10 text-center space-y-8">
            
            {!message.imageUrl && (
              <motion.div variants={item} className="pb-4 border-b border-pink-100">
                <p className="text-sm text-primary uppercase tracking-widest font-semibold mb-2">A Gift From</p>
                <h1 className="text-4xl font-display font-bold text-gray-900">{message.senderName}</h1>
              </motion.div>
            )}

            <motion.div variants={item} className="prose prose-pink mx-auto">
              <p className="text-2xl sm:text-3xl font-handwriting leading-relaxed text-gray-700">
                "{message.content}"
              </p>
            </motion.div>

            {message.deliveryDate && (
               <motion.div variants={item} className="pt-4">
                 <p className="text-sm text-gray-400">Delivered on {message.deliveryDate}</p>
               </motion.div>
            )}
            
            <motion.div variants={item} className="pt-6 flex justify-center gap-4">
               <Dialog>
                 <DialogTrigger asChild>
                   <Button variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-pink-50">
                     <QrCode className="mr-2 h-4 w-4" /> QR Code
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-md flex flex-col items-center p-10">
                   <div className="bg-white p-4 rounded-xl shadow-inner mb-4">
                     <QRCodeSVG value={shareUrl} size={200} />
                   </div>
                   <p className="text-center text-sm text-gray-500">Scan to view this gift on mobile</p>
                 </DialogContent>
               </Dialog>

               <Button 
                 className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-pink-200"
                 onClick={() => {
                   navigator.clipboard.writeText(shareUrl);
                   // In a real app we'd show a toast here, but we are outside the provider context in some setups
                   // For now, simple alert or assume success
                   alert("Link copied to clipboard!"); 
                 }}
               >
                 <Share2 className="mr-2 h-4 w-4" /> Share
               </Button>
            </motion.div>

          </div>
        </div>

        <motion.div 
          variants={item}
          className="mt-8 text-center"
        >
          <a href="/" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors flex items-center justify-center gap-2">
            <Flower2 className="h-4 w-4" /> Created with Bloom Heaven
          </a>
        </motion.div>

      </motion.div>
    </div>
  );
}

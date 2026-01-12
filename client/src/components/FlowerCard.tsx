import { motion } from "framer-motion";
import { Flower2, Heart, Calendar } from "lucide-react";
import type { Bouquet } from "@shared/schema";
import { format } from "date-fns";

interface FlowerCardProps {
  bouquet: Bouquet;
  onClick?: () => void;
}

const colorMap: Record<string, string> = {
  "romantic-red": "bg-red-100 text-red-600 border-red-200",
  "soft-pink": "bg-pink-100 text-pink-600 border-pink-200",
  "pure-white": "bg-slate-100 text-slate-600 border-slate-200",
  "sunny-yellow": "bg-yellow-100 text-yellow-600 border-yellow-200",
  "lavender-dream": "bg-purple-100 text-purple-600 border-purple-200",
};

export function FlowerCard({ bouquet, onClick }: FlowerCardProps) {
  const colorClass = colorMap[bouquet.colorTheme] || colorMap["soft-pink"];

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl p-6 border bg-white
        shadow-lg shadow-pink-100/50 hover:shadow-xl hover:shadow-pink-200/50
        transition-all duration-300 cursor-pointer group
      `}
    >
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass.split(' ')[1]}`}>
        <Flower2 className="w-24 h-24" />
      </div>

      <div className="relative z-10">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 border ${colorClass}`}>
          {bouquet.flowerType}
        </div>

        <h3 className="text-xl font-display font-bold text-gray-800 mb-1">
          {bouquet.occasion}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
          <Calendar className="w-4 h-4" />
          <span>Created {bouquet.createdAt ? format(new Date(bouquet.createdAt), 'MMM d, yyyy') : 'Recently'}</span>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
}

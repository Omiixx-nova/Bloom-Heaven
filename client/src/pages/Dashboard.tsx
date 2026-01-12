import { useAuth } from "@/hooks/use-auth";
import { useBouquets } from "@/hooks/use-bouquets";
import { FlowerCard } from "@/components/FlowerCard";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { bouquets, isLoading: isBouquetsLoading } = useBouquets();
  const [, setLocation] = useLocation();

  if (isAuthLoading || isBouquetsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">My Garden</h1>
            <p className="text-gray-500">Manage your digital floral creations</p>
          </div>
          <Link href="/create">
            <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-pink-200 text-white gap-2">
              <Plus className="h-5 w-5" /> Create New Bouquet
            </Button>
          </Link>
        </div>

        {!bouquets?.length ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300"
          >
            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="h-10 w-10 text-primary/50" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No bouquets yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Start spreading joy by creating your first digital flower arrangement.
            </p>
            <Link href="/create">
              <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-pink-50">
                Create First Bouquet
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {bouquets.map((bouquet) => (
              <motion.div key={bouquet.id} variants={item}>
                <FlowerCard 
                  bouquet={bouquet} 
                  onClick={() => setLocation(`/scan/${bouquet.id}`)} // Or edit link
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

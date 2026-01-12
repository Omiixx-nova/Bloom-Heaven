import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gift, Heart, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32 lg:pt-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          {/* Decorative Blooms */}
          <div className="absolute top-20 right-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/80 border border-pink-100 text-primary text-sm font-medium mb-8 shadow-sm backdrop-blur-sm">
              ✨ The Future of Gifting
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 mb-6 leading-tight">
              Where Flowers Speak <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                Your Heart Digitally
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              Create stunning digital bouquets with personalized messages, videos, and music. 
              The perfect sustainable gift that lasts forever.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/create">
                <Button size="lg" className="rounded-full text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-pink-300/30 hover:-translate-y-1 transition-all">
                  Create a Bouquet <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="rounded-full text-lg px-8 py-6 border-2 border-primary/20 hover:bg-pink-50 text-primary">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Gift className="w-8 h-8 text-primary" />,
                title: "Digital Elegance",
                desc: "Choose from hand-crafted digital floral arrangements that never wilt."
              },
              {
                icon: <Heart className="w-8 h-8 text-purple-500" />,
                title: "Personalized Love",
                desc: "Attach video messages, photos, and heartfelt notes to your gift."
              },
              {
                icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
                title: "Instant Delivery",
                desc: "Send via link or QR code instantly to anyone, anywhere in the world."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-3xl bg-white border border-pink-50 shadow-xl shadow-pink-100/20 hover:shadow-2xl hover:shadow-pink-100/40 transition-all"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-50 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-display font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 text-center text-gray-500 text-sm">
        <p>© 2024 Bloom Heaven. Made with ❤️ for digital moments.</p>
      </footer>
    </div>
  );
}

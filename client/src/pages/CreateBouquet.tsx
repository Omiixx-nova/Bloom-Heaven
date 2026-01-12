import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBouquetSchema } from "@shared/schema";
import { useBouquets } from "@/hooks/use-bouquets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, Check } from "lucide-react";
import { Link } from "wouter";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Schema for step 1
const step1Schema = insertBouquetSchema.pick({ occasion: true, flowerType: true, colorTheme: true });
type Step1Values = z.infer<typeof step1Schema>;

const FLOWER_TYPES = [
  { id: "roses", label: "Classic Roses", desc: "Eternal love & passion" },
  { id: "tulips", label: "Spring Tulips", desc: "Hope & new beginnings" },
  { id: "lilies", label: "Elegant Lilies", desc: "Purity & refined beauty" },
  { id: "sunflowers", label: "Bright Sunflowers", desc: "Adoration & loyalty" },
];

const THEMES = [
  { id: "romantic-red", label: "Romantic Red", color: "bg-red-500" },
  { id: "soft-pink", label: "Soft Pink", color: "bg-pink-400" },
  { id: "pure-white", label: "Pure White", color: "bg-slate-100 border border-gray-300" },
  { id: "sunny-yellow", label: "Sunny Yellow", color: "bg-yellow-400" },
  { id: "lavender-dream", label: "Lavender Dream", color: "bg-purple-400" },
];

export default function CreateBouquet() {
  const { createBouquet, isCreating } = useBouquets();
  
  const form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      occasion: "",
      flowerType: "roses",
      colorTheme: "romantic-red",
    }
  });

  const onSubmit = (data: Step1Values) => {
    createBouquet(data);
  };

  const selectedFlower = form.watch("flowerType");
  const selectedTheme = form.watch("colorTheme");

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-display font-bold text-gray-900">Design Your Bouquet</h1>
          <p className="text-gray-500 mt-2">Step 1 of 2: Choose your arrangement style</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          
          {/* Section 1: Occasion */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Label className="text-lg font-semibold">What is the occasion?</Label>
            <Input 
              placeholder="e.g. Happy Birthday, Anniversary, Just Because..." 
              className="h-14 text-lg rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
              {...form.register("occasion")}
            />
            {form.formState.errors.occasion && (
              <p className="text-sm text-destructive">{form.formState.errors.occasion.message}</p>
            )}
          </motion.div>

          {/* Section 2: Flower Type */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <Label className="text-lg font-semibold">Select Flower Type</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FLOWER_TYPES.map((flower) => (
                <div 
                  key={flower.id}
                  className={cn(
                    "cursor-pointer rounded-2xl border-2 p-4 transition-all hover:border-primary/50 hover:bg-pink-50/50",
                    selectedFlower === flower.id ? "border-primary bg-pink-50" : "border-transparent bg-white shadow-sm"
                  )}
                  onClick={() => form.setValue("flowerType", flower.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-900">{flower.label}</span>
                    {selectedFlower === flower.id && (
                      <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{flower.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 3: Color Theme */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="space-y-4"
          >
            <Label className="text-lg font-semibold">Choose Color Theme</Label>
            <div className="flex flex-wrap gap-4">
              {THEMES.map((theme) => (
                <div 
                  key={theme.id}
                  className="flex flex-col items-center gap-2 cursor-pointer group"
                  onClick={() => form.setValue("colorTheme", theme.id)}
                >
                  <div className={cn(
                    "w-16 h-16 rounded-full shadow-sm transition-transform group-hover:scale-110 ring-offset-2",
                    theme.color,
                    selectedTheme === theme.id ? "ring-2 ring-primary" : ""
                  )} />
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    selectedTheme === theme.id ? "text-primary" : "text-gray-500"
                  )}>{theme.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="pt-8 flex justify-end">
            <Button 
              type="submit" 
              size="lg" 
              className="rounded-full px-8 h-14 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-pink-200"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating...
                </>
              ) : (
                "Continue to Message"
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}

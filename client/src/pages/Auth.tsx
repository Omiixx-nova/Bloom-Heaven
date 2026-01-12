import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Flower } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function AuthPage({ mode = "login" }: { mode?: "login" | "register" }) {
  const { login, register, isLoggingIn, isRegistering, user } = useAuth();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  const isLogin = mode === "login";
  const action = isLogin ? login : register;
  const isLoading = isLogin ? isLoggingIn : isRegistering;

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { username: "", password: "" }
  });

  const onSubmit = (data: AuthFormValues) => {
    action(data, {
      onSuccess: () => !isLogin && setLocation("/login"),
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center px-4 bg-gradient-to-b from-pink-50/50 to-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-2xl shadow-pink-100/50 glass-card">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <Flower className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-display font-bold text-gray-800">
              {isLogin ? "Welcome Back" : "Join Bloom Heaven"}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {isLogin 
                ? "Enter your details to access your bouquets" 
                : "Start creating beautiful digital gifts today"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  {...form.register("username")} 
                  className="rounded-xl h-12 bg-white/50 focus:bg-white transition-all"
                  placeholder="rose_lover"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  {...form.register("password")} 
                  className="rounded-xl h-12 bg-white/50 focus:bg-white transition-all"
                  placeholder="••••••••"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-lg font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-pink-200"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? "Sign In" : "Create Account"}
              </Button>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-500">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <Link href={isLogin ? "/register" : "/login"}>
                    <span className="text-primary font-semibold hover:underline cursor-pointer">
                      {isLogin ? "Sign up" : "Log in"}
                    </span>
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

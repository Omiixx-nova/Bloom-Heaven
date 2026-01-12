import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertBouquet, type InsertMessage } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function useBouquets() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const bouquetsQuery = useQuery({
    queryKey: [api.bouquets.list.path],
    queryFn: async () => {
      const res = await fetch(api.bouquets.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bouquets");
      return api.bouquets.list.responses[200].parse(await res.json());
    },
  });

  const createBouquetMutation = useMutation({
    mutationFn: async (data: InsertBouquet) => {
      const res = await fetch(api.bouquets.create.path, {
        method: api.bouquets.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to create bouquet");
      return api.bouquets.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.bouquets.list.path] });
      toast({ title: "Bouquet created!", description: "Now add a heartfelt message." });
      setLocation(`/bouquet/${data.id}/message`);
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  return {
    bouquets: bouquetsQuery.data,
    isLoading: bouquetsQuery.isLoading,
    createBouquet: createBouquetMutation.mutate,
    isCreating: createBouquetMutation.isPending,
  };
}

export function useMessages(bouquetId?: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const createMessageMutation = useMutation({
    mutationFn: async (data: InsertMessage) => {
      if (!bouquetId) throw new Error("Bouquet ID required");
      
      const url = buildUrl(api.messages.create.path, { bouquetId });
      const res = await fetch(url, {
        method: api.messages.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to save message");
      return api.messages.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      toast({ title: "Message attached!", description: "Your digital flower is ready." });
      // In a real app, this might go to a confirmation or share page
      setLocation(`/scan/${data.id}`); 
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  const useMessage = (id: number) => useQuery({
    queryKey: [api.messages.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.messages.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch message");
      return api.messages.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });

  return {
    createMessage: createMessageMutation.mutate,
    isCreatingMessage: createMessageMutation.isPending,
    useMessage,
  };
}

export function useUpload() {
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(api.uploads.upload.path, {
        method: api.uploads.upload.method,
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Upload failed");
      return api.uploads.upload.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({ 
        title: "Upload failed", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  return {
    upload: uploadMutation.mutateAsync, // Async so we can await the URL
    isUploading: uploadMutation.isPending,
  };
}

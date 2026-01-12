import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema } from "@shared/schema";
import { useMessages, useUpload } from "@/hooks/use-bouquets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload, Calendar as CalendarIcon, Image as ImageIcon } from "lucide-react";
import { z } from "zod";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Schema for message step
const messageFormSchema = insertMessageSchema.extend({
  deliveryDate: z.date().optional().transform(d => d ? d.toISOString() : undefined),
});

type MessageFormValues = z.input<typeof messageFormSchema>;

export default function CreateMessage() {
  const [, params] = useRoute("/bouquet/:id/message");
  const bouquetId = params ? parseInt(params.id) : undefined;
  const { createMessage, isCreatingMessage } = useMessages(bouquetId);
  const { upload, isUploading } = useUpload();
  const [, setLocation] = useLocation();

  const [date, setDate] = useState<Date>();
  const [imageUrl, setImageUrl] = useState<string>();

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      senderName: "",
      content: "",
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const result = await upload(e.target.files[0]);
        setImageUrl(result.url);
        form.setValue("imageUrl", result.url);
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  const onSubmit = (data: MessageFormValues) => {
    // Manually ensure date is set if using local state
    if (date) {
      data.deliveryDate = date;
    }
    createMessage(data as any); // Type assertion needed due to date transformation mismatch in types
  };

  if (!bouquetId) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-gray-900">Add Your Personal Touch</h1>
          <p className="text-gray-500 mt-2">Step 2 of 2: Write your message & attach memories</p>
        </div>

        <Card className="border-none shadow-xl shadow-pink-100/50 glass-card overflow-hidden">
          <CardContent className="p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Text */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Your Name</Label>
                    <Input 
                      placeholder="Who is this from?" 
                      className="rounded-xl border-gray-200"
                      {...form.register("senderName")}
                    />
                    {form.formState.errors.senderName && (
                      <p className="text-sm text-destructive">{form.formState.errors.senderName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Your Message</Label>
                    <Textarea 
                      placeholder="Write something heartfelt..." 
                      className="rounded-xl border-gray-200 min-h-[200px] resize-none font-handwriting text-2xl leading-relaxed bg-pink-50/30 focus:bg-white transition-colors"
                      {...form.register("content")}
                    />
                  </div>
                </div>

                {/* Right Column: Media & Date */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Attach Photo or Video</Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative h-[200px] flex flex-col items-center justify-center">
                      <Input 
                        type="file" 
                        accept="image/*,video/*" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                      />
                      {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      ) : imageUrl ? (
                        <img src={imageUrl} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                            <Upload className="h-6 w-6 text-primary" />
                          </div>
                          <p className="text-sm text-gray-500 font-medium">Click to upload media</p>
                          <p className="text-xs text-gray-400 mt-1">Max 10MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Delivery Date (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal rounded-xl h-12 border-gray-200",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="rounded-full px-12 h-14 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-pink-200"
                  disabled={isCreatingMessage || isUploading}
                >
                  {isCreatingMessage ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Finalizing...
                    </>
                  ) : (
                    "Finish & Send Gift"
                  )}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

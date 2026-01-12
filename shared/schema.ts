import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const bouquets = pgTable("bouquets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  occasion: text("occasion").notNull(),
  flowerType: text("flower_type").notNull(),
  colorTheme: text("color_theme").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  bouquetId: integer("bouquet_id").notNull(),
  senderName: text("sender_name").notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  deliveryDate: text("delivery_date"), // Storing as string for simplicity in MVP
  qrCodeUrl: text("qr_code_url"),
});

export const insertUserSchema = createInsertSchema(users);
export const insertBouquetSchema = createInsertSchema(bouquets).omit({ id: true, createdAt: true, userId: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, bouquetId: true, qrCodeUrl: true });

export type User = typeof users.$inferSelect;
export type Bouquet = typeof bouquets.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertBouquet = z.infer<typeof insertBouquetSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

import type { Express } from "express";
import type { Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import QRCode from "qrcode";
import express from "express";
import bcrypt from "bcrypt";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const upload = multer({ 
  dest: uploadsDir,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

async function seed() {
  const existingUser = await storage.getUserByUsername("demo");
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("password", 10);
    const user = await storage.createUser({
      username: "demo",
      password: hashedPassword
    });
    
    const bouquet = await storage.createBouquet({
      userId: user.id,
      occasion: "Anniversary",
      flowerType: "Rose",
      colorTheme: "Red"
    });

    const scanUrl = `http://0.0.0.0:5000/scan/1`;
    const qrCodeDataUrl = await QRCode.toDataURL(scanUrl);

    await storage.createMessage({
      bouquetId: bouquet.id,
      senderName: "Romeo",
      content: "Happy Anniversary, my love! Here's to many more years of blooming love.",
      imageUrl: null,
      videoUrl: null,
      deliveryDate: new Date().toISOString(),
      qrCodeUrl: qrCodeDataUrl
    });
    
    console.log("Database seeded with demo user (demo/password)");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed database
  await seed();

  // Setup Authentication
  setupAuth(app);

  // Serve uploaded files
  app.use("/uploads", express.static(uploadsDir));

  // Bouquets
  app.get(api.bouquets.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const bouquets = await storage.getBouquets(req.user.id);
    res.json(bouquets);
  });

  app.post(api.bouquets.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.bouquets.create.input.parse(req.body);
      const bouquet = await storage.createBouquet({ ...input, userId: req.user.id });
      res.status(201).json(bouquet);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Messages
  app.post(api.messages.create.path, async (req, res) => {
    // Note: Message creation might strictly require auth if the user is creating it for their bouquet
    // But specific requirements said "Only logged-in users can: Create bouquets, Write messages"
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const bouquetId = Number(req.params.bouquetId);
      const bouquet = await storage.getBouquet(bouquetId);
      
      if (!bouquet || bouquet.userId !== req.user.id) {
        return res.status(404).json({ message: "Bouquet not found or unauthorized" });
      }

      const input = api.messages.create.input.parse(req.body);
      
      // Generate QR Code that points to the public view page
      // In a real app, this would be the full domain. For now, we'll use a relative path or placeholder.
      // We'll generate a placeholder ID first, but wait, we need the ID for the URL.
      // Let's assume the ID will be next or just use a placeholder and update, 
      // OR better, generate the QR code pointing to the frontend route `/scan/:id`
      // Since we don't have the ID yet, we might need to create the message first (without QR) 
      // then generate QR and update. Or just pre-calculate ID. 
      // MemStorage doesn't support pre-calc easily without race conditions in real DBs, 
      // but here it's fine. Let's create message first.
      
      // For MVP, we'll store a placeholder and then update (if we had update). 
      // Actually, let's just create it with a temp QR, then we would need to update it.
      // Since `createMessage` in storage is atomic, let's just generate a UUID for the scan link 
      // or use the numeric ID.
      
      // Simpler: Just create the message. The QR code URL is derived from the ID.
      // We will generate the DATA URI of the QR code here to store it or return it.
      // The requirement says: "Generate unique QR code using qrcode library... QR downloadable as PNG"
      // We can store the QR code Data URL in the DB.
      
      // Issue: We need the message ID to generate the link `/scan/:id`.
      // Solution: Create message first with empty QR. Then generate QR. Then update message.
      // I need `updateMessage` in storage. I'll add it to IStorage interface in next step if needed, 
      // OR just rely on the frontend to generate QR from the ID returned? 
      // "Generate unique QR code... attached to each bouquet". 
      // Let's create the message, get the ID, generate QR, and since it's MemStorage, 
      // I can cheat and access the object reference or just update it.
      
      // Let's implement `updateMessage` in storage.ts or just allow it here since it's in-memory.
      // I'll add `updateMessage` to storage.ts quickly or just ignore storing the QR code string 
      // and generate it on the fly? "QR downloadable as PNG". 
      // Generating on fly is better.
      
      const message = await storage.createMessage({ 
        ...input, 
        bouquetId,
        qrCodeUrl: "" // Placeholder
      });

      // Generate QR Code Data URL
      // The link should be to the frontend route: `${req.protocol}://${req.get('host')}/scan/${message.id}`
      const scanUrl = `${req.protocol}://${req.get('host')}/scan/${message.id}`;
      const qrCodeDataUrl = await QRCode.toDataURL(scanUrl);
      
      // Update the message with the QR code
      message.qrCodeUrl = qrCodeDataUrl;
      
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.get(api.messages.get.path, async (req, res) => {
    const id = Number(req.params.id);
    const message = await storage.getMessage(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json(message);
  });

  // File Upload
  app.post(api.uploads.upload.path, upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    // Return the URL to access the file
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  });

  return httpServer;
}

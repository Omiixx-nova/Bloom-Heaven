import { type User, type InsertUser, type Bouquet, type InsertBouquet, type Message, type InsertMessage } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createBouquet(bouquet: InsertBouquet & { userId: number }): Promise<Bouquet>;
  getBouquets(userId: number): Promise<Bouquet[]>;
  getBouquet(id: number): Promise<Bouquet | undefined>;
  
  createMessage(message: InsertMessage & { bouquetId: number, qrCodeUrl: string }): Promise<Message>;
  getMessage(id: number): Promise<Message | undefined>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bouquets: Map<number, Bouquet>;
  private messages: Map<number, Message>;
  sessionStore: session.Store;
  private currentUserId: number;
  private currentBouquetId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.bouquets = new Map();
    this.messages = new Map();
    this.currentUserId = 1;
    this.currentBouquetId = 1;
    this.currentMessageId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createBouquet(bouquet: InsertBouquet & { userId: number }): Promise<Bouquet> {
    const id = this.currentBouquetId++;
    const newBouquet: Bouquet = { ...bouquet, id, createdAt: new Date() };
    this.bouquets.set(id, newBouquet);
    return newBouquet;
  }

  async getBouquets(userId: number): Promise<Bouquet[]> {
    return Array.from(this.bouquets.values()).filter(b => b.userId === userId);
  }

  async getBouquet(id: number): Promise<Bouquet | undefined> {
    return this.bouquets.get(id);
  }

  async createMessage(message: InsertMessage & { bouquetId: number, qrCodeUrl: string }): Promise<Message> {
    const id = this.currentMessageId++;
    const newMessage: Message = { ...message, id };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }
}

export const storage = new MemStorage();

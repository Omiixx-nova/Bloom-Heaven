import { z } from 'zod';
import { insertUserSchema, insertBouquetSchema, insertMessageSchema, bouquets, messages, users } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    signup: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: z.string(),
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.undefined(),
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.undefined(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.undefined(),
      },
    },
  },
  bouquets: {
    create: {
      method: 'POST' as const,
      path: '/api/bouquets',
      input: insertBouquetSchema,
      responses: {
        201: z.custom<typeof bouquets.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/bouquets',
      responses: {
        200: z.array(z.custom<typeof bouquets.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
  },
  messages: {
    create: {
      method: 'POST' as const,
      path: '/api/bouquets/:bouquetId/messages',
      input: insertMessageSchema,
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/messages/:id',
      responses: {
        200: z.custom<typeof messages.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  uploads: {
    upload: {
      method: 'POST' as const,
      path: '/api/upload',
      // input is FormData
      responses: {
        200: z.object({ url: z.string() }),
        400: z.string(),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

import z from 'zod';

// Single message validation schema
const messagevalidator = z.object({
    id: z.string(),
    senderid: z.string(),
    text: z.string(),
    timestamp: z.number(),
});

// Array of messages validation schema
export const messageArrayValidator = z.array(messagevalidator);
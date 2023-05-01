import {z} from 'zod';

export const CreatePostSchema = z.object({
    content: z.string().emoji().min(1),
    authorId: z.string()
})


export type CreatePostType = z.infer<typeof CreatePostSchema>;
import {z} from 'zod';

export const UpdatePostSchema = z.object({
    content: z.string().emoji().min(1),
    postId: z.string().cuid()
})


export type UpdatePostType = z.infer<typeof UpdatePostSchema>;
import { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({

  getAll: publicProcedure.query( async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
    });

    const filterUserForClient = (user: User) => ({
      id: user.id,
      username: user.username,
      profileImageUrl: user.profileImageUrl
    })

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map(post => post.authorId)
      })
    ).map(filterUserForClient)

    return posts.map(post => {
      const author = users.find(user => user.id === post.authorId)
      if(!author) {
        throw new TRPCError({code: 'FORBIDDEN', message: 'Author for post not found'})
      }

      return {
        post,
        author 
      }
    })

  }),

  create: publicProcedure.input(z.object({
    content: z.string(),
    authorId: z.string()
  })).mutation(async ({ctx, input}) => {
    const createdPost = await ctx.prisma.post.create({
      data: {
        content: input.content,
        authorId: input.authorId
      }
    })

    if(!createdPost) throw new TRPCError({code: 'FORBIDDEN', message: 'something went wrong'})

    return createdPost
  })

});
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
      console.log(author)
      if(!author) {
        throw new TRPCError({code: 'FORBIDDEN', message: 'Author for post not found'})
      }

      return {
        post,
        author: {
          ...author,
          username: author.username || ''
        } 
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
  }),
  delete: publicProcedure.input(z.string()).mutation( async ({input, ctx}) => {
    const deletedPost = await ctx.prisma.post.delete({
      where: {
        id: input
      }
    })
    if(!deletedPost) throw new TRPCError({'code': 'BAD_REQUEST', message: 'something went wrong'});

    return deletedPost
  }),

  update: publicProcedure.input(z.object({
    content: z.string(),
    postId: z.string()
  })).mutation( async ({input, ctx}) => {
    const updatedPost = await ctx.prisma.post.update({
      where: {
        id: input.postId
      }, 
      data: {
        content: input.content
      }
    })
    if(!updatedPost) throw new TRPCError({'code': 'BAD_REQUEST', message: 'something went wrong'});
    
    return updatedPost
  })

});
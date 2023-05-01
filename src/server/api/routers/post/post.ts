import { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, privateProcedure} from "~/server/api/trpc";
import { CreatePostSchema } from "./dto/CreatePost.dto";
import { UpdatePostSchema } from "./dto/UpdatePost.dto";

export const postRouter = createTRPCRouter({

  getAll: publicProcedure.query( async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: {
        createdAt: 'desc'
      }
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
        author: {
          ...author,
          username: author.username || ''
        } 
      }
    })

  }),

  create: privateProcedure.input(CreatePostSchema).mutation(async ({ctx, input}) => {
    const createdPost = await ctx.prisma.post.create({
      data: {
        content: input.content,
        authorId: input.authorId
      }
    })

    if(!createdPost) throw new TRPCError({code: 'FORBIDDEN', message: 'something went wrong'})

    return createdPost
  }),
  delete: privateProcedure.input(z.string()).mutation( async ({input, ctx}) => {
    const deletedPost = await ctx.prisma.post.delete({
      where: {
        id: input
      }
    })
    if(!deletedPost) throw new TRPCError({'code': 'BAD_REQUEST', message: 'something went wrong'});

    return deletedPost
  }),

  update: privateProcedure.input(UpdatePostSchema).mutation( async ({input, ctx}) => {
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
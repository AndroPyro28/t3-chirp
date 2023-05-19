import { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, privateProcedure} from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
    getMe: publicProcedure.query( async ({ ctx }) => {
        console.log('hitted')
        return 'this is auth1'
      })
});
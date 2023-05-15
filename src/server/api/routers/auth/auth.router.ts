import { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, privateProcedure} from "~/server/api/trpc";

export const authRouter = createTRPCRouter({

    sampleAuth: publicProcedure.query(async ({ctx}) => {
        console.log('hit', ctx)
        return 'auth'
    })
});
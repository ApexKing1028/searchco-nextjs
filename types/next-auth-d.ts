import { User } from "next-auth"
import { JWT } from "next-auth/jwt"
import { UserRole } from "@prisma/client"

declare module "next-auth/jwt" {
    interface JWT {
        id: string,
        role: string;
        createdAt: Date;
        uniqueName?: string;
    }
}

declare module "next-auth" {
    interface Session {
        user: User & {
            id: string,
            role: UserRole,
            createdAt: Date,
            uniqueName?: string 
        }
    }
}
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  return session?.user
}

export async function getCurrentUserRole() {
  const session = await getServerSession(authOptions)

  return session?.user?.role === "ADMIN"
}
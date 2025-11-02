import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log('=== AUTHORIZE CALLED ===')
          console.log('Credentials:', credentials)
          
          if (!credentials?.email || !credentials?.password) {
            console.error('ERROR: Missing credentials')
            throw new Error('Please provide both email and password')
          }

          console.log('Searching for user:', credentials.email)
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          console.log('User found:', user ? 'YES' : 'NO')
          if (user) {
            console.log('User details:', { email: user.email, isAdmin: user.isAdmin })
          }

          if (!user) {
            console.error('ERROR: User not found')
            throw new Error('No user found with this email')
          }

          if (!user.isAdmin) {
            console.error('ERROR: User is not an admin')
            throw new Error('User is not authorized as admin')
          }

          console.log('Comparing passwords...')
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          console.log('Password valid:', isPasswordValid ? 'YES' : 'NO')

          if (!isPasswordValid) {
            console.error('ERROR: Invalid password')
            throw new Error('Invalid password')
          }

          console.log('✅ Authentication successful!')
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error('=== AUTHORIZE ERROR ===')
          console.error('Error details:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
}

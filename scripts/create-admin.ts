import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@glamifycrowns.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const name = process.env.ADMIN_NAME || 'Admin'

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  })

  if (existingAdmin) {
    console.log('Admin user already exists!')
    return
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      isAdmin: true,
    },
  })

  console.log('✅ Admin user created successfully!')
  console.log('Email:', email)
  console.log('Password:', password)
  console.log('⚠️  Please change the password after first login!')
}

main()
  .catch((e) => {
    console.error('Error creating admin user:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

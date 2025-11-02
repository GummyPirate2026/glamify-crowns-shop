import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@glamifycrowns.com'
  const password = 'Admin123!'
  const name = 'Admin'

  // Delete existing admin if exists
  try {
    await prisma.user.delete({
      where: { email },
    })
    console.log('Deleted existing admin user')
  } catch (e) {
    console.log('No existing admin user to delete')
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new admin user
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      isAdmin: true,
    },
  })

  console.log('✅ Admin user created successfully!')
  console.log('===================================')
  console.log('Email:', email)
  console.log('Password:', password)
  console.log('===================================')
  console.log('⚠️  Save these credentials!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

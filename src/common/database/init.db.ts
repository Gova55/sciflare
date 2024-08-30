import * as bcrypt from 'bcrypt';
import { PrismaService } from './prisma.service';
import { roleType } from '../role';

async function initAdmin(prisma: PrismaService) {
  const hashedPassword = await bcrypt.hash('Admin@77', 10);
  const adminCount = await prisma.admin.count({});
  if (adminCount == 0) {
    await prisma.admin.create({
      data: {
        name: 'Admin',
      },
    });
  }
  const userCount = await prisma.user.count({});
  if (userCount == 0) {
    await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@gmail.com',
        phoneNumber: '9999999999',
        password: hashedPassword,
        adminId: 1,
        isAdmin: true,
        roleId: 1,
        createdBy: 1,
      },
    });
  }
}

async function initRole(prisma: PrismaService) {
  const typeCount = await prisma.role.count({});
  if (typeCount == 0) {
    for (const role of roleType) {
      await prisma.role.create({
        data: {
          name: role.name,
        },
      });
    }
  }
}

async function initDatabase(prisma: PrismaService) {
  try {
    console.log('Entered db');

    await initRole(prisma);
    await initAdmin(prisma);
  } catch (error) {
    console.log(error);
  }
}

export default initDatabase;

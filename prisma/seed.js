require('dotenv/config');

const bcrypt = require('bcrypt');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../dist/database/generated/prisma/client');
const { AddonType, Role } = require('../dist/database/generated/prisma/enums');

// const prisma = new PrismaClient({
//   adapter: new PrismaPg({
//     connectionString: process.env.DATABASE_URL,
//   }),
// });

// const menus = [
//   {
//     id: '11111111-1111-4111-8111-111111111111',
//     menuName: 'Americano',
//     description: 'Classic black coffee with a clean finish.',
//     price: 65,
//   },
//   {
//     id: '22222222-2222-4222-8222-222222222222',
//     menuName: 'Latte',
//     description: 'Espresso with steamed milk and a smooth body.',
//     price: 85,
//   },
//   {
//     id: '33333333-3333-4333-8333-333333333333',
//     menuName: 'Cappuccino',
//     description: 'Espresso, milk, and foam in balance.',
//     price: 85,
//   },
//   {
//     id: '44444444-4444-4444-8444-444444444444',
//     menuName: 'Mocha',
//     description: 'Coffee, milk, and chocolate notes.',
//     price: 95,
//   },
// ];

// const seedMenuIds = menus.map((menu) => menu.id);

// const addons = [
//   {
//     id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
//     type: AddonType.temperature,
//     title: 'Hot',
//     price: 0,
//   },
//   {
//     id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
//     type: AddonType.temperature,
//     title: 'Iced',
//     price: 5,
//   },
//   {
//     id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
//     type: AddonType.coffeeBean,
//     title: 'House Blend',
//     price: 0,
//   },
//   {
//     id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
//     type: AddonType.coffeeBean,
//     title: 'Dark Roast',
//     price: 10,
//   },
//   {
//     id: 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
//     type: AddonType.roastLevel,
//     title: 'Medium',
//     price: 0,
//   },
//   {
//     id: 'cccccccc-cccc-4ccc-8ccc-ccccccccccc2',
//     type: AddonType.roastLevel,
//     title: 'Strong',
//     price: 0,
//   },
//   {
//     id: 'dddddddd-dddd-4ddd-8ddd-ddddddddddd1',
//     type: AddonType.shot,
//     title: 'Extra Shot',
//     price: 20,
//   },
// ];

const users = [
  {
    email: 'user1@gmail.com',
    username: 'user1',
    role: Role.USER,
  },
  {
    email: 'admin1@gmail.com',
    username: 'admin1',
    role: Role.ADMIN,
  },
];

// async function main() {
//   const passwordHash = await bcrypt.hash('123456', 12);

//   for (const user of users) {
//     await prisma.user.upsert({
//       where: { email: user.email },
//       update: {
//         username: user.username,
//         role: user.role,
//         password: passwordHash,
//       },
//       create: {
//         ...user,
//         password: passwordHash,
//       },
//     });
//   }

//   const customMenuCount = await prisma.menu.count({
//     where: {
//       id: {
//         notIn: seedMenuIds,
//       },
//     },
//   });

//   if (customMenuCount > 0) {
//     await prisma.menu.deleteMany({
//       where: {
//         id: {
//           in: seedMenuIds,
//         },
//         cartItems: {
//           none: {},
//         },
//         orderItems: {
//           none: {},
//         },
//       },
//     });
//   } else {
//     for (const menu of menus) {
//       await prisma.menu.upsert({
//         where: { id: menu.id },
//         update: {
//           menuName: menu.menuName,
//           description: menu.description,
//           price: menu.price,
//           isAvailable: true,
//         },
//         create: {
//           ...menu,
//           isAvailable: true,
//         },
//       });
//     }
//   }

//   for (const addon of addons) {
//     await prisma.addon.upsert({
//       where: { id: addon.id },
//       update: {
//         type: addon.type,
//         title: addon.title,
//         price: addon.price,
//       },
//       create: addon,
//     });
//   }
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (error) => {
//     console.error(error);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

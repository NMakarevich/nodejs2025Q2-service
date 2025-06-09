import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();
async function main() {
  const favourites = await prisma.favourites.findFirst();
  if (!favourites)
    await prisma.favourites.create({
      data: { trackIds: [], artistIds: [], albumIds: [] },
    });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

const prisma = require("./src/config/database");

async function main() {
  const result = await prisma.gameSession.updateMany({
    where: { status: "PLAYING" },
    data: { status: "LOST", finishedAt: new Date() },
  });
  console.log(`Updated ${result.count} sessions`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

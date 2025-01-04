import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(phoneNumber) {
  return await prisma.user.create({
    data: {
      phoneNumber,
      optIn: true,
    },
  });
}

export async function createYarnColorRange(minTemp, maxTemp, colorName) {
  return await prisma.yarnColorRange.create({
    data: {
      minTemp,
      maxTemp,
      colorName,
    },
  });
}

export async function recordDailyTemp(date, highTemp) {
  // Find the matching color range
  const colorRange = await prisma.yarnColorRange.findFirst({
    where: {
      AND: [{ minTemp: { lte: highTemp } }, { maxTemp: { gte: highTemp } }],
    },
  });

  if (!colorRange) {
    throw new Error("No matching color range found for temperature");
  }

  return await prisma.dailyTemp.create({
    data: {
      date,
      highTemp,
      colorRangeId: colorRange.id,
    },
  });
}

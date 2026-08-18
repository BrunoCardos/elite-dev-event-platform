import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const organizer = await prisma.user.upsert({
    where: {
      email: 'organizer@test.com',
    },
    update: {},
    create: {
      name: 'Demo Organizer',
      email: 'organizer@test.com',
      passwordHash,
      role: 'ORGANIZER',
    },
  });

  const customer1 = await prisma.user.upsert({
    where: {
      email: 'customer1@test.com',
    },
    update: {},
    create: {
      name: 'Demo Customer 1',
      email: 'customer1@test.com',
      passwordHash,
      role: 'CUSTOMER',
    },
  });

  const customer2 = await prisma.user.upsert({
    where: {
      email: 'customer2@test.com',
    },
    update: {},
    create: {
      name: 'Demo Customer 2',
      email: 'customer2@test.com',
      passwordHash,
      role: 'CUSTOMER',
    },
  });

  const gatekeeper = await prisma.user.upsert({
    where: {
      email: 'gatekeeper@test.com',
    },
    update: {},
    create: {
      name: 'Demo Gatekeeper',
      email: 'gatekeeper@test.com',
      passwordHash,
      role: 'GATEKEEPER',
    },
  });

  const movie = await prisma.movie.upsert({
    where: {
      tmdbId: 550,
    },
    update: {},
    create: {
      tmdbId: 550,
      title: 'Fight Club',
      overview: 'Demo movie imported from TMDb.',
      posterPath: null,
    },
  });

  const existingEvent = await prisma.event.findFirst({
    where: {
      movieId: movie.id,
      organizerId: organizer.id,
    },
  });

  const event =
    existingEvent ??
    (await prisma.event.create({
      data: {
        movieId: movie.id,
        organizerId: organizer.id,
        title: 'Fight Club - Special Screening',
        description: 'Demo cinema event',
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        venue: 'Elite Cinema',
        room: 'Sala 1',
        price: 12.5,
        capacity: 30,
        status: 'PUBLISHED',
      },
    }));

//   const seats = [];
const seats: Array<{
  eventId: string;
  row: string;
  number: number;
  status: 'AVAILABLE';
}> = [];

  for (const row of ['A', 'B', 'C']) {
    for (let number = 1; number <= 10; number++) {
      seats.push({
        eventId: event.id,
        row,
        number,
        status: 'AVAILABLE' as const,
      });
    }
  }

  await prisma.seat.createMany({
    data: seats,
    skipDuplicates: true,
  });

  console.log('Seed completed!');
  console.log({
    organizer: organizer.email,
    customer1: customer1.email,
    customer2: customer2.email,
    gatekeeper: gatekeeper.email,
    event: event.id,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
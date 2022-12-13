// importing the prisma instance we created.
import prisma from './client';

// Prisma Client
const connect = async function connect() {
  try {
    // Connect the client
    await prisma.$connect();

    // const allUsers = await prisma.patient.findMany({});

    // console.dir(allUsers, { depth: null });
    console.info('Database is Ready');
  } catch (err) {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
};
export default connect;

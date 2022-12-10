// importing the prisma instance we created.
import prisma from './client';

// Prisma Client
const connect = async function connect() {
  try {
    // Connect the client
    await prisma.$connect();

    // await prisma.patient.create({
    //   data: {
    //     name: 'Isa',
    //     email: 'isa@sabbagh.com',
    //     token: '',
    //     phone: '',
    //     ip: '',
    //     appointments: {
    //       create: {
    //         title: 'My first post',
    //         slug: 'my-first-post',
    //         category: 'teeth',
    //         description: 'Lots of really interesting stuff',
    //       },
    //     },
    //   },
    // });

    const allUsers = await prisma.patient.findMany({});

    console.dir(allUsers, { depth: null });
  } catch (err) {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}
export default connect

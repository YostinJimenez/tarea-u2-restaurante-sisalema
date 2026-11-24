require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    // Al borrar con el comando prisma el problema viene que en el modelo fisico si eliminamos primero los user me va a dar error ya que esta en cascada con el modelo Appointment 
    // prisma.appointment.deleteMany();
    // prisma.timeBlock.deleteMany();
    // prisma.user.deleteMany();
    // const user1 = await prisma.user.create(
    //     {
    //         data: {
    //             name: "Paulo Galarza",
    //             email: "paulo.galarza@example.com",
    //             password: "vitinia",
    //             role: "ADMIN"
    //         }
    //     }
    // );
    // const user2 = await prisma.user.create(
    //     {
    //         data: {
    //             name: "Julian Galarza",
    //             email: "julian@gmail.com",
    //             password: "vitinia2004",
    //             role: "USER"
    //         }
    //     }
    // );
    // const timeBlock1 = await prisma.timeBlock.create(
    //     {
    //         data: {
    //             startTime: new Date('2026-10-26T09:00:00Z'),
    //             endTime: new Date('2026-10-26T11:00:00Z'),
    //         }
    //     }
    // );
    // const timeBlock2 = await prisma.timeBlock.create(
    //     {
    //         data: {
    //             startTime: new Date('2026-10-26T10:00:00Z'),
    //             endTime: new Date('2026-10-26T11:00:00Z'),
    //         }
    //     }
    // );
    // await prisma.appointment.create(
    //     {
    //         data: {
    //             date: new Date('2026-10-26T09:00:00Z'),
    //             user: {
    //                 connect: {
    //                     id: user1.id
    //                 }
    //             },
    //             timeBlock: {
    //                 connect: {
    //                     id: timeBlock1.id
    //                 }
    //             },
    //         }
    //     }
    // );
    // await prisma.appointment.create(
    //     {
    //         data: {
    //             date: new Date('2026-10-26T10:00:00Z'),
    //             user: {
    //                 connect: {
    //                     id: user2.id
    //                 }
    //             },
    //             timeBlock: {
    //                 connect: {
    //                     id: timeBlock2.id
    //                 }
    //             },
    //         }
    //     }
    // );
    // const demoUsers = [
    //     {
    //         name: "Paulo Galarza",
    //         email: "paulo.galarza@example.com",
    //         password: "vitinia",
    //         role: "ADMIN"
    //     },
    //     {
    //         name: "Julian Galarza",
    //         email: "[EMAIL_ADDRESS]",
    //         password: "[PASSWORD]",
    //         role: "USER"
    //     },
    //     {
    //         name: "Karol Gilces",
    //         email: "[EMAIL_ADDRESS]",
    //         password: "[PASSWORD]",
    //         role: "USER"
    //     },

    // ];


    // console.log("Usuarios de demostracion creados con exito!");
    // Mostrar los usuarios
    // await prisma.user.findMany();
    // Eliminar los usuarios
    // await prisma.user.deleteMany();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ 
      getUsers: users
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching words data from database' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
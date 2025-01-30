import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const words = await prisma.word.findMany();
    return NextResponse.json({ 
      getWords: words
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
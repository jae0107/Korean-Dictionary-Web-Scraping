import prisma from '@/app/lib/prisma';
import { RequestBody } from '@/app/types/types';
import * as bcrypt from 'bcrypt';

export async function POST(request: Request) {
  const body: RequestBody = await request.json()

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: await bcrypt.hash(body.password, 10),
      year: 0,
      class: '',
      number: 0,
      role: 'STUDENT',
    },
  });

  const { password, ...result } = user
  return new Response(JSON.stringify(result))
}
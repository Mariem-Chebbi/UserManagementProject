import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    const { firstname, lastname, email, password, birthdate, address, phone } = await req.json();

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                firstname,
                lastname,
                email,
                password: hashedPassword, 
                birthdate: new Date(birthdate), 
                address,
                phone,
            },
        });

        return NextResponse.json({ success: true, user: newUser }, { status: 200 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Error creating user', details: error.message }, { status: 500 });
    }
}

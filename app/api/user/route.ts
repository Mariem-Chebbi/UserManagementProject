
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '../../../lib/prisma';
import { authConfig } from "@/lib/auth";

export async function PUT(req: Request) {

    const session = await getServerSession(authConfig);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session?.user?.email;

    try {
        const body = await req.json();
        const { firstname, lastname, birthdate, email, address, phone, password } = body;

        const updatedUser = await prisma.user.update({
            where: { email: userEmail },
            data: {
                firstname,
                lastname,
                birthdate: new Date(birthdate),
                email,
                address,
                phone,
                ...(password && { password: await hashPassword(password) }),
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 400 });
    }
}

import bcrypt from 'bcrypt';

const hashPassword = async (password: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

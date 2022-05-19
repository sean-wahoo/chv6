import { PrismaClient } from "@prisma/client";
import { ProfileDataResponse } from "lib/types";
import type { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { user_id } = req.query;
    const profile_data = await prisma.users.findFirst({
      select: {
        user_id: true,
        email: true,
        updated_at: true,
        created_at: true,
        image_url: true,
        display_name: true,
        date_of_birth: true,
        tagline: true,
      },
      where: { user_id: user_id as string },
    });
    console.log({ profile_data });
    if (profile_data === null) {
      console.log("empty");
      throw { message: "user-not-found" };
    }
    res.status(200).json({ ...profile_data });
  } catch (e: any) {
    console.log({ e });
    res.status(500).json({
      is_error: true,
      error_code: e.code,
      error_message: e.message,
    } as ProfileDataResponse);
  } finally {
    prisma.$disconnect();
  }
};
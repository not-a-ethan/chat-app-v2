import { NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";

import { updateActvitiy } from "./updateActivity";

import { ApiAuth } from "@/types";

export async function apiAuthCheck(req: NextRequest): Promise<ApiAuth> {
    const token = await getToken({ req });

    if (!token) {
        return {
            auth: false,
            userId: -1
        };
    };

    const userId: number = Number(token.sub);
    updateActvitiy(userId);

    return {
        auth: true,
        userId: userId
    };
};
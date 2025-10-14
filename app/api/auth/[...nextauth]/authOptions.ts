import { type AuthOptions } from "next-auth";

import GitHubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GitHubProvider({
            id: "Github",
            clientId: process.env.githubClientId!,
            clientSecret: process.env.githubClientSecret!,
        })
    ]
};
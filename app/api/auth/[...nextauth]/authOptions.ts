import { createAccount } from "@/helpers/accountStuff/createAccount";
import { type AuthOptions } from "next-auth";

import GitHubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GitHubProvider({
            id: "github",
            clientId: process.env.githubClientId!,
            clientSecret: process.env.githubClientSecret!,
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials}: any) {
            const id: number = Number(account?.providerAccountId);
            const username: string = profile?.login;

            await createAccount(id, username);
            
            return true;
        },
        async session({ session, token, user }) {
            const userId = {
                "userId": token.sub
            };

            const newSession = {...session, ...userId};

            return newSession;
        }
    }
};
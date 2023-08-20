import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
	// This is a temporary fix for prisma client.
	// @see https://github.com/prisma/prisma/issues/16117
	// adapter: PrismaAdapter(prisma as any),
	// pages: {
	// 	signIn: "/login",
	// },
	// session: {
	// 	strategy: "jwt",
	// },
	providers: [
		CredentialsProvider({
			name: "Sign in",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const { email, password } = credentials ?? {};
				if (!email || !password) {
					throw new Error("Missing username or password");
				}

				const user = await prisma.user.findUnique({
					where: {
						email,
					},
				});

				if (!user || !(await compare(password, user.password!))) {
					throw new Error("Invalid username or password");
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					randomKey: "Hey cool",
				};
			},
		}),
	],
	// callbacks: {
	// 	session: ({ session, token }) => {
	// 		return {
	// 			...session,
	// 			user: {
	// 				...session.user,
	// 				id: token.id,
	// 				randomKey: token.randomKey,
	// 			},
	// 		};
	// 	},
	// 	jwt: ({ token, user }) => {
	// 		if (user) {
	// 			const u = user as unknown as any;
	// 			return {
	// 				...token,
	// 				id: u.id,
	// 				randomKey: u.randomKey,
	// 			};
	// 		}
	// 		return token;
	// 	},
	// },
};

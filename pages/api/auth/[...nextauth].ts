import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";

declare module "next-auth" {
    interface Session {
      accessToken?: string;
    }

    interface User {
        id?: string
        _id: string
    }
} 

export const authOptions: AuthOptions = {
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
        }),
        // ...add more providers here

        Credentials({
            name: 'Custom Login',
            credentials: {
                email: {
                    label: 'Correo',
                    type: 'email',
                    placeholder: 'correo@google.com'
                },
                password: {
                    label: 'Contraseña',
                    type: 'password',
                    placeholder: 'Contraseña'
                },
            },
            async authorize(credentials) {
                
                return await dbUsers.checkUserEmailPassword(
                    credentials!.email, 
                    credentials!.password
                );

            },
        })
    ],

    // Custom Pages
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register',
    },

    session: {
        maxAge: 259200, // 30 dias
        strategy: 'jwt',
        updateAge: 86400 // cada dia se actualiza.
    },

    // Callbacks
    callbacks: {

        async jwt({ token, account, user }) {

            if( account ) {
                token.accessToken = account.access_token;

                if( account.type === 'credentials' ) {
                    token.user = user;
                };

                if(account.type === 'oauth') {
                    token.user = dbUsers.oAuthToDBUser(user?.email || '', user?.name || '')
                };

                if(account.type === 'email') {

                }
            }

            return token;
        },

        async session({ session, token, user }) {
            
            session.accessToken = token.accessToken as any;
            session.user = token.user as any;

            return session;
        }
    }
}

export default NextAuth(authOptions)
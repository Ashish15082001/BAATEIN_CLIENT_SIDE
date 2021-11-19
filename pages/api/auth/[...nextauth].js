import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { compare } from "bcryptjs";
import { DATABASE_URL } from "../..";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;

        const emailsResponse = await fetch(`${DATABASE_URL}/emails.json`);
        const emails = await emailsResponse.json();

        const emailsArray = Object.values(emails);
        const isEmailValid = emailsArray.some(
          (emailObject) => emailObject.email === email
        );

        if (isEmailValid !== true) throw new Error("invalid email.");
        else {
          const authenticationCredentialsResponse = await fetch(
            `${DATABASE_URL}/users/authenticationCredentials.json`
          );
          const authenticationCredentials =
            await authenticationCredentialsResponse.json();

          const authenticationCredentialsArray = Object.values(
            authenticationCredentials
          );

          for (const authenticationCredential of authenticationCredentialsArray) {
            if (authenticationCredential.email === email) {
              const isPasswordSame = await compare(
                password,
                authenticationCredential.password
              );

              if (!isPasswordSame) throw new Error("password is wrong.");
            }
          }
        }

        return { email };
      },
    }),
  ],
});

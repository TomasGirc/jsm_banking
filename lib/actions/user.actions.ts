'use server'

import { cookies } from "next/headers"
import { createAdminClient, createSessionClient } from "../appwrite"
import { ID } from "node-appwrite"
import { parseStringify } from "../utils"

// Appwrite backend
export const signIn = () => {
    try {
        // Mutation
    } catch (error) {
        console.error('Error ', error)
    }
}
export const signUp = async ({ password, ...userData } : SignUpParams) => {
    const {
        email, 
        firstName, 
        lastName, 
    } = userData;

    let newUserAccount;
    try {
        const { account, database  } = await createAdminClient();

        newUserAccount = await account.create(
            ID.unique(), 
            email, 
            password, 
            `${firstName} ${lastName}`
          );
      
          if(!newUserAccount) throw new Error('Error creating user')
            
        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });
        return parseStringify(newUserAccount)

    } catch (error) {
        console.error('Error ', error)
    }
}

export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      return await account.get();
    } catch (error) {
      return null;
    }
  }
  
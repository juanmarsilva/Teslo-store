import bcrypt from 'bcryptjs';

import { db } from ".";
import { User } from "../models";


/**
 * The function checks if a user's email and password match and returns the user's information if they
 * do.
 * @param {string} email - The email parameter is a string that represents the user's email address.
 * @param {string} password - The password parameter is a string that represents the user's password.
 * @returns an object with the properties _id, role, name, and email.
*/
export const checkUserEmailPassword = async ( email: string, password: string ) => {
    
    await db.connect();

    const user = await User.findOne({ email });

    await db.disconnect();

    if( !user ) return null;

    if( !bcrypt.compareSync( password, user.password! ) ) return null;

    const { role, name, _id } = user;

    return {
        _id,
        role,
        name,   
        email: email.toLowerCase(),
    }

};


/**
 * The function `oAuthToDBUser` takes an OAuth email and name, checks if the user exists in the
 * database, creates a new user if not, and returns the user's ID, name, email, and role.
 * @param {string} oAuthEmail - The oAuthEmail parameter is a string that represents the email address
 * associated with the OAuth user.
 * @param {string} oAuthName - The name of the user obtained from the OAuth provider.
 * @returns an object with the properties `_id`, `name`, `email`, and `role`.
 */
export const oAuthToDBUser = async (oAuthEmail: string, oAuthName: string) => {
 
    await db.connect();

    const user = await User.findOne({ email: oAuthEmail });

    if( user ) {
        await db.disconnect();

        const { _id, name, email, role } = user;

        return { _id, name, email, role };
    };

    const newUser = new User({ 
        email: oAuthEmail, 
        name: oAuthName, 
        password: '@',
        role: 'client',
    });

    await newUser.save();

    await db.disconnect();

    const { _id, name, email, role } = newUser;

    return { _id, name, email, role };
}

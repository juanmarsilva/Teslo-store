import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

import { db } from '../../../database';
import { User } from '../../../models';
import { Jwt, Validations } from '../../../utils';

type Data = 
| { message: string }
| {
    token: string,
    user: {
        email: string,
        role: string,
        name: string,
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'POST':
            return registerUser(req, res);
        default:
            res.status(400).json({
                message: 'No existe dicho endpoint.'
            })
    }

}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string };

    if( password.length < 6 ) {
        return res.status(400).json({ message: 'La contraseña debe de ser de 6 caracteres o más' });
    };

    if( name.length < 2 ) {
        return res.status(400).json({ message: 'El nombre debe de ser de 2 caracteres o más' });
    }

    if(!Validations.isValidEmail( email )) {
        return res.status(400).json({ message: 'El corro proporcionado no es válido' });
    }

    await db.connect();

    const user = await User.findOne({ email });

    if( user ) {
        await db.disconnect();
        return res.status(400).json({ message: 'Ese correo ya está registrado' });
    }

    const newUser = new User({
        name,
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
    });

    try {

        await newUser.save({ validateBeforeSave: true });

    } catch(error) {
        return res.status(500).json({
            message: 'Revisar logs del servidor'
        })
    }

    const { _id, role } = newUser;

    const token = Jwt.signToken( _id, email );

    return res.status(200).json({
        token,
        user: {
            email,
            role,
            name,
        }
    })
}
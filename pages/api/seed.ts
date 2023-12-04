import type { NextApiRequest, NextApiResponse } from 'next';
import { db, seedDatabase } from '../../database';
import { Order, Product, User } from '../../models';


type Data = {
    msg: string
}

const handler = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    if( process.env.NODE_ENV === 'production' ) {
        
        return res.status(401).json({ msg: 'No tiene acceso a este API' });

    };

    try {
        
        await db.connect();
        
        await User.deleteMany();
        await User.insertMany( seedDatabase.initialData.users );

        await Product.deleteMany();
        await Product.insertMany( seedDatabase.initialData.products );

        await Order.deleteMany();

        await db.disconnect();

        return res.status(200).json({ msg: 'Proceso ejecutado correctamente!' });

    } catch(err) {

        console.log( err );
        
        await db.disconnect();
        
        return res.status(400).json({ msg: 'Algo ha salido mal' });

    };
}

export default handler;

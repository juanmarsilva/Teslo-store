import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces/products';
import { ProductModel } from '../../../models';

type Data = 
| { msg: string }
| IProduct[]

const handler = ( req: NextApiRequest, res: NextApiResponse<Data> ) => {
    
    const { method } = req;

    if( method === 'GET' ) return searchProducts( req, res );

    return res.status(400).json({ msg: 'Bad request' });
}

const searchProducts = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    let { q = '' } = req.query;

    if( q.length === 0 ) return res.status(400).json({ msg: 'Debe de especificar el query de busqueda' });

    q = q.toString().toLowerCase();

    try {
        
        await db.connect();

        const products = await ProductModel.find({ $text: { $search: q } }).select('title images price inStock slug -_id').lean();

        await db.disconnect();

        if( products.length === 0 ) return res.status(400).json({ msg: 'No se encontro ningun producto válido' });

        return res.status(200).json( products );

    } catch( err ) {
        
        console.log( err );

        await db.disconnect();

        return res.status(400).json({ msg: 'Bad request' })
    } 
};

export default handler;
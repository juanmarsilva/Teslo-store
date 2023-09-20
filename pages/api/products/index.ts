import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database';
import { ProductModel } from '../../../models';
import { IProduct } from '../../../interfaces/products';

type Data = 
| { msg: string }
| IProduct[]

const handler = (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { method } = req;

    if( method === 'GET' ) return getProducts( req, res );

    return res.status(400).json({ msg: 'Bad Request' })
}


const getProducts = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { gender = 'All' } = req.query;

    let condition = {};

    if( gender !== 'All' && SHOP_CONSTANTS.validGenders.includes( `${ gender }` ) ) {

        condition = { gender };
        
    }

    try {

        await db.connect();

        const products = await ProductModel.find( condition )
                                           .select('title images price inStock slug -_id')
                                           .lean();

        await db.disconnect();
        
        return res.status(200).json( products );

    } catch(err) {
        
        console.log( err );

        await db.disconnect();

        return res.status(400).json({ msg: 'Bad request' })

    }
}


export default handler;
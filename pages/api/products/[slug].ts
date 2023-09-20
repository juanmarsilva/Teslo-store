import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces/products';
import { ProductModel } from '../../../models';

type Data = 
| { msg: string }
| IProduct

const hanlder = ( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { method } = req;

    if( method === 'GET' ) return getProductBySlug( req, res );

    return res.status(400).json({ msg: 'Bad request' });
};

const getProductBySlug = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { slug } = req.query;

    try { 
        
        await db.connect();

        const product = await ProductModel.findOne({ slug }).lean();

        await db.disconnect();

        if( !product ) return res.status(404).json({ msg: 'Producto no encontrado' });

        return res.status(200).json( product );

    } catch( err ) {
        
        console.log( err );

        await db.disconnect();

        return res.status(404).json({ msg: 'No ha sido encontrado dicho producto' });

    };

};


export default hanlder;


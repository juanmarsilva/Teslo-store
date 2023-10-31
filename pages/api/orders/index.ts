import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { authOptions } from '../auth/[...nextauth]';

import { IOrder } from '../../../interfaces';
import { db } from '../../../database';
import { Order, Product } from '../../../models';

type Data = 
{ message: string }
| IOrder;

/**
 * The function exports a default handler that checks the HTTP method of the request and calls the
 * appropriate function based on the method.
 * @param {NextApiRequest} req - The `req` parameter is an object that represents the incoming HTTP
 * request. It contains information such as the request method, headers, query parameters, and body.
 * @param res - The `res` parameter is an instance of the `NextApiResponse` class, which represents the
 * HTTP response that will be sent back to the client. It is used to set the status code, headers, and
 * send the response body.
 * @returns If the method is 'POST', the function `createOrder` is being returned. Otherwise, a
 * response with status code 400 and a JSON object containing the message 'Bad Request' is being
 * returned.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    const { method } = req;

    if( method === 'POST' ) return createOrder( req, res );

    return res.status(400).json({ message: 'Bad Request' })
}

/**
 * The `createOrder` function is an asynchronous function that handles the creation of an order,
 * including validation and saving it to the database.
 * @param {NextApiRequest} req - NextApiRequest - The request object containing information about the
 * incoming HTTP request.
 * @param res - The `res` parameter is an instance of the `NextApiResponse` class, which represents the
 * HTTP response that will be sent back to the client. It is used to send the response data, set
 * headers, and handle errors.
 * @returns a JSON response with the created order if the order creation is successful. If there is an
 * error, it returns a JSON response with an error message.
 */
const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { orderItems, total } = req.body as IOrder;

    const session: any = await getServerSession(req, res, authOptions);

    if( !session ) {
        return res.status(401).json({ message: 'Debe estar autenticado para hacer esto.'});
    }

    const productsIds = orderItems.map( product => product._id );

    await db.connect();

    /* This line is querying the database to find all products whose `_id` matches any of the `productsIds` in the `orderItems` array. It uses the `` operator to match multiple values in the `_id` field. The result is
    stored in the `dbProducts` variable. */
    const dbProducts = await Product.find({ _id: { $in: productsIds } });

    try {
        
        const subtotal = orderItems.reduce((prevValue, current) => {
            const currentPrice = dbProducts.find( prod => prod.id === current._id )!.price;

            if( !currentPrice ) throw new Error('Verifique el carrito de nuevo, dicho producto no existe.');

            return (current.quantity * currentPrice) + prevValue;
        }, 0);

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const backendTotal = subtotal * ( taxRate + 1 );

        if( total !== backendTotal ) throw new Error('El total no cuadra con el monto.');

        const userId = session.user._id;

        const newOrder = new Order({ ...req.body, isPaid: false, user: userId });

        await newOrder.save();

        await db.disconnect();

        return res.status(201).json( newOrder );

    } catch (error: any) {
        await db.disconnect();
        console.log(error);
        res.status(400).json({
            message: error.message || 'Revise los logs del servidor',
        })
    }

    return res.status(201).json( req.body );
}
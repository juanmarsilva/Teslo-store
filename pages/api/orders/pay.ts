

import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { IPaypal } from '../../../interfaces';
import { db } from '../../../database';
import { Order } from '../../../models';
import { isValidObjectId } from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    const { method } = req;

    if( method === 'POST' ) return payOrder(req, res);

    return res.status(400).json({ message: 'Bad request' })
};

/**
 * The function `getPaypalBearerToken` retrieves a bearer token from PayPal's OAuth API using client
 * credentials.
 * @returns The function `getPaypalBearerToken` returns a Promise that resolves to a string (the access
 * token) or null.
 */
const getPaypalBearerToken = async (): Promise<string | null> => {
    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const base64Token = Buffer.from(`${ PAYPAL_CLIENT_ID }:${ PAYPAL_SECRET }`, 'utf-8').toString('base64');

    const body = new URLSearchParams('grant_type=client_credentials')

    try {

        const { data } = await axios.post( process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${ base64Token }`,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })

        return data.access_token;

    } catch(error) {
        if( axios.isAxiosError(error) ) {
            console.log(error.response?.data);
        } else {
            console.log(error);
        }

        return null;
    }
};

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const paypalBearerToken = await getPaypalBearerToken();

    if( !paypalBearerToken ) {
        return res.status(400).json({ message: 'No se pudo confirmar el token de Paypal' })
    }

    try {
        const { transactionId = '', orderId = '' } = req.body;

        const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(
            `${ process.env.PAYPAL_ORDERS_URL }/${ transactionId }`,
            {
                headers: {
                    'Authorization': `Bearer ${ paypalBearerToken }`
                }
            }
        );

        if( data.status !== 'COMPLETED' ) {
            return res.status(400).json({ message: 'Orden no reconocida' });
        }

        await db.connect();

        const dbOrder = await Order.findById( orderId );

        if( !dbOrder ) {
            await db.disconnect();
            return res.status(400).json({ message: 'Orden no existe en nuestra base de datos' });
        };

        if( !isValidObjectId( dbOrder._id ) ) {
            await db.disconnect();
            return res.status(400).json({ message: 'ID de orden no valido' });
        };

        if( dbOrder.total !== Number( data.purchase_units[0].amount.value ) ) {
            await db.disconnect();
            return res.status(400).json({ message: 'Los montos de Paypal y nuestra orden no son iguales.' });
        };

        dbOrder.transactionId = transactionId;
        dbOrder.isPaid = true;

        await dbOrder.save();

        await db.disconnect();

        return res.status(200).json({ message: 'Orden pagada' });
    } catch (error) {
        console.log(error);
    }
}
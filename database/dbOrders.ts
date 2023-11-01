import { isValidObjectId } from "mongoose";

import { IOrder } from "../interfaces";
import { db } from ".";
import { Order } from "../models";


/**
 * The function `getOrderById` retrieves an order from the database by its ID and returns it as a JSON
 * object.
 * @param {string} id - The `id` parameter is a string that represents the ID of the order that we want
 * to retrieve.
 * @returns a Promise that resolves to either an IOrder object or null.
 */
export const getOrderById = async ( id: string ): Promise<IOrder | null> => {

    if( !isValidObjectId(id) ) return null;

    await db.connect();

    const order = await Order.findById( id ).lean();

    await db.disconnect();

    if( !order ) return null;

    return JSON.parse(JSON.stringify(order));
}




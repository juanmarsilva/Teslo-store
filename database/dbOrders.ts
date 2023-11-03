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

/**
 * The function `getOrdersByUser` retrieves orders from the database for a given user ID.
 * @param {string} userId - The userId parameter is a string that represents the ID of the user for
 * whom we want to retrieve the orders.
 * @returns a Promise that resolves to an array of IOrder objects.
 */
export const getOrdersByUser = async ( userId: string ): Promise<Array<IOrder>> => {
    
    if( !isValidObjectId(userId) ) return [];

    await db.connect();

    const orders = await Order.find({ user: userId }).lean();

    await db.disconnect();

    return JSON.parse(JSON.stringify(orders));

}


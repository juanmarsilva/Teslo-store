import { db } from ".";
import { Product } from "../models";
import { IProduct } from "../interfaces";

interface ProductSlug {
    slug: string;
}


export const getProductsBySlug = async ( slug: string ): Promise<IProduct | null> => {

    try {
        
        await db.connect();

        const product = await Product.findOne({ slug }).lean();

        await db.disconnect();

        if( !product ) return null; 

        return JSON.parse( JSON.stringify( product ));

    } catch( err ) {
        
        console.log( err );

        await db.disconnect();

        return null;

    } 


};

export const getAllProductsSlugs = async (): Promise<ProductSlug[]> => {

    try {
    
        await db.connect();

        const slugs = await Product.find().select('slug -_id').lean();

        await db.disconnect();

        return slugs;

    } catch( err ) {
        
        console.log( err );

        await db.disconnect();

        return [];
    }

};

export const getProductsByTerm = async ( term: string ): Promise<IProduct[]> => {

    try {
        
        await db.connect();

        const products = await Product.find({
            $text: { $search: term }
        })
        .select('title images price inStock slug -_id')
        .lean()

        await db.disconnect();

        return products;

    } catch( err ) {

        console.log( err );

        await db.disconnect();

        return [];
    };
};

export const getAllProducts = async (): Promise<IProduct[]> => {

    try {
    
        await db.connect();

        const products = Product.find().lean();

        await db.disconnect();

        return JSON.parse( JSON.stringify( products ) );

    } catch( err ) {

        console.log( err );

        await db.disconnect();

        return [];
    }



};
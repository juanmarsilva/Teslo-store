import JWT from 'jsonwebtoken';


export const signToken = ( _id: string, email: string ): string => {

    if( !process.env.JWT_SECRET_SEED ) {
        throw new Error('No hay semilla de JWT - Revisar variables de entorno');
    }

    return JWT.sign(
        // Payload
        { _id, email },

        // Seed
        process.env.JWT_SECRET_SEED,

        // Options
        { expiresIn: '30d' }
        
    )

}
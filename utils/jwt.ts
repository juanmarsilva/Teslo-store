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

};


export const isValidToken = (token: string): Promise<string> => {

    if( !process.env.JWT_SECRET_SEED ) {
        throw new Error('No hay semilla de JWT - Revisar variables de entorno');
    };

    if( token.length <= 10 ) return Promise.reject('JWT no es válido.');

    return new Promise((resolve, reject) => {

        try {

            JWT.verify( token, process.env.JWT_SECRET_SEED || '' , (err, payload) => {

                if( err ) return reject('JWT no es válido');

                const { _id } = payload as { _id: string };

                resolve( _id );
            })

        } catch(error) {
            reject('JWT no es válido');
        }

    })

}
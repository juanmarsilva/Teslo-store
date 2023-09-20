import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    msg: string
}

const handler = ( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    return res.status(400).json({ msg: 'Bad request' });
    
};

export default handler;
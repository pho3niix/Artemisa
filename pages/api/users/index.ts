import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { IUsers } from '../../../db/models/User.model';
import { ISessions } from '../../../db/models/Sessions.model';
import CustomError from "../../../utils/CustomError";

export default async function Index(req: NextApiRequest, res: NextApiResponse): Promise<void> {

}
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { IUsers } from '../../../db/models/User.model';
import { ISessions } from '../../../db/models/Sessions.model';
import ApiHandler from "../../../utils/middlewares/handler";
import CustomError from "../../../utils/CustomError";
import { LoginBody } from "../../../utils/schemas/session.schema"
import { Login } from "./controllers";

export default ApiHandler({
    POST: {
        schema: LoginBody,
        handler: async (
            req,
            res,
            body
        ) => { await Login(req, res, body) }
    }
});
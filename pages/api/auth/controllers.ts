import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import CustomError from "../../../utils/CustomError";
import Users, { ILogin } from "../users/queries";
import * as Services from "../../../utils/services";

export async function Login(req: NextApiRequest, res: NextApiResponse, body: ILogin): Promise<any> {

    const User = await Users.GetSuperUserByEmail({ Email: body.Email });

    if (!User) throw new CustomError(404, "User does not exist.")

    if (!User.HasAccess) throw new CustomError(409, "Account temporally deactivated, talk to an administrator");

    if (!Services.ComparePassword(body.Password, User.Password)) throw new CustomError(409, "The credentials entered are incorrect");

    const Session = await Users.CreateSession({
        UserId: User.UserId,
        Expiration: 30
    });

    const maxAge = 60 * 60 * 2; // 1 día en segundos
    const isProduction = process.env.NODE_ENV === "production";

    // Construimos el string del header Set-Cookie
    const cookieString = [
        `session=${Session}`,
        `Max-Age=${maxAge}`,
        `Path=/`,
        `HttpOnly`, // 🔒 Evita que JavaScript lea el token en el cliente
        `SameSite=Strict`,
        isProduction ? `Secure` : "" // Solo requiere HTTPS en producción
    ].filter(Boolean).join('; ');

    // Inyectamos la cabecera en la respuesta HTTP
    res.setHeader('Set-Cookie', cookieString);

    return res.status(200).json({
        message: `Welcome to Doc Papers ${User.FullName}`,
        results: {
            userId: User.UserId,
            token: Session,
            email: User.Email,
            fullName: User.FullName
        }
    })
}
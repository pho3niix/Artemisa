import db from "../../../db/db"
import Users, { IUsers } from "../../../db/models/User.model";
import Sessions, { ISessions } from "../../../db/models/Sessions.model";
import { HashPassword, ComparePassword, ConfirmPassword } from "../../../utils/services";
import { Op, literal } from "sequelize";
import * as Services from "../../../utils/services";

export interface ILogin {
    Email: string;
    Password: string;
}

export interface ISuperUser {
    UserId: IUsers['UserId']
    HasAccess: IUsers['HasAccess']
    Password: IUsers['Password']
    FullName: IUsers['FullName']
    Email: IUsers['Email']
}

class Structures {
    constructor() { }
}

class Queries extends Structures {
    super() { }

    public async GetSuperUserByEmail({ Email }: { Email: IUsers['Email'] }): Promise<ISuperUser> {
        try {
            const User = await Users.findOne({
                where: {
                    Email,
                    IsActive: true
                },
                attributes: ['UserId', 'HasAccess', 'Password', "Name", "LastName", "Email"]
            });

            return User
        } catch (error) {
            return error
        }
    }

    public async CreateSession({ UserId, Expiration }: { UserId: IUsers['UserId'], Expiration: number }): Promise<string> {

        const Session = await Sessions.create({
            OwnerUserId: UserId,
            ExpiresAt: Services.ExpireToken(new Date(), Expiration)
        });

        const Token = Services.CreateToken({
            UserId,
            SessionId: Session.SessionId
        });

        await Sessions.update({
            Token
        }, {
            where: {
                SessionId: Session.SessionId
            }
        });

        return Token
    }
}

export default new Queries();
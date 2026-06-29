import Bcrypt from 'bcryptjs';
import moment from 'moment';
import tz from 'moment-timezone'
import jwt from "jsonwebtoken";
import cryptojs from "crypto-js";

moment.locale('en');

tz.tz.setDefault('America/Monterrey')

export interface IPayload {
    UserId: string;
    SessionId: string;
};

export function HashPassword(sPassword: string): string {
    const Password = Bcrypt.hashSync(sPassword, Bcrypt.genSaltSync(10));
    return Password;
}

export function ConfirmPassword(sPassword: string, sNewPassword: string): boolean {
    return sPassword != sNewPassword;
}

export function ComparePassword(sPassword: string, sHash: string): boolean {
    return Bcrypt.compareSync(sPassword, sHash);
}

export interface Filters {
    PageNumber?: number;
    ItemsPerPage?: number;
    Search?: string;
}

export function FormatDate(date: Date): string {
    return moment(date).format('D MMMM YYYY hh:mma')
}

function EncryptObject(object: object): string {
    return cryptojs.AES.encrypt(JSON.stringify(object), process.env.AES_SECRET).toString();
};

export function ExpireToken(tDate: Date, iMinutes: number): Date {
    return new Date(tDate.getTime() + (iMinutes * 60 * 1000));
}

export function CreateToken(payload: IPayload): string {
    const NewPayload: IPayload = {
        UserId: payload.UserId,
        SessionId: payload.SessionId
    };

    return jwt.sign({
        hash: EncryptObject(NewPayload)
    }, process.env.JWT_SECRET, {
        algorithm: 'HS256'
    })
}
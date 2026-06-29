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

export function HashPassword(Password: string): string {
    return Bcrypt.hashSync(Password, Bcrypt.genSaltSync(12));
}

export function ConfirmPassword(Password: string, NewPassword: string): boolean {
    return Password != NewPassword;
}

export function ComparePassword(Password: string, Hash: string): boolean {
    return Bcrypt.compareSync(Password, Hash);
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

export function ExpireToken(date: Date, iMinutes: number): Date {
    return new Date(date.getTime() + (iMinutes * 60 * 1000));
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
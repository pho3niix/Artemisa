import Joi from "joi";

export function RequiredBoolean(): any {
    return Joi.boolean().required();
}

export function Boolean(): any {
    return Joi.boolean();
}

export function RequiredArray(): any {
    return Joi.array().required()
}

export function Array(): any {
    return Joi.array()
}

export function RequiredArrayItems(items: object): any {
    return Joi.array().required().items(items).min(1)
}

export function ArrayItems(items: object): any {
    return Joi.array().items(items).min(1)
}

export function UUID() {
    return Joi.string().guid().trim().allow('').allow(null);
}

export function UUIDArray(): any {
    return Joi.array().items(Joi.string().guid()).min(1)
}

export function RequiredUUID(): any {
    return Joi.string().guid().trim().required();
}

export function RequiredUUIDAllowNull(): any {
    return Joi.string().guid().trim().allow(null).required();
}

export function UUIDAllowNull(): any {
    return Joi.string().guid().trim().allow(null);
}

export function RequiredUUIDArray(): any {
    return Joi.array().required().items(Joi.string().guid()).min(1)
}

export function EmptyUUIDArray(): any {
    return Joi.array().items(Joi.string().guid()).allow(null)
}

export function RequiredString(): any {
    return Joi.string().trim().required();
}

export function RequiredStringLength(length?: number): any {
    return Joi.string().trim().required().max(length);
}

export function RequiredLowString(): any {
    return Joi.string().trim().required().lowercase();
}

export function RequiredNumber(): any {
    return Joi.number().required();
}

export function RequiredNumberAllowZero(): any {
    return Joi.number().required();
}

export function RequiredNumberAllowNegative(): any {
    return Joi.number().required();
}

export function Number(): any {
    return Joi.number();
}

export function String(): any {
    return Joi.string().trim().allow("").allow(null);
}

export function StringNotEmpty(): any {
    return Joi.string().trim();
}

export function StringLength(length: number): any {
    return Joi.string().trim().allow("").max(length).allow(null);
}

export function StringSort(): any {
    return Joi.string().trim().valid('asc', 'desc').allow("").allow(null);
}

export function CorrectPassword(): any {
    return Joi.string().required().trim().regex(/(^[a-zA-Z0-9])*(^[a-zA-Z0-9?_`~;:!#%*+=@&.]+$)/).min(6);
}

export function RequiredCorrectEmail(): any {
    return Joi.string().trim().email().lowercase().max(70).required();
}

export function CorrectEmail(): any {
    return Joi.string().trim().allow("").allow(null).email().lowercase().max(70);
}

export function CorrectPhoneNumber(): any {
    return Joi.string()
        .trim()
        .allow("").allow(null)
        .min(7)
        .max(10)
        .regex(/^([0-9])+$/)
        ;
}

export function RequiredCorrectPhoneNumber(): any {
    return Joi.string()
        .trim()
        .min(7)
        .max(10)
        .regex(/^([0-9])+$/)
        .required()
        ;
}

export function RequiredNumberRange(min: number, max: number): any {
    return Joi.number()
        .min(min)
        .max(max)
        .required()
        ;
}

export function RequiredStringRange(min: number, max: number): any {
    return Joi.string()
        .trim()
        .min(min)
        .max(max)
        .required()
        ;
}

export function StringRange(min: number, max: number): any {
    return Joi.string()
        .trim()
        .allow("").allow(null)
        .min(min)
        .max(max)
        ;
}

export function RequiredStringNumberRange(min: number, max: number): any {
    return Joi.string()
        .trim()
        .min(min)
        .max(max)
        .regex(/^([0-9])+$/)
        .required()
        ;
}

export function StringNumberRange(min: number, max: number): any {
    return Joi.string()
        .trim()
        .allow("").allow(null)
        .min(min)
        .max(max)
        .regex(/^([0-9])+$/)
        ;
}

export function StringNumberRangeNotEmpty(min: number, max: number): any {
    return Joi.string()
        .trim()
        .allow(null)
        .min(min)
        .max(max)
        .regex(/^([0-9])+$/)
        ;
}

export function StringNumber(): any {
    return Joi.string()
        .trim()
        .allow("").allow(null)
        .regex(/^([0-9])+$/)
        ;
}

export function NumberRange(min: number, max: number): any {
    return Joi.number()
        .min(min)
        .max(max)
        .required()
        ;
}

export function RequiredDate(): any {
    return Joi.date()
        .iso()
        .required()
        
}

export function OptionalDate(): any {
    return Joi.date()
        .iso()
        
}

export function CorrectStartDate(): any {
    return Joi.date()
        .iso()
        .allow("").allow(null)
        ;
}

export function CorrectEndDate(): any {
    return Joi.date()
        .iso()
        // .greater(Joi.ref("tStart"))
        .allow("").allow(null)
        ;
}

export const Filters = {
    sSearch: Joi.string().lowercase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").allow("").allow(null).error(new Error("Filters sSearch")),
    iPageNumber: Joi.number()
        .min(1)
        .allow()
        .error(new Error("Filters iPageNumber")),
    iItemsPerPage: Joi.number()
        .allow("").allow(null)
        .min(1)
        .error(new Error("Filters iItemsPerPage")),
};

export const LanguageParams: object = {
    sLang: Joi.string().required().error(new Error("sLang Translations"))
}

export function JoiObjectKeys(oKeys: any) {
    return Joi.object().keys(oKeys)
}
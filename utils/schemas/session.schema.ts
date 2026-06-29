import Joi from "joi";
import * as Validations from "../middlewares/validations"

export const LoginBody = Joi.object({
    Email: Validations.RequiredCorrectEmail().messages({

        'string.base':
            'Email must be a text value.',

        'string.empty':
            'Email is required.',

        'string.email':
            'Please enter a valid email.',

        'string.max':
            'Email must contain a maximum of 70 characters.',

        'any.required':
            'Email is required.'
    }),
    Password: Validations.CorrectPassword().messages({

        'string.base':
            'Password must be a text value.',

        'string.empty':
            'Password is required.',

        'string.min':
            'Password must contain at least 6 characters.',

        'string.max':
            'Password exceeds the maximum allowed length.',

        'string.pattern.base':
            'Password contains invalid characters.',

        'any.required':
            'Password is required.'
    })
})
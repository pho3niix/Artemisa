import {
    NextApiRequest,
    NextApiResponse
} from 'next';

import { ObjectSchema } from 'joi';

import CustomError from '../CustomError';

type Handler = (
    req: NextApiRequest,
    res: NextApiResponse,
    body?: any
) => Promise<any>;

type MethodConfig = {
    schema?: ObjectSchema;
    handler: Handler;
};

type ApiMethods = {
    GET?: MethodConfig;
    POST?: MethodConfig;
    PUT?: MethodConfig;
    PATCH?: MethodConfig;
    DELETE?: MethodConfig;
};

export default function apiHandler(
    methods: ApiMethods
) {

    return async (
        req: NextApiRequest,
        res: NextApiResponse
    ) => {

        try {

            const method =
                req.method as keyof ApiMethods;

            const methodConfig =
                methods[method];

            if (!methodConfig) {

                throw new CustomError(
                    405,
                    'Method not allowed.'
                );
            }

            let validatedBody = req.body;

            // Validate schema
            if (methodConfig.schema) {

                validatedBody =
                    await methodConfig.schema.validateAsync(
                        req.body,
                        {
                            abortEarly: false,
                            stripUnknown: true
                        }
                    );
            }

            return await methodConfig.handler(
                req,
                res,
                validatedBody
            );

        } catch (error: any) {

            // Joi validation
            if (error.isJoi) {

                return res.status(400).json({
                    message: 'Validation error.',
                    statusCode: 400,
                    errors: error.details.map(
                        (detail: any) => ({
                            field: detail.path.join('.'),
                            message: detail.message
                        })
                    )
                });
            }

            // Custom errors
            if (error instanceof CustomError) {

                return res.status(error.statusCode).json({
                    message: error.message,
                    statusCode: error.statusCode,
                    errors: []
                });
            }

            // Unknown errors
            console.error(error);

            return res.status(500).json({
                message: 'Internal server error.',
                statusCode: 500,
                errors: []
            });
        }
    };
}
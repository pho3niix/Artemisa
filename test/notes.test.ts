import { createMocks, createResponse } from 'node-mocks-http';
import HandleNotes from '../pages/api/notes/index';

// especificar el método usado en la ruta (POST, GET, PUT, PATCH, DELETE) -> Ruta - método - módulo

describe('/api/notes Create Note - Red Scenarios', () => {
    test('Should return error when Title received an empty value', async () => {
        const Params = {
            Title: '',
            Description: 'Hello from the testing side.'
        }

        const { req, res } = createMocks({
            method: 'POST',
            body: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(409)

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 409,
            message: 'Validation error: Please, input a correct title. Make sure that length is no longer than 60 characters.'
        })
    })

    test('Should return error when Description received an empty value', async () => {
        const Params = {
            Title: 'Hello from the testing side',
            Description: ''
        }

        const { req, res } = createMocks({
            method: 'POST',
            body: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(409)

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 409,
            message: 'Validation error: Please, input a correct description. Make sure that length is no longer than 255 characters.'
        })
    })

    test('Should return error when Title received an null value', async () => {
        const Params = {
            Title: null,
            Description: 'Hello from the testing side.'
        }

        const { req, res } = createMocks({
            method: 'POST',
            body: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(409)

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 409,
            message: 'notNull Violation: Please, input a title for note.'
        })
    })

    test('Should return error when Description received an null value', async () => {
        const Params = {
            Title: 'Hello from the testing side',
            Description: null
        }

        const { req, res } = createMocks({
            method: 'POST',
            body: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(409)

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 409,
            message: 'notNull Violation: Please, input a description for note.'
        })
    })

    test('Should return error when Description and Title received a null value', async () => {
        const Params = {
            Title: null,
            Description: null
        }

        const { req, res } = createMocks({
            method: 'POST',
            body: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(409)

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 409,
            message: 'notNull Violation: Please, input a title for note.,\n' +
                'notNull Violation: Please, input a description for note.'
        })
    })

    test('Should return error when Description and Title received an empty value', async () => {
        const Params = {
            Title: '',
            Description: ''
        }

        const { req, res } = createMocks({
            method: 'POST',
            body: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(409)

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 409,
            message: 'Validation error: Please, input a correct title. Make sure that length is no longer than 60 characters.,\n' +
                'Validation error: Please, input a correct description. Make sure that length is no longer than 255 characters.'
        })
    })

    // agregar caso para limites de caracteres titulo

    // agregar caso para limites de caracteres descripcion
})

describe('/api/notes Get list - Red Scenarios', () => {
    test('Should return an error when pass a string parameter as page number.', async () => {
        const Params = {
            PageNumber: 'n',
            ItemsPerPage: 10
        }

        const { req, res } = createMocks({
            method: 'GET',
            query: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(400);

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 400,
            message: 'The page number must be a number greater than 0.'
        });
    })

    test('Should return an error when pass a string parameter as items per page', async () => {
        const Params = {
            PageNumber: 1,
            ItemsPerPage: 'x'
        }

        const { req, res } = createMocks({
            method: 'GET',
            query: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(400);

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 400,
            message: 'The items per page number must be a number greater than 0.'
        })
    })

    test('Should return an error when pass a page number greater than total pages', async () => {
        const Params = {
            PageNumber: 100000,
            ItemsPerPage: 10
        }

        const { req, res } = createMocks({
            method: 'GET',
            query: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(400)

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 400,
            message: 'The page number entered exceeds the total number of pages.'
        })
    })
})

describe('/api/notes Get Detail - Red Scenarios', () => {
    test('Should return error when pass invalid UUID parameter', async () => {
        const Params = {
            NoteId: '1'
        }

        const { req, res } = createMocks({
            method: 'GET',
            query: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(409);

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 409,
            message: 'invalid input syntax for type uuid: "1"'
        })
    })

    test('Should return error when specific Note id does not exists', async () => {
        const Params = {
            // Reemplazar por un UUID falso por ejemplo, solo número y guiones
            NoteId: '460c3764-d456-47c2-b980-4c6cb9cb3c8e'
        }

        const { req, res } = createMocks({
            method: 'GET',
            query: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(404);

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 404,
            message: 'The specific note does not exists.'
        })
    })

    test('Should return error when pass empty value as UUID', async () => {
        // Evaluar cuando está vacío o cuando tiene un espacio en blanco
        const Params = {
            NoteId: ''
        }

        const { req, res } = createMocks({
            method: 'GET',
            query: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(409);

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 409,
            message: 'Please, input an UUID value for Note Id.'
        })
    })
})

describe('/api/notes Update notes - Red Scenarios', () => {
    test('Should return error when pass invalid UUID parameter', async () => {
        const Params = {
            NoteId: '1'
        };

        const { req, res } = createMocks({
            method: 'PUT',
            query: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(409)

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 409,
            message: 'invalid input syntax for type uuid: "1"'
        })
    })

    test('Should return error when pass null Note id value', async () => {
        const Params = {
            NoteId: null
        };

        const { req, res } = createMocks({
            method: 'PUT',
            query: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(409)

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 409,
            message: 'Please, input an UUID value for Note Id.'
        })
    })

    test('Should return error when Note id does not exists', async () => {
        const Params = {
            NoteId: 'eb068267-db97-4db4-9f2f-caa0c15d5fc1'
        };

        const { req, res } = createMocks({
            method: 'PUT',
            query: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(404)

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 404,
            message: 'The specific note does not exists.'
        })
    })

    test('Should return error when pass empty title', async () => {
        const FindLastOneParams = createMocks({
            method: 'GET',
            query: {
                PageNumber: 1,
                ItemsPerPage: 1
            }
        })

        await HandleNotes(FindLastOneParams.req, FindLastOneParams.res);

        const FindLastOne = JSON.parse(FindLastOneParams.res._getData({})).results[0];

        if (FindLastOne) {
            const Params = {
                NoteId: FindLastOne.NoteId
            }

            const { req, res } = createMocks({
                method: 'PUT',
                query: Params,
                body: {
                    Title: '',
                    Description: 'I modified description from auto testing'
                }
            });

            await HandleNotes(req, res);

            expect(res.statusCode).toBe(409)

            const Response = JSON.parse(res._getData({}))

            expect(Response).toStrictEqual({
                name: 'CustomError',
                statusCode: 409,
                message: 'Validation error: Please, input a correct title. Make sure that length is no longer than 60 characters.'
            })
        }
    })

    test('Should return error when pass empty description', async () => {
        const FindLastOneParams = createMocks({
            method: 'GET',
            query: {
                PageNumber: 1,
                ItemsPerPage: 1
            }
        })

        await HandleNotes(FindLastOneParams.req, FindLastOneParams.res);

        const FindLastOne = JSON.parse(FindLastOneParams.res._getData({})).results[0];

        if (FindLastOne) {
            const Params = {
                NoteId: FindLastOne.NoteId
            }

            const { req, res } = createMocks({
                method: 'PUT',
                query: Params,
                body: {
                    Title: 'I modified description from auto testing.',
                    Description: ''
                }
            });

            await HandleNotes(req, res);

            expect(res.statusCode).toBe(409)

            const Response = JSON.parse(res._getData({}))

            expect(Response).toStrictEqual({
                name: 'CustomError',
                statusCode: 409,
                message: 'Validation error: Please, input a correct description. Make sure that length is no longer than 255 characters.'
            })
        }
    })

    test('Should return error when pass null title', async () => {
        const FindLastOneParams = createMocks({
            method: 'GET',
            query: {
                PageNumber: 1,
                ItemsPerPage: 1
            }
        })

        await HandleNotes(FindLastOneParams.req, FindLastOneParams.res);

        const FindLastOne = JSON.parse(FindLastOneParams.res._getData({})).results[0];

        if (FindLastOne) {
            const Params = {
                NoteId: FindLastOne.NoteId
            }

            const { req, res } = createMocks({
                method: 'PUT',
                query: Params,
                body: {
                    Title: null,
                    Description: 'I modified description from auto testing'
                }
            });

            await HandleNotes(req, res);

            expect(res.statusCode).toBe(409)

            const Response = JSON.parse(res._getData({}))

            expect(Response).toStrictEqual({
                name: 'CustomError',
                statusCode: 409,
                message: 'notNull Violation: Please, input a title for note.'
            })
        }
    })

    test('Should return error when pass null description', async () => {
        const FindLastOneParams = createMocks({
            method: 'GET',
            query: {
                PageNumber: 1,
                ItemsPerPage: 1
            }
        })

        await HandleNotes(FindLastOneParams.req, FindLastOneParams.res);

        const FindLastOne = JSON.parse(FindLastOneParams.res._getData({})).results[0];

        if (FindLastOne) {
            const Params = {
                NoteId: FindLastOne.NoteId
            }

            const { req, res } = createMocks({
                method: 'PUT',
                query: Params,
                body: {
                    Title: 'I modified description from auto testing.',
                    Description: null
                }
            });

            await HandleNotes(req, res);

            expect(res.statusCode).toBe(409)

            const Response = JSON.parse(res._getData({}))

            expect(Response).toStrictEqual({
                name: 'CustomError',
                statusCode: 409,
                message: 'notNull Violation: Please, input a description for note.'
            })
        }
    })

    test('Should return error when pass empty title and description ', async () => {
        const FindLastOneParams = createMocks({
            method: 'GET',
            query: {
                PageNumber: 1,
                ItemsPerPage: 1
            }
        })

        await HandleNotes(FindLastOneParams.req, FindLastOneParams.res);

        const FindLastOne = JSON.parse(FindLastOneParams.res._getData({})).results[0];

        if (FindLastOne) {
            const Params = {
                NoteId: FindLastOne.NoteId
            }

            const { req, res } = createMocks({
                method: 'PUT',
                query: Params,
                body: {
                    Title: '',
                    Description: ''
                }
            });

            await HandleNotes(req, res);

            expect(res.statusCode).toBe(409)

            const Response = JSON.parse(res._getData({}))

            expect(Response).toStrictEqual({
                name: 'CustomError',
                statusCode: 409,
                message: 'Validation error: Please, input a correct title. Make sure that length is no longer than 60 characters.,\n' +
                    'Validation error: Please, input a correct description. Make sure that length is no longer than 255 characters.'
            })
        }
    })

    test('Should return error when pass null title and description ', async () => {
        const FindLastOneParams = createMocks({
            method: 'GET',
            query: {
                PageNumber: 1,
                ItemsPerPage: 1
            }
        })

        await HandleNotes(FindLastOneParams.req, FindLastOneParams.res);

        const FindLastOne = JSON.parse(FindLastOneParams.res._getData({})).results[0];

        if (FindLastOne) {
            const Params = {
                NoteId: FindLastOne.NoteId
            }

            const { req, res } = createMocks({
                method: 'PUT',
                query: Params,
                body: {
                    Title: null,
                    Description: null
                }
            });

            await HandleNotes(req, res);

            expect(res.statusCode).toBe(409)

            const Response = JSON.parse(res._getData({}))

            expect(Response).toStrictEqual({
                name: 'CustomError',
                statusCode: 409,
                message: 'notNull Violation: Please, input a title for note.,\n' +
                    'notNull Violation: Please, input a description for note.'
            })
        }
    })
})

describe('/api/notes Delete notes - Red Scenarios', () => {
    test('Should return error when pass invalid UUID parameter', async () => {
        const Params = {
            NoteId: '1'
        };

        const { req, res } = createMocks({
            method: 'DELETE',
            query: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(409)

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 409,
            message: 'invalid input syntax for type uuid: "1"'
        })
    })

    test('Should return error when pass null Note id value', async () => {
        const Params = {
            NoteId: null
        };

        const { req, res } = createMocks({
            method: 'DELETE',
            query: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(409)

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 409,
            message: 'Please, input an UUID value for Note Id.'
        })
    })

    test('Should return error when Note id does not exists', async () => {
        const Params = {
            NoteId: 'eb068267-db97-4db4-9f2f-caa0c15d5fc1'
        };

        const { req, res } = createMocks({
            method: 'DELETE',
            query: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(404)

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            name: 'CustomError',
            statusCode: 404,
            message: 'The specific note does not exists.'
        })
    })
})

describe('/api/notes Create Note - Green Scenarios', () => {
    test('Should return success when pass correct Title and Description', async () => {
        const Params = {
            Title: 'Hello from auto testing',
            Description: 'This is a note generated by auto testing.'
        }

        const { req, res } = createMocks({
            method: 'POST',
            body: Params
        });

        await HandleNotes(req, res);

        expect(res.statusCode).toBe(200)

        const Response = JSON.parse(res._getData({}))

        expect(JSON.parse(res._getData({}))).toStrictEqual({
            message: 'Note saved successfully.',
            results: Response.results
        })
    })
})

describe('/api/notes Note Detail by id - Green Scenarios', () => {
    test('Should return success when pass correct NoteId or not exists message', async () => {
        const FindLastOneParams = createMocks({
            method: 'GET',
            query: {
                PageNumber: 1,
                ItemsPerPage: 1
            }
        })

        await HandleNotes(FindLastOneParams.req, FindLastOneParams.res);

        const FindLastOne = JSON.parse(FindLastOneParams.res._getData({})).results[0];

        if (FindLastOne) {
            const Params = {
                NoteId: FindLastOne.NoteId
            }

            const { req, res } = createMocks({
                method: 'GET',
                query: Params
            });

            await HandleNotes(req, res);

            expect(res.statusCode).toBe(200)

            const Response = JSON.parse(res._getData({}))

            expect(Response).toStrictEqual({
                message: 'Specific note by id sucessfully displayed.',
                results: Response.results
            })
        }
    })
})

describe('/api/notes Update Note - Green Scenarios', () => {
    test('Should return success when pass correct NoteId or not exists message', async () => {
        const FindLastOneParams = createMocks({
            method: 'GET',
            query: {
                PageNumber: 1,
                ItemsPerPage: 1
            }
        })

        await HandleNotes(FindLastOneParams.req, FindLastOneParams.res);

        const FindLastOne = JSON.parse(FindLastOneParams.res._getData({})).results[0];

        if (FindLastOne) {
            const Body = {
                Title: 'I modified this title from auto testing.',
                Description: 'I modified this description from auto testing.'
            }

            const Params = {
                NoteId: FindLastOne.NoteId
            };

            const { req, res } = createMocks({
                method: 'PUT',
                query: Params,
                body: Body
            });

            await HandleNotes(req, res);

            expect(res.statusCode).toBe(200)

            const Response = JSON.parse(res._getData({}))

            expect(Response).toStrictEqual({
                message: 'Specific note successfully updated.',
                results: Response.results
            })
        }
    })
})

describe('/api/notes Delete Note - Green Scenarios', () => {
    test('Should return success when pass correct NoteId', async () => {
        const FindLastOneParams = createMocks({
            method: 'GET',
            query: {
                PageNumber: 1,
                ItemsPerPage: 1
            }
        })

        await HandleNotes(FindLastOneParams.req, FindLastOneParams.res);

        const FindLastOne = JSON.parse(FindLastOneParams.res._getData({})).results[0];

        if (FindLastOne) {
            const Params = {
                NoteId: FindLastOne.NoteId
            }

            const { req, res } = createMocks({
                method: 'DELETE',
                query: Params
            });

            await HandleNotes(req, res);

            expect(res.statusCode).toBe(200)

            const Response = JSON.parse(res._getData({}))

            expect(Response).toStrictEqual({
                message: 'Specific note successfully deleted.',
                results: Response.results
            })
        }
    })
})
require("dotenv").config();
import { Sequelize } from 'sequelize';
import { Pool } from 'pg';

const Environments = {
    // preproduction: process.env.PG_CONNECTION_ALPHA,
    // production: process.env.PG_CONNECTION_PRODUCTION,
    // testing: process.env.PG_CONNECTION_QA,
    development: process.env.DB_URL_DEV,
    local: process.env.DB_URL,
    // supertest: process.env.PG_CONNECTION_SUPERTEST
};

let sequelize = null;

switch (process.env.ENV) {
    case 'development':
        sequelize = new Sequelize(Environments[process.env.ENV], {
            logging: false,
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false // Permite conectar a AWS RDS sin validar certificado estricto
                }
            }
        });
        break;
    case 'local':
        sequelize = new Sequelize(Environments[process.env.ENV], {
            logging: true,
            dialect: 'postgres'
        });
        break;
}

(async () => {
    try {
        await sequelize.authenticate();
        return console.log('Database is running and ready to work.');
    } catch (error) {
        return console.log('Unable to connect database.');
    }
});

let pool = null;

switch (process.env.ENV) {
    case 'development':
        pool = new Pool({
            connectionString: process.env.DB_URL_DEV,
            ssl: {
                rejectUnauthorized: false
            }
        });
        break;
    case 'local':
        pool = new Pool({
            connectionString: process.env.DB_URL
        });
        break;
}

async function query(text: string) {
    return new Promise(async (resolve, reject) => {
        try {

            console.log('Executing query:', text)

            const Client = await pool.connect();

            await Client.query('set search_path to "public"');

            const Response = await Client.query(text);

            resolve(Response.rows)

            Client.release();
        } catch (error) {
            reject({
                message: error.message,
                error
            });
        }
    })
}

export default {
    query
};

export { sequelize as Database }
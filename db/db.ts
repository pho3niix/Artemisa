require("dotenv").config();
import { Sequelize } from 'sequelize';
import { Pool } from 'pg';

// Connection using Sequelize
const sequelize = new Sequelize(process.env.DB_URL, {
    logging: false,
    dialect: 'postgres'
});

(async () => {
    try {
        await sequelize.authenticate();
        return console.log('Database is running and ready to work.');
    } catch (error) {
        return console.log('Unable to connect database.');
    }
});

// Connection using PG Pool
const pool = new Pool({
    connectionString: process.env.DB_URL
});

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
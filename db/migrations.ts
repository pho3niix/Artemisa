import Db, { Database } from './db';

import Notes from './models/Notes.model';
import Users from './models/User.model';
import Sessions from './models/Sessions.model';

function Migrations() {
    return (async () => {
        await Database.sync({ alter: true });

        await Db.query(`CREATE EXTENSION IF NOT EXISTS unaccent`);

        console.log('Notes', Notes == Database.models.Notes);
        console.log('Users', Users == Database.models.Users);
        console.log('Sessions', Sessions == Database.models.Sessions);

        console.log('Migration completed.')

        return process.exit(0);
    })();
}

export default Migrations();
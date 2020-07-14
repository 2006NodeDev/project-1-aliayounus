import { Pool } from 'pg'

//entrypoint for all of the database files
//build a connection pool

export const connectionPool:Pool = new Pool({

    host: process.env['LB_HOST'],
    user: process.env['LB_USER'],
    password: process.env['LB_PASSWORD'],
    database: process.env['LB_DATABASE'],
    port:5432,
    max:5//maximum number of connections
})

/* host: '34.73.141.171',
    user:'postgres',
    password:'nodedev2006',
    database:'postgres',
    port:5432,
    max:5 */
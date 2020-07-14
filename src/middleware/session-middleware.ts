import session, { SessionOptions } from 'express-session'

const sessionConfig:SessionOptions = {
    secret: 'secret',//this is not what you should do in production
    cookie:{
        secure:false
    },
    resave:false,
    saveUninitialized:false
}



export const sessionMiddleware = session(sessionConfig)//session is a factory function, config is the options

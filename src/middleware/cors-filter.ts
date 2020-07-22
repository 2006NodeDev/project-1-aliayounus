import { Response,Request, NextFunction } from "express";
export function corsFilter (req:Request, res:Response, next:NextFunction){
res.header('Access-Control-Allow-Origin', `${req.headers.origin}`)
res.header('Access-Control-Allow-Headers','Origin, Content-Type, Accept')
res.header('Access-Control-Allow-Credentials', 'true')
res.header('Access-Control-Allow-Methods', 'GET, POST,PATCH,PUT,DELETE')

//purpose of an option request is to figure out what kind of request are
//allowed to made to the 
//we specify the kinds of requests using the headers of the response to the options request
if(req.method === 'Options'){
    res.sendStatus(200)
}
else{
    next()
}
}
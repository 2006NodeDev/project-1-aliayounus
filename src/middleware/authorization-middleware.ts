import { Request, Response, NextFunction } from "express";

// this function is a middleware factory
export function authorizationMiddleware(roles:string[]){// build a middleware function
    return (req:Request, res:Response, next:NextFunction) => {
        let allowed = false
        for(const role of roles){
            if(req.session.user.role === role){
                //we found a matching role, allow them in
                allowed = true
                next()
            }
        }
        if(!allowed){
            
            res.status(401).send('The incoming token has expired! insufficient permission')
        }
    }

}





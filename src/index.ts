import express, { Request, Response, NextFunction } from 'express'
import { loggingMiddleware } from './middleware/logging-middleware'
import { userRouter } from './routers/user-router'
import { sessionMiddleware } from './middleware/session-middleware'
import { BadCredentialsError } from './errors/BadCredentialsError'
import { getUserByUsernameAndPassword } from './daos/user-dao'



const app = express()//we call the express function
//we get a completed application


app.use(express.json())//this is an example of middle ware



app.use(loggingMiddleware)

app.use(sessionMiddleware)



app.use('/users', userRouter)




// an endpoint that unathenticated users can send credentials to to recieve authentication
app.post('/login', async (req:Request, res:Response, next:NextFunction)=>{
  
    let username = req.body.username
    let password = req.body.password
    
    if(!username || !password){
      
        throw new BadCredentialsError()
    } else {
        try{
            let user = await getUserByUsernameAndPassword(username, password)
            req.session.user = user
          
            res.json(user)
        }catch(e){
            next(e)
        }
    }
})




// the error handler we wrote that express redirects top level errors to
app.use((err, req, res, next) => {
    //if it is one of our custom errors
    if (err.statusCode) {
        // use the status code and the message for the response
        res.status(err.statusCode).send(err.message)
    } else {
        
        console.log(err)//log it out for us to debug
        //send a generic error response
        res.status(500).send('Oops, Something went wrong')
    }
})


app.listen(2005, () => {
    console.log('Server has started');
})


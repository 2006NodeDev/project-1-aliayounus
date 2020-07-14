import express, { Request, Response, NextFunction } from 'express'
import { authenticationMiddleware } from '../middleware/authentication-middleware'
import { getAllUsers, getUserById, UpdateUser } from '../daos/user-dao'
import { authorizationMiddleware } from '../middleware/authorization-middleware'
import { UserUserInputError } from '../errors/UserUserInputError'
import { User } from '../models/User'
//import { PoolClient } from 'pg'


export const userRouter = express.Router()

// Middleware
userRouter.use(authenticationMiddleware)


// Get all users
userRouter.get('/', authorizationMiddleware(['Finance-Manager','Admin']), async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        let allUsers = await getAllUsers()
        res.json(allUsers)
    } catch (e) {
        next(e)
    }
})


//get by id
userRouter.get('/:id',authorizationMiddleware(['Finance-Manager']), async (req: Request, res: Response, next: NextFunction) => {
    let { id } = req.params
    if (isNaN(+id)) {
        // send a response telling them they need to give us a number
        res.status(400).send('Id needs to be a number')
    } else {
        try {
            let user = await getUserById(+id)
            res.json(user)
        } catch (e) {

            
            next(e)
        }
    }
})

// //save new
// userRouter.post('/', authorizationMiddleware(['Finance-Manager']), async (req: Request, res: Response, next: NextFunction) => {
//     // get input from the user
//     let { userId,username, password,firstname,lastname, email, role } = req.body//a little old fashioned destructuring
//     //verify that input
//     if (!username || !password || !role) {
//         next(new UserUserInputError)
//     } else {
//         //try  with a function call to the dao layer to try and save the user
//         let newUser: User = {
//             username,
//             password,
//             firstname,
//             lastname,
//             role,
//             userId,
//             email
//         }
//         newUser.email = email || null
//         try {
//             let savedUser = await saveOneUser(newUser)
//             res.json(savedUser)// needs to have the updated userId
//         } catch (e) {
//             next(e)
//         }
//     }


//     //catch with next(e)


// })





//patch user

userRouter.patch('/', authorizationMiddleware(['Admin']), async (req: Request, res: Response, next: NextFunction) => {
    // get input from the user
    let { userId,username, password,firstname,lastname, email, role } = req.body
    //verify that input
    if (!username || !password || !role) {
        next(new UserUserInputError)
    } else {
        
        let UserUpdate: User = {
            username,
            password,
            firstname,
            lastname,
            role,
            userId,
            email
        }
        UserUpdate.email = email || null
        try {
             await UpdateUser(UserUpdate)

            res.send('User info is updated!')// needs to have the updated userId


        } catch (e) {
            next(e)
        }
    }
//

})


//Delete user


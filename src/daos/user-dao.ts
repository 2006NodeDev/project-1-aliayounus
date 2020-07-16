import { PoolClient } from "pg";
import { connectionPool } from ".";
import { UserDTOtoUserConvertor } from "../utils/UserDTO-to-User-convertor";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { User } from "../models/User";
import { AuthFailureError} from '../errors/AuthFailureError'
import { UserUserInputError } from "../errors/UserUserInputError";
//import { roles } from "../models/roles";

// Get All user 
export async function getAllUsers():Promise<User[]> {
    //first thing is declare a client
    let client: PoolClient = newFunction();
    try {
        //get a connection
        client = await connectionPool.connect()
        //send the query
        let results = await client.query(`select u.user_id, u.username , u."password" , u.email ,r.role_id , r."role" from project_1.users u left join project_1.roles r on u."role" = r.role_id;`)
        return results.rows.map(UserDTOtoUserConvertor)//return the rows
    } catch (e) {
        //for unknown error
        console.log(e)
        throw new Error('Unhandled Error Occured')
    } finally {
        //let the connectiopn go back to the pool
        client && client.release()
    }

    function newFunction() {
        let client: PoolClient;
        return client;
    }
}

//Get user by Id
export async function getUserById(id: number):Promise<User> {
    let client: PoolClient
    try {
        //get a connection
        client = await connectionPool.connect()
        //send the query
        
        
        let results = await client.query('Select u."user_id", u ."username", u."password", u."firstname" ,  u."lastname" ,  u."email", r."role_id",   r."role" from project_1.users u join project_1.roles r on u."role" = r."role_id"  where u."user_id"= $1;',[id])

        if(results.rowCount === 0){
            throw new Error('User Not Found')
        }
        return UserDTOtoUserConvertor(results.rows[0])//there should only ever be one row
    } catch (e) {
        if(e.message === 'User Not Found'){
            throw new UserNotFoundError()
        }
        //if we get an error we don't know 
        console.log(e)
        throw new Error('Unhandled Error Occured')
    } finally {
        //let the connectiopn go back to the pool
        client && client.release()
    }
}


//find user by username and password ( login )

export async function getUserByUsernameAndPassword(username:string, password:string):Promise<User>{
    let client: PoolClient
    try {
        //get a connection
        client = await connectionPool.connect()
        //send the query
        let results = await client.query(`select u."user_id", 
                u."username" , 
                u."password" , 
                u."email" ,
                r."role_id" , 
                r."role" 
                from project_1.users u left join project_1.roles r on u."role" = r.role_id 
                where u."username" = $1 and u."password" = $2;`,
            [username, password])
            
        if(results.rowCount === 0){
            throw new Error('User Not Found')
        }
        return UserDTOtoUserConvertor(results.rows[0])//there should only ever be one row
    } catch (e) {
        if(e.message === 'User Not Found'){
            throw new AuthFailureError()
        }
        //if we get an error we don't know 
        console.log(e)
        throw new Error('Unhandled Error Occured')
    } finally {
        //let the connectiopn go back to the pool
        client && client.release()
    }
}


 // save one user
export async function saveOneUser(newUser:User):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        client.query('BEGIN;')//start a transaction
        // if you have multiple querys, you should make a transaction
        // await client.query('BEGIN;')//start a transaction
        // let roleId = await client.query(`select r."role_id" from project_1.roles r where r."role" = $1`, [newUser.role])
        // if(roleId.rowCount === 0){
        //     throw new Error('Role Not Found')
        // }

    //    roleId = roleId.rows[0].role_id
        let results = await client.query(`insert into project_1.users ("user_id","username", "password","firstname","lastname","email","role")
                                            values($1,$2,$3,$4,$5,$6,$7) returning "user_id" `,//allows you to return some values from the rows in an insert, update or delete
                                            [newUser.userId,newUser.username, newUser.password,newUser.firstname,newUser.lastname, newUser.email, newUser.role])
        newUser.userId = results.rows[0].user_id
        await client.query('COMMIT;')//ends transaction
        return newUser

    }catch(e){
        client && client.query('ROLLBACK;')//if a js error takes place, undo the sql
        if(e.message === 'Role Not Found'){
            throw new UserUserInputError()// role not found error
        }
        //if we get an error we don't know 
        console.log(e)
        throw new Error('Unhandled Error Occured')
    }finally{
        client && client.release();
    }
}







// **************************************updating a user in the database PATCH

export async function UpdateUser(UserUpdate: User) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        client.query('BEGIN');

        await client.query('update project_1.users set username = $1, password = $2, firstname = $3, lastname = $4, email = $5, role=$6 where user_id = $7',
            [UserUpdate.username, UserUpdate.password, UserUpdate.firstname, UserUpdate.lastname, UserUpdate.email, UserUpdate.role, UserUpdate.userId]);
        

    
        client.query('COMMIT');
    } catch (e) {
        client.query('ROLLBACK');
        throw {
            status: 500,
            message: 'Internal Server Error'
        };
    } finally {
        client && client.release();
    }
}

   
// Delete user by Id

//Get user by Id
export async function deleteUserById(id: number):Promise<User> {
    let client: PoolClient
    try {
        //get a connection
        client = await connectionPool.connect()
        //send the query
        
        
        //let results = await client.query('Delete from  project_1.users u where u."user_id"= $1;',[id])
        
        let results = await client.query('Delete from  project_1.users u where u."user_id"= $1;',[id])


        if(results.rowCount === 0){
            throw new Error('User Not Found')
        }
        return UserDTOtoUserConvertor(results.rows[0])//there should only ever be one row
    } catch (e) {
        if(e.message === 'User Not Found'){
            throw new UserNotFoundError()
        }
        //if we get an error we don't know 
        console.log(e)
        throw new Error('Unhandled Error Occured')
    } finally {
        //let the connectiopn go back to the pool
        client && client.release()
    }
}








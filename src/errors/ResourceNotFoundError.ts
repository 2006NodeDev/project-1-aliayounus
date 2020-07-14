// Resource doesn't exist.

import { HttpError } from "../errors/HttpError"

export class ResourceNotFoundError extends HttpError{
    constructor(){
        super(404, 'Resource Does Not Exist')
    }
}
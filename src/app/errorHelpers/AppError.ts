class AppError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string, stack = "") {
        super(message) // this is like throw new Error("..."). this part is done inside super. 

        // now lets set the statuscode with the coming error
        this.statusCode = statusCode //this is coming from parameter and this.statusCode is from the class object

        // this stack is coming from parameter 
        if (stack) {
            this.stack = stack // this.stack coming from Error 
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default AppError
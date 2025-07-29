import { TGenericErrorResponse } from "../interfaces/error.types"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleDuplicateError = (err: any): TGenericErrorResponse => {
    const matchedArray = err.message.match(/"([^"]*)"/)
    const duplicateValue = matchedArray?.[1] || "Field"

    return {
        statusCode: 400,
        message: `${duplicateValue} already exists!!`
    }
}

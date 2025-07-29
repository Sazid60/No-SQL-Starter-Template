/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';
import { envVars } from './env';
import AppError from '../errorHelpers/AppError';

import stream from "stream"
import { UploadApiResponse } from 'cloudinary';


cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
})

// cloudinary.v2.uploader.upload(file, options).then(callback);
// this is the system of cloudinary but we will do it using a package.
// this package will take the file and will do the work and will return the url inside the req.file object 

export const deleteImageFromCloudinary = async (url: string) => {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
        const match = url.match(regex);

        console.log({ match })
        if (match && match[1]) {
            const public_id = match[1];
            await cloudinary.uploader.destroy(public_id)
            console.log(`File ${public_id} is deleted from cloudinary`);
        }
    } catch (error: any) {
        throw new AppError(401, "Cloudinary image deletion failed", error.message)
    }
}
// This function converts your Buffer into a stream and uploads it.
export const uploadBufferToCloudinary = async (buffer: Buffer, fileName: string) : Promise<UploadApiResponse | undefined>  => {
    // It returns a Promise that will eventually resolve to "Hello".

    try {
        // cloudinary upload function doesn’t return a Promise, so you must manually wrap it

        return new Promise((resolve, reject) => {
            const public_id = `pdf/${fileName}-${Date.now()}`


            // converting the buffer in stream 
            const bufferStream = new stream.PassThrough()
            // PassThrough is a special Node.js stream that lets you push a Buffer and treat it as a readable stream.
            bufferStream.end(buffer)

            // Writes the last chunk of data (buffer) to the stream.


            // template cloudinary.uploader.upload_stream(options, callback)

            cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    public_id: public_id,
                    folder: "pdf"
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result)
                }
            ).end(buffer)
            // You immediately .end(buffer) → This writes the entire buffer to that stream.
            // .end(buffer) Writes your entire buffer to the Cloudinary stream.
            // Closes the stream so Cloudinary can finish uploading.



        })
    } catch (error: any) {
        console.log(error);
        throw new AppError(401, `Error uploading file ${error.message}`)
    }
}
export const cloudinaryUpload = cloudinary
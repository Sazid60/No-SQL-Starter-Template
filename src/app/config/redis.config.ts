/* eslint-disable no-console */
import { createClient } from 'redis';
import { envVars } from './env';

export const redisClient = createClient({
    username: envVars.REDIS_USERNAME,
    password: envVars.REDIS_PASSWORD,
    socket: {
        host: envVars.REDIS_HOST,
        port: Number(envVars.REDIS_PORT)
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

//     await redisClient.connect();
//     await redisClient.set('foo', 'bar');
//     const result = await redisClient.get('foo');
//     console.log(result)  // >>> bar

//  we will connect the redis inside the server 
export const connectRedis = async () => {
    //  we have not used try catch because already redis handled the error by using redisClient.on('error', err => console.log('Redis Client Error', err));
    if (!redisClient.isOpen) { // used this because if once connected there is no need to connect redis again 
        await redisClient.connect();
        console.log("Redis Connected !")
    }

    // await redisClient.set('foo', 'bar');
    // const result = await redisClient.get('foo');
    // console.log(result)  // >>> bar
}
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from 'bcryptjs';





passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        async (email: string, password: string, done) => {
            try {
                const isUserExist = await User.findOne({ email })
                if (!isUserExist) {
                    return done("User Not Found")
                }

                if (!isUserExist.isVerified) {
                    return done(`User Is Not Verified`)
                }


                if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
                    return done(`User Is ${isUserExist.isActive}`)
                }
                if (isUserExist.isDeleted) {
                    return done(`User Is Deleted`)
                }
                const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider == "google")

                if (isGoogleAuthenticated && !isUserExist.password) {
                    return done(null, false, { message: "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password." })
                }

                const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)

                if (!isPasswordMatch) {
                    return done(null, false, { message: "Password Does Not Match" })
                }

                return done(null, isUserExist)

            } catch (error) {
                console.log(error)
                return done(error) 
            }
        }
    )
)

passport.use(
    new GoogleStrategy(
        {
            // options
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL
        }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            // verify
            try {

                const email = profile.emails?.[0].value
                if (!email) {
                    return done(null, false, { message: "No Email Found !" }) 
                }

                let isUserExist = await User.findOne({ email })
                if (isUserExist && !isUserExist.isVerified) {
                    return done(null, false, { message: "User is not verified" })
                }

                if (isUserExist && (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE)) {
                    done(`User is ${isUserExist.isActive}`)
                }

                if (isUserExist && isUserExist.isDeleted) {
                    return done(null, false, { message: "User is deleted" })
                }

                if (!isUserExist) {
                    isUserExist = await User.create(
                        {
                            email,
                            name: profile.displayName,
                            picture: profile.photos?.[0].value,
                            role: Role.RIDER,
                            isVerified: true,
                            auths: [
                                {
                                    provider: "google",
                                    providerId: profile.id
                                }
                            ]
                        }
                    )
                }

                return done(null, isUserExist) 

            } catch (error) {
                console.log("Google Strategy Error", error)

                return done(error)
            }
        }
    ))



passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch (error) {
        console.log(error);
        done(error)
    }
})
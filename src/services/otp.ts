import otpGenerator from 'otp-generator';
import { Otp } from '../models';
import * as argon from 'argon2';
import { BadRequestError, ServerError } from '../errors';

interface OtpProps {
    email?: string;
    phone_number?: string;
    user_otp?: string | any;
}
export class OtpClass {

    static async generateOtp({ email, phone_number }: OtpProps) {
        try {
            const OTP = otpGenerator.generate(4, {
                digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
            })

            let otp;
            let otpHolder;
            let lastOtp;
            // hash otp
            const hashedOtp = await argon.hash(OTP)
            if (phone_number) {
                otpHolder = await Otp.find({ phone_number })
                lastOtp = otpHolder[otpHolder.length - 1]
                // if (otpHolder) {
                //     for (const otp of otpHolder) {
                //         await otp.remove()
                //     }
                // }
                if (!otpHolder.length) {
                    otp = Otp.build({
                        phone_number,
                        otp: hashedOtp
                    })
                }

            } else {
                otpHolder = await Otp.find({ email })
                lastOtp = otpHolder[otpHolder.length - 1]

                if (!otpHolder.length) {
                    otp = Otp.build({
                        email,
                        otp: hashedOtp
                    })
                }

            }

            if (otp) {
                await otp.save()
                return OTP
            } else {
                return null;
            }

        } catch (error) {
            console.log(error, "ERROR HERE")

            throw new ServerError()
        }
    }

    static async resendOtp({ email, phone_number }: OtpProps) {
        try {
            let otpHolder;
            if (phone_number) {
                otpHolder = await Otp.find({ phone_number })

            } else {
                otpHolder = await Otp.find({ email })

            }

            if (otpHolder) {
                for (const otp of otpHolder) {
                    await otp.remove()
                }
            }
            const OTP = otpGenerator.generate(4, {
                digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
            })

            let otp;

            // hash otp
            const hashedOtp = await argon.hash(OTP)
            if (phone_number) {
                otp = Otp.build({
                    phone_number,
                    otp: hashedOtp
                })
            } else {
                otp = Otp.build({
                    email,
                    otp: hashedOtp
                })
            }


            await otp.save()

            return OTP
        } catch (error) {
            console.log(error)
            throw new ServerError()
        }
    }


    static async verifyOtp({ email, phone_number, user_otp }: OtpProps) {
        let otpHolder;
        if (phone_number) {
            otpHolder = await Otp.find({ phone_number })

        } else {
            otpHolder = await Otp.find({ email })

        }

        if (!otpHolder || otpHolder.length === 0) {
            throw new BadRequestError("Invalid Code")
        }
        const otp = otpHolder[otpHolder.length - 1]


        const validOtp = await argon.verify(otp.otp, user_otp)

        if (!validOtp) {
            throw new BadRequestError("Invalid Code!")
        }
        await otp.remove()

        return true
    }
}
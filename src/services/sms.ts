import axios from "axios";
import { config } from "dotenv";
import { ServerError } from "../errors";

interface SMSProps {
    message: string;
    phone_number: string
}

if (!process.env.INFOBIP_API_KEY) {
    throw new Error('INFOBIP_API_KEY must be defined')
}
export const sendSMS = async ({ message, phone_number }: SMSProps) => {
    try {
        axios.defaults.headers['Authorization'] = `App ${process.env.INFOBIP_API_KEY}`
        await axios.post('https://2kq2mw.api.infobip.com/sms/2/text/advanced', {
            "messages": [
                {
                    "destinations": [

                        {
                            "messageId": new Date().toISOString(),
                            "to": `+234${phone_number.slice(1)}`
                        }

                    ],
                    "From": "Wegeda",
                    "intermediateReport": true,
                    "text": message
                }
            ]
        })

        return true
    } catch (error) {
        throw new ServerError()
    }
}
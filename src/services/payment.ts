import axios, { AxiosInstance } from "axios";
import { ServerError } from "../errors";

interface PaystackInput {

}

export class Payment {
    public client: AxiosInstance;
    baseUrl = 'https://api.paystack.co'
    constructor() {
        if (!process.env.PAYSTACK_SECRET_KEY) {
            throw new Error('PAYSTACK SECRET KEY must be defined')
        }

        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                common: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        });

    }
    public async initializePaystack(data: any) {
        try {
            const response = await this.client.post(
                "/transaction/initialize",
                data
            );
            // console.log("post Reesponse...", response.data)
            return response.data;
        } catch (error) {
            console.log(error, "ERROR")
            throw new ServerError('An Error Occuurred');
        }

    }

    public async verifyPayment(reference: string) {
        try {
            const response = await this.client(`/transaction/verify/${reference}`);
            return response.data
        } catch (error) {
            console.log(error, "ERROR")
            throw new ServerError('An Error Occuurred');

        }
    }
}
export interface IResponse {
    error: { code: number, message: string },

    user: {
        _id: string,
        name: String,
        type: String,
        period: Number,
        quantity: Number
    }
}
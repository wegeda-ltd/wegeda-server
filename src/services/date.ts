interface ExpireProps {
    duration: number;
    created_at: Date
}

export class DateClass {

    static get_expiry_date({ duration, created_at }: ExpireProps) {
        const date = new Date(created_at)

        const expiry_date = new Date(date.setMonth(date.getMonth() + duration))

        return expiry_date.toISOString()
    }

    static has_expired({ duration, created_at }: ExpireProps) {
        const created_date = new Date(created_at)

        const current_date = new Date()

        if (new Date(created_date) > current_date) {
            return false
        }
        else {
            return true
        }
    }
}
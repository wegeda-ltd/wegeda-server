interface SubscriptionProps {
    amount_left: number
}

export class SubscriptionClass {
    static reduce_amount_left({ amount_left }: SubscriptionProps) {
        return amount_left - 1
    }

}
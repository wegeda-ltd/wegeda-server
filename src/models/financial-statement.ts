import { Model, Schema, model, Document, PaginateModel } from "mongoose";
import paginate from 'mongoose-paginate-v2';

interface FinancialStatementAttrs {
    user: string;
    financial_statements: string[]
}

interface FinancialStatementDoc extends Document {
    user: string;
    financial_statements: string[]
}

interface FinancialStatementModel extends PaginateModel<FinancialStatementDoc> {
    build(attrs: FinancialStatementAttrs): FinancialStatementDoc;
}

const financialStatementSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    financial_statements: [
        {
            type: String
        }
    ]

}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    },
    timestamps: true
})

financialStatementSchema.statics.build = (attrs: FinancialStatementAttrs) => {
    return new FinancialStatement(attrs);
}

financialStatementSchema.plugin(paginate)

const FinancialStatement = model<FinancialStatementDoc, FinancialStatementModel>('Financial-Statement', financialStatementSchema)

export { FinancialStatement, FinancialStatementDoc }

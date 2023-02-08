import { Schema, model, Types } from "mongoose";

const brandSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Brand name is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 20 char'],
        trim:true
    },
    slug:String,
    image: {
        type: String,
        required: [true, 'brand image is required'],
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"User",
        required: [true, 'createdBy is required'],

    },
    public_id: String

}, {
    timestamps: true
})


const brandModel = model('Brand', brandSchema)
export default brandModel
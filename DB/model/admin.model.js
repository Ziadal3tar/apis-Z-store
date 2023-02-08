import { Schema, model, Types } from "mongoose";

const adminSchema = new Schema({
    adminId: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, "admin id is required"],
      },
}, {
    timestamps: true
})


const adminModel = model('admin', adminSchema);
export default adminModel
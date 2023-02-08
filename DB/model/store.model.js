import { Schema, model, Types } from "mongoose";

const storesSchema = new Schema({

    name: { required: true, type: String },
    storeImage: {
        type: String,
        default:'https://res.cloudinary.com/dqaf8jxn5/image/upload/v1673275524/1624304_pxkrmm.png'

    },
    storeImageId: [String],
    backGroundImage: {
        type: String,
        default:'https://res.cloudinary.com/dqaf8jxn5/image/upload/v1674919917/3969_f6buq4.jpg'
    },
    backGroundImageId: [String],
     createdBy: {
        type: Types.ObjectId,
        ref: "User"
    },
    storeProduct: [{
        type: Types.ObjectId,
        ref: "Product",
    }],
    title: { type: String },
    color: { type: String },

    followers: [
        {
            type: Types.ObjectId,
            ref: "User",
        },
    ],
    chats: [
        {
          type: Types.ObjectId,
          ref: "Chat",
        },
      ],
    socketID: String,

})
const storesModel = model('Store', storesSchema)
export default storesModel
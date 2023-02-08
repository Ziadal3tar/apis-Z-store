import userModel from '../../../../DB/model/user.model.js'
import { sendEmail } from '../../../services/email.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../../../services/asyncHandler.js';
import { findById, findByIdAndDelete, findOneAndUpdate, findOne, find, findByIdAndUpdate, create, findOneAndDelete } from '../../../../DB/DBMethods.js';
import { paginate } from '../../../services/pagination.js';
import cloudinary from '../../../services/cloudinary.js'
import chatsModel from '../../../../DB/model/chats.model.js';
import messagesModel from '../../../../DB/model/messages.model.js';
import storesModel from '../../../../DB/model/store.model.js';

const populate = [
    {
        path: "sender",
    },
    {
        path: "receiver",
    },

];


export const message = asyncHandler(async (req, res, next) => {
    const { content, senderModel, receiverModel, sender, receiver, storeId, userId } = req.body
    let chat = await findOne({ model: chatsModel, condition: { storeId, userId } })
    if (!chat) {
        const newChat = await create({ model: chatsModel, data: req.body })
        let user = await findByIdAndUpdate({
            model: userModel, condition: userId, data:{ $push: { chats: newChat._id } },
        })
        let store = await findByIdAndUpdate({
            model: storesModel, condition: storeId,  data:{ $push: { chats: newChat._id } } ,
        })
        chat = newChat
    }
    req.body.chatId = chat._id
    const newMessage = await create({ model: messagesModel, data: req.body })
    chat.messages.push(newMessage)
    let updatedChat = await findByIdAndUpdate({ model: chatsModel, condition: chat._id, data: { messages: chat.messages }, options: { new: true } })
    res.status(200).json({ message: "Done", updatedChat })
})



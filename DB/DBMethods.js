import adminModel from "./model/admin.model.js";
import cartModel from "./model/cart.model.js";
import categoryModel from "./model/category.model.js";
import chatsModel from "./model/chats.model.js";
import couponModel from "./model/coupon.model.js";
import messagesModel from "./model/messages.model.js";
import subCategoryModel from "./model/subCategory.model.js";
import userModel from "./model/user.model.js";

// find
export const find = async ({ model, condition, select, limit = 10, skip = 0, populate = [] } = {}) => {
    let data = await model.find(condition).skip(skip).limit(limit).select(select).populate(populate);
    return data;
}

export const findOne = async ({ model, condition, select, populate = [] } = {}) => {
    let data = await model.findOne(condition).select(select).populate(populate);
    return data;
}

export const findById = async ({ model, condition, select, populate = [] } = {}) => {
    let data = await model.findById(condition).select(select).populate(populate);
    return data;
}

export const findByIdAndUpdate = async ({ model, condition = {}, data, options = {} } = {}) => {
    const res = await model.findByIdAndUpdate(condition, data, options)
    return res
}
export const findOneAndUpdate = async ({ model, condition = {}, data, options = {} } = {}) => {
    const res = await model.findOneAndUpdate(condition, data, options)
    return res
}
export const findOneAndDelete = async ({ model, condition = {}, options = {} } = {}) => {
    const res = await model.findOneAndDelete(condition, options)
    return res
}
export const findByIdAndDelete = async ({ model, condition = {} } = {}) => {
    const res = await model.findByIdAndDelete(condition)
    return res
}



// save...insert
export const create = async ({ model, data } = {}) => {
    let newModel = new model(data);
    let res = await newModel.save()
    return res
}
export const insertMany = async ({ model, data = [] } = {}) => {
    let res = await model.insertMany(data)
    return res;
}
// 
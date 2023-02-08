import slugify from "slugify";
import { create, find, findById, findByIdAndDelete, findByIdAndUpdate, findOne } from "../../../../DB/DBMethods.js";
import brandModel from "../../../../DB/model/brand.model.js";
import categoryModel from "../../../../DB/model/category.model.js";
import productModel from "../../../../DB/model/product.model.js";
import storesModel from "../../../../DB/model/store.model.js";
import subCategoryModel from "../../../../DB/model/subCategory.model.js";
import userModel from "../../../../DB/model/user.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";
import cloudinary from "../../../services/cloudinary.js";
import { paginate } from "../../../services/pagination.js";

const populateStoreData = [

    {
        path: "chats",
        populate: [
            { path: "messages",
            populate:[
                {
                    path: "sender",
                },
                {
                    path: "receiver",
                },
            ]
        
        },
            { path: "userId" },
            { path: "storeId" },


        ]
    },
    {
        path: "storeProduct",
        // populate: [
        //     { path: "messages",
        //     populate:[
        //         {
        //             path: "sender",
        //         },
        //         {
        //             path: "receiver",
        //         },
        //     ]
        
        // },
        //     { path: "userId" },
        //     { path: "storeId" },


        // ]
    },

];
export const addStore = asyncHandler(async (req, res, next) => {

    if (req.file) {
        let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: "storesImgs"
        })
        req.body.storeImage = secure_url
        req.body.storeImageId = public_id
    }
    req.body.createdBy = req.user._id
    let store = await find({ model: storesModel, condition: { createdBy: req.user._id } })
    if (store.length==0) {
        const newStore = await create({ model: storesModel, data: req.body })
        if (newStore) {
            let updateUser = await findByIdAndUpdate({ model: userModel,condition:req.user._id, data: { storeId: newStore._id },options:{new:true} })
            res.status(200).json({ message: "added", newStore })
        }
    } else {
        res.status(400).json({ message: "you have a store" })
    }

})
export const editStoreImg = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        next(new Error("you have to upload an image", { cause: 422 }))
    } else {
        let { id } = req.body
        let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: "storesImgs"
        })
        const result = await findByIdAndUpdate({ model: storesModel, condition: id, data: { storeImage: secure_url, storeImageId:public_id } })
        if (!result) {
            await cloudinary.uploader.destroy(public_id)
        } else {
            if (result.public_id) {
                await cloudinary.uploader.destroy(result.storeImageId)
            return res.status(201).json({ message: "Done", result })
            }
            res.status(201).json({ message: "Done", result })
        }
    }
})
export const searchStores = asyncHandler(async (req, res, next) => {

    let allstores = []
    let name = req.body.name

    let _id = req.user._id
    const users = await storesModel.find({})
    for (let i = 0; i < users.length; i++) {
        const element = users[i];
        if (element.name.toLowerCase().includes(name.toLowerCase())) {
            if (element.createdBy != _id) {
                allstores.push(element)
            }
        }
    }
    const unique = [
        ...new Map(allstores.map((m) => [m._id, m])).values(),
    ];
    allstores = unique
    if (allstores == 0) {
        res.status(200).json({ message: "not found", allstores })

    } else {
        res.status(200).json({ message: "users", allstores })

    }
})

export const getStore = asyncHandler(async (req, res, next) => {
    let {id} = req.params
    let store = await findById({model:storesModel,condition:id,populate:[...populateStoreData]})
    if (store) {
        return res.status(200).json({ message: "store", store })
    }
    next(new Error("store not found", { cause: 404 }))
})
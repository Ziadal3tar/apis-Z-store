import userModel from '../../../../DB/model/user.model.js'
import { asyncHandler } from '../../../services/asyncHandler.js';
import { findById, findByIdAndDelete, findOneAndUpdate, findOne, create, find, findByIdAndUpdate } from '../../../../DB/DBMethods.js';
import cloudinary from '../../../services/cloudinary.js'
import categoryModel from '../../../../DB/model/category.model.js';
import subCategoryModel from '../../../../DB/model/subCategory.model.js';
import productModel from '../../../../DB/model/product.model.js';
const populate = [
    {
        path: "createdBy",
        select: ["userName", "email"]

    },
    {
        path: "categoryId",
        select: ["name"]

    },
];

export const addSubCategory = asyncHandler(async (req, res, next) => {
    let { categoryId } = req.params
    let category = await findById({ model: categoryModel, condition: categoryId })
    if (!category) {
        next(new Error("Category not found", { cause: 404 }))
    } else {
        if (!req.file) {
            next(new Error("you have to upload an image", { cause: 422 }))
        } else {
            let { name } = req.body
            let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
                folder: "category/subCategory"
            })
            const result = await create({ model: subCategoryModel, data: { name, image: secure_url, createdBy: req.user._id, public_id, categoryId } })
            res.status(201).json({ message: "created", result })
        }
    }
})

export const UpdateSubCategory = asyncHandler(async (req, res, next) => {

    let { subCategoryId } = req.params

    let subCategory = await findById({ model: subCategoryModel, condition: subCategoryId })
    if (!req.body.name || req.body.name == 'undefined') {
        req.body.name = subCategory.name
    }

    if (!subCategory) {
        return next(new Error("category not found", { cause: 404 }))
    } else {

        if (req.file) {
            let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
                folder: "category/subCategory"
            })
            req.body.image = secure_url
            req.body.public_id = public_id
            await cloudinary.uploader.destroy(subCategory.public_id)
        } else {
            req.body.image = subCategory.image
        }
        let updatedSubCategory = await findByIdAndUpdate({ model: subCategoryModel, condition: subCategoryId, data: req.body, options: { new: true } })
        res.status(200).json({ message: 'SubCategory is updated', updatedSubCategory })
    }

})
export const allSubCategoriesFromCategory = asyncHandler(async (req, res, next) => {
    let categoryId = req.params.id
    let allSubCategories = await find({ model: subCategoryModel })
    if (!allSubCategories) {
        next(new Error("no SubCategories", { cause: 404 }))
    } else {
        allSubCategories = allSubCategories.filter((item) => item.categoryId == categoryId);
        if (allSubCategories.length == 0) {
            next(new Error("no SubCategories", { cause: 404 }))
        } else {
            res.status(200).json({ message: "All Sub Categories", allSubCategories })
        }
    }
})
export const removeSubCategory = async (req, res, next) => {
    const { subCategoryId } = req.params
    let deleteSubCategory = await findByIdAndDelete({ model: subCategoryModel, condition: subCategoryId })
    if (!deleteSubCategory) {
        next(new Error("SubCategory not found", { cause: 404 }))
    } else {
        let products = await find({ model: productModel, condition: { subCategoryId: _id }})
        for (let i = 0; i < products.length; i++) {
            const element = products[i];
            await findByIdAndDelete({model:productModel,condition:element._id})
        }

        let public_id = deleteSubCategory.public_id
        await cloudinary.uploader.destroy(public_id)
        res.status(200).json({ message: "deleted", deleteSubCategory })
    }

}
export const allSubCategory = asyncHandler(async (req, res, next) => {
    const allSubCategories = await find({ model: subCategoryModel, populate: [...populate] })
    if (!allSubCategories) {
        next(new Error("no SubCategories", { cause: 404 }))
    } else {
        res.status(200).json({ message: "All SubCategories", allSubCategories })
    }
})

export const getSubCategory = asyncHandler(async (req, res, next) => {
    let { subCategoryId } = req.params
    let data = await findById({ model: subCategoryModel, condition: subCategoryId })
    if (!data) {
        next(new Error("subCategory not Found", { cause: 404 }))
    } else {
        const cursor = subCategoryModel.findById(subCategoryId).cursor()
        let allData = []
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            let myObj = doc.toObject()
            let category = await categoryModel.findById(myObj.categoryId)
            myObj.categoryId = category
            allData.push(myObj)
        }
        res.status(200).json({ message: "data", allData })
    }
})
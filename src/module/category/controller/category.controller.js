import userModel from '../../../../DB/model/user.model.js'
import { asyncHandler } from '../../../services/asyncHandler.js';
import { findById, findByIdAndDelete, findOneAndUpdate, findOne, create, find, findByIdAndUpdate } from '../../../../DB/DBMethods.js';
import cloudinary from '../../../services/cloudinary.js'
import categoryModel from '../../../../DB/model/category.model.js';
import subCategoryModel from '../../../../DB/model/subCategory.model.js';
import { paginate } from '../../../services/pagination.js';
import productModel from '../../../../DB/model/product.model.js';

const populate = [
    {
      path: "createdBy",
      select: ["userName","email"]
  
    },
  ];

export const addCategory = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        next(new Error("you have to upload an image", { cause: 422 }))
    } else {
        let { name } = req.body
        let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: "category"
        })
        const result = await create({ model: categoryModel, data: { name, image: secure_url, createdBy: req.user._id, public_id } })
        res.status(201).json({ message: "created", result })
    }
})
export const UpdateCategory = asyncHandler(async (req, res, next) => {
    let { _id } = req.params

    let category = await findById({ model: categoryModel, condition: { _id } })
    if (!req.body.name || req.body.name=="undefined"){
        req.body.name = category.name
    }
    
    if (!category) {
        next(new Error("category not found", { cause: 404 }))
    } else {

        if (req.file) {
            let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
                folder: "category"
            })
            req.body.image = secure_url
            req.body.public_id = public_id
            await cloudinary.uploader.destroy(category.public_id)
        }else{
            req.body.image = category.image
        }
        let updatedCategory = await findByIdAndUpdate({ model: categoryModel, condition: { _id }, data: req.body, options: { new: true } })
        res.status(200).json({ message: 'Category is updated', updatedCategory })
    }

})
export const allCategories = asyncHandler(async (req, res, next) => {
    let { limit, skip } = paginate(req.query.page, req.query.size)
    const categories = await find({ model: categoryModel, limit, skip,populate:[...populate] })
    if (!categories) {
        next(new Error("no categories", { cause: 404 }))
    } else {
        res.status(200).json({ message: "All categories", categories })
    }
})
export const removeCategory = async (req, res, next) => {
    const { _id } = req.params
    const category = await findById({ model: categoryModel, condition: { _id } })
    if (category) {
        const deleteCategory = await findByIdAndDelete({ model: categoryModel, condition: { _id } })
        let SubCategories = await find({ model: subCategoryModel, condition: { categoryId: _id }})
        for (let i = 0; i < SubCategories.length; i++) {
            const element = SubCategories[i];
            await findByIdAndDelete({model:subCategoryModel,condition:element._id})
        }
        let products = await find({ model: productModel, condition: { categoryId: _id }})
        for (let i = 0; i < products.length; i++) {
            const element = products[i];
            await findByIdAndDelete({model:productModel,condition:element._id})
        }

        res.json({ message: 'Deleted', deleteCategory })
    } else {
        res.json({ message: 'Category not found' })
    }
}
export const getCategory = asyncHandler(async (req, res, next) => {
let {categoryId} = req.params
    const category = await findById({ model: categoryModel, condition:categoryId })
    if (!category) {
        next(new Error(" category not found", { cause: 404 }))
    } else {
        res.status(200).json({ message: "All categories", category })
    }
})

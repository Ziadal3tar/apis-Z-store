import { Schema, model, Types } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'product name is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 20 char']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'product name is required'],
        min: [20, 'minimum length 20 char'],
        max: [200, 'max length 200 char']
    },
    images: {
        type: [String],
        required: [true, 'product images is required'],
    },
    publicImagesIds: [String],
    stock: {
        type: Number,
        default: 0,
        required: [true, 'Stock images is required'],
    },
    price: {
        type: Number,
        required: [true, 'price is required'],
    },
    discount: {
        type: Number,
    },
    isSpecial: {
        type:Boolean,
    },
    finalPrice: Number,
    colors: {
        type: [String],
        required: [true, 'colors is required'],
    },
    sizes: {
        type: [String],
        default: 'free',
        enums: ["sm", "md", "lg", "xl", "free"]
    },
    gender: {
        type: String,
        enums: ["Male", "Female", "All"]
    },
    categoryId: {
        type: Types.ObjectId,
        ref: "Category",
        required: [true, 'categoryId is required'],
    },
    subCategoryId: {
        type: Types.ObjectId,
        ref: "subCategory",
        required: [true, 'subCategoryId is required'],
    },
    brandId: {
        type: Types.ObjectId,
        ref: "Brand",
        required: [true, 'BrandId is required'],
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, 'createdBy is required'],
    },
    updateBy: {
        type: Types.ObjectId,
        ref: "User",
    },
    totalItems:String,
    soldItems:String,
    storeId: {
        type: Types.ObjectId,
        ref: "Store",
    },
}, {
    timestamps: true
})

productSchema.pre("save", function (next) {
    if (this.discount >= 70) {
        this.isSpecial = true
    }else{
        this.isSpecial = false
    }
    next()
})
const productModel = model('Product', productSchema)
export default productModel
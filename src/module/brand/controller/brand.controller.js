import { asyncHandler } from "../../../services/asyncHandler.js";
import slugify from "slugify";
import { create, findByIdAndUpdate, find, findByIdAndDelete, findById } from "../../../../DB/DBMethods.js";
import brandModel from "../../../../DB/model/brand.model.js";
import cloudinary from '../../../services/cloudinary.js'
import { paginate } from '../../../services/pagination.js';
const populate = [
  {
    path: "createdBy",
    select: ["userName", "email"]

  },

];

export const addBrand = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    next(new Error("you have to upload an image", { cause: 422 }));
  } else {

    let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: "brands",
    });
    req.body.image = secure_url;
    req.body.public_id = public_id;
    req.body.slug = slugify(req.body.name);
    req.body.createdBy = req.user._id

    const result = await create({ model: brandModel, data: req.body });
    res.status(201).json({ message: "created", result });
  }
});



export const updateBrand = asyncHandler(async (req, res, next) => {
  let { brandId } = req.params;
  let brand = await findById({ model: brandModel, condition: brandId })
  if (req.file) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "category/subCategory" });
    req.body.image = secure_url;
    req.body.public_id = public_id;
  } else {
    req.body.image = brand.secure_url;
    req.body.public_id = brand.public_id;
  }
  if (!req.body.name|| req.body.name=='undefined') {
    req.body.name = brand.name
    req.body.slug = brand.slug
  } else {
    req.body.slug = slugify(req.body.name);

  }
  let results = await findByIdAndUpdate({ model: brandModel, condition: { _id: brandId }, data: req.body });
  if (!results) {
    await cloudinary.uploader.destroy(req.body.public_id);
    next(new Error("brand  not found", { cause: 404 }));
  } else {
    await cloudinary.uploader.destroy(results.public_id);
    res.status(200).json({ message: "brand is updated", results });
  }
});

export const allBrands = asyncHandler(async (req, res, next) => {
  let { limit, skip } = paginate(req.query.page, req.query.size)
  const brands = await find({ model: brandModel, limit, skip, populate: [...populate] })
  if (!brands) {
    next(new Error("no brands", { cause: 404 }))
  } else {
    res.status(200).json({ message: "All brands", brands })
  }
})

export const removeBrand = async (req, res, next) => {
  const { id } = req.params
  const brand = await findById({ model: brandModel, condition: id })
  if (brand) {
    const deleteBrand = await findByIdAndDelete({ model: brandModel, condition: id })
    res.json({ message: 'Deleted', deleteBrand })
  } else {
    res.json({ message: 'brand not found' })
  }
}
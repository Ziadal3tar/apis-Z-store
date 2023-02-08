import { create, find, findById, findOne, findOneAndUpdate, findByIdAndDelete } from "../../../../DB/DBMethods.js";
import couponModel from "../../../../DB/model/coupon.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";
import { paginate } from "../../../services/pagination.js";


export const addCoupon = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user._id;
  req.body.expireIn = Date.now();
  let name = req.body.name
  let foundCoupon = await findOne({ model: couponModel, condition: { name } })
  if (foundCoupon) {
    return next(new Error("coupon name must be unique", { cause: 404 }))
  }
  let addded = await create({ model: couponModel, data: req.body });
  res.status(201).json({ "message": "Added", addded })
})


export const updatedCoupon = asyncHandler(async (req, res, next) => {
  if (req.body.type == "enable") {
    req.body.isStopped = false
  } else if (req.body.type == "disable") {
    req.body.isStopped = true
  }

  req.body.updatedBy = req.user._id;
  let { name } = req.params
  let updated = await findOneAndUpdate({ model: couponModel, condition: { name }, data: req.body, options: { new: true } })
  res.status(200).json({ message: "updated", updated });
});

export const stopCoupon = asyncHandler(async (req, res, next) => {
  req.body.deletedBy = req.user._id;

  let { name } = req.params;
  let coupon = await findOne({ model: couponModel, condition: { name } })
  if (coupon) {
    let stopCouponStatus = await findOneAndUpdate({ model: couponModel, condition: { name }, data: { isStopped: !coupon.isStopped, deletedBy: req.user._id }, options: { new: true } });
    res.status(200).json({ message: "done", stopCouponStatus });
  }

});

export const allcoupons = asyncHandler(async (req, res, next) => {
  let { limit, skip } = paginate(req.query.page, req.query.size)
  const coupons = await find({ model: couponModel, limit, skip })
  if (!coupons) {
    next(new Error("no coupons", { cause: 404 }))
  } else {
    res.status(200).json({ message: "All coupons", coupons })
  }
})
const populate = [
  {
    path: "createdBy",
    select: ["userName", "email"]

  },
  {
    path: "deletedBy",
    select: ["userName", "email"]

  },
  {
    path: "updatedBy",
    select: ["userName", "email"]
  },


];
export const getCouponById = asyncHandler(async (req, res, next) => {
  let { id } = req.params
  const coupon = await findById({ model: couponModel, condition: id, populate: [...populate] })
  if (!coupon) {
    next(new Error("no coupon not found", { cause: 404 }))
  } else {
    res.status(200).json({ message: "coupon", coupon })
  }
})
export const removeCoupon = asyncHandler(async (req, res, next) => {

  let { id } = req.params;
  let coupon = await findOne({ model: couponModel, condition: { id } })
  if (coupon) {
    let deletedCoupon = await findByIdAndDelete({ model: couponModel, condition: { _id: id } });
    res.status(200).json({ message: "deleted", deletedCoupon });
  } else {
    return next(new Error("coupon note found", { cause: 404 }))

  }

});

export const getCoupon = asyncHandler(async (req, res, next) => {
  let { couponName } = req.params
  let coupon = await findOne({ model: couponModel, condition: { name: couponName } })
  if (coupon) {
    if (coupon.isStopped) {
      return next(new Error("coupon not founded", { cause: 404 }))
    } else {
      res.status(201).json({ message: "coupon", coupon })
    }
  } else {
    return next(new Error("coupon not founded", { cause: 404 }))
  }
});

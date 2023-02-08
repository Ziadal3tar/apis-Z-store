import { create, find, findById, findByIdAndUpdate, findOne, findOneAndUpdate } from "../../../../DB/DBMethods.js";
import cartModel from "../../../../DB/model/cart.model.js";
import userModel from "../../../../DB/model/user.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";
import { paginate } from "../../../services/pagination.js";
import jwt from 'jsonwebtoken';


export const createCart = asyncHandler(async (req, res, next) => {

  let { _id } = req.user;
  req.body.userId = _id
  let product = {
    productId: req.body.productId,
    quantity: req.body.quantity
  }
  let cart = await findOne({ model: cartModel, condition: { userId: _id } });
  if (!cart) {
    let added = await create({ model: cartModel, data: req.body });
    if (added) {
      let updateUserCart = findByIdAndUpdate({ model: userModel, condition: _id, data: { cart: true,cartId:added._id } })
      added.products.push(product)
      let updated = await findOneAndUpdate({ model: cartModel, condition: { userId: req.user._id }, data: added, options: { new: true } })
      return res.status(201).json({ message: "Added", added });
    }

  }
  for (const product of cart.products) {
    if (product.productId.toString() == req.body.productId) {
      product.quantity = req.body.quantity
      let updated = await findOneAndUpdate({ model: cartModel, condition: { userId: req.user._id }, data: cart, options: { new: true } })
      return res.status(200).json({ message: "updated", updated });
    }

  }

  cart.products.push(product)
  let updated = await findOneAndUpdate({ model: cartModel, condition: { userId: req.user._id }, data: cart, options: { new: true } })
  res.status(200).json({ message: "updated", updated });

})

const populate = [
  {
    path: "userId",
    select: ["_id", "userName"]

  },
  {
    path: "products.productId",

  }
];
export const allCarts = asyncHandler(async (req, res, next) => {
  let { limit, skip } = paginate(req.query.page, req.query.size)
  const Carts = await find({ model: cartModel, limit, skip, populate: [...populate] })
  if (!Carts) {
    next(new Error("no Carts", { cause: 404 }))
  } else {
    res.status(200).json({ message: "All Carts", Carts })
  }
})

export const getCart = asyncHandler(async (req, res, next) => {
  const { token } = req.params
  let _id = jwt.verify(token, process.env.tokenSignature).id

  let cart = await findOne({ model: cartModel, condition: { userId: _id }, populate: [...populate] });
  if (cart) {
    return res.status(201).json({ message: "cart", cart });
  }
  next(new Error("Cart Not Found", { cause: 404 }))


})
export const deleteFromCart = asyncHandler(async (req, res, next) => {
  const { userId, productId } = req.body
  let cart = await findOne({ model: cartModel, condition: { userId } });
  if (cart) {
    let num = cart.products.length
    cart.products = cart.products.filter((item) => item._id.toString() != productId)
    console.log(num , cart.products.length);
    if (cart.products.length == num) {
      cart.products = cart.products.filter((item) => item.productId._id.toString() != productId)
    }
    const removeProduct = await findOneAndUpdate({ model: cartModel, condition: { userId }, data: { products: cart.products }, options: { new: true } })
    res.status(200).json({ message: "removeProduct", removeProduct })
  } else {
    next(new Error("cart not found", { cause: 400 }))
  }
})

// export const deleteDeletedProducts = asyncHandler(async (req, res, next) => {
//   const { userId, productId } = req.body
//   console.log(userId ,productId);
//   let cart = await findOne({ model: cartModel, condition: { userId } });
//   if (cart) {
//     cart.products = cart.products.filter((item) => item.productId._id.toString() != productId)
//     const removeProduct = await findOneAndUpdate({ model: cartModel, condition: { userId }, data: { products: cart.products }, options: { new: true } })
//     res.status(200).json({ message: "removeProduct", removeProduct })
//   } else {
//     next(new Error("cart not found", { cause: 400 }))
//   }
// })

export const changeQuantityOfProductInCart = asyncHandler(async (req, res, next) => {
  let { token } = req.params
  let { index, productId, quantity } = req.body
  let id = jwt.verify(token, process.env.tokenSignature).id
  const theUser = await findById({ model: userModel, condition: id })
  if (!theUser) {
    res.status(400).json({ message: "user not found" })
  } else {
    let cart = await findOne({ model: cartModel, condition: { userId: id } })
    if (cart) {
      for (let i = 0; i < cart.products.length; i++) {
        const element = cart.products[i];
        if (element.productId == productId) {
          element.quantity = quantity
          let updatedquantity = await findByIdAndUpdate({ model: cartModel, condition: cart._id, data: { products: cart.products },options:{new:true} })
          return res.status(200).json({ message: "updated", updatedquantity })
        } else {
          next(new Error("product not found", { cause: 400 }))
        }
      }
    }
  }
})

export const removeWishList = asyncHandler(async (req, res, next) => {
  // let { productId } = req.params;
  // let founded = await findById({ model: productModel, condition: productId });
  // if (!founded) {
  //   return next(new Error("product not found", { cause: 404 }));
  // }
  // let updated = await findByIdAndUpdate({
  //   model: userModel,
  //   condition: req.user._id,
  //   data: {
  //     $pull: { wishlist: productId },
  //   },
  //   options: { new: true },
  // });

  // res.status(200).json({ message: "Done", updated });
}); 
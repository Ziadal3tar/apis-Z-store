import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { fileValidation, myMulter, HME } from "../../services/multer.js";
import { endPoints } from "./product.endPoint.js";
import * as productController from './controller/product.controller.js';
import wishlistRouter from'../wishList/wishList.router.js'

const router = Router()


router.get('/', (req ,res)=>{
    res.status(200).json({message:"product Module"})
})



router.use("/:productId/wishlist", wishlistRouter);

router.post("/addProduct/:categoryId/:subCategoryId/:brandId" ,auth(endPoints.create),myMulter(fileValidation.image).array("image"),HME, productController.addProduct);
router.get("/allProducts", productController.allProduct);
router.get("/getProduct/:id", productController.getProduct);
router.get("/getSpecialProduct", productController.getSpecialProduct);
router.put("/updateProduct/:productId", auth(endPoints.create), myMulter(fileValidation.image).array("image", 7), HME, productController.updateProduct);
router.put("/removeProduct/:productId", auth(endPoints.create), productController.removeProduct);
router.get("/getStoresProducts/:id", productController.getStoresProducts);

export default router
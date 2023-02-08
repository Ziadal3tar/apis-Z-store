import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { HME, myMulter, fileValidation } from "../../services/multer.js";
import { endPoints } from "./brand.endPoint.js";
import * as brandController from './controller/brand.controller.js'
const router = Router()




router.get('/', (req ,res)=>{
    res.status(200).json({message:"Brand Module"})
})

router.post("/addBrand", auth(endPoints.createBrand), myMulter(fileValidation.image).single("image"), HME, brandController.addBrand);
router.put("/updateBrand/:brandId", auth(endPoints.updateBrand), myMulter(fileValidation.image).single("image"), HME, brandController.updateBrand);
router.get("/allBrands",brandController.allBrands)
router.delete("/removeBrand/:id", auth(endPoints.updateBrand),brandController.removeBrand)


export default router
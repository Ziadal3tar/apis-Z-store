import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { fileValidation, HME, myMulter } from "../../services/multer.js";
import * as subCategoryController from './controller/subCategory.controller.js'
import { endPoints } from "./subCategory.endPoints.js";
const router = Router({mergeParams:true})

router.post("/addSubCategory/:categoryId",auth(endPoints.addSubCategory),myMulter(fileValidation.image).single("image"),HME,subCategoryController.addSubCategory)
router.get("/allSubCategoriesFromCategory",subCategoryController.allSubCategoriesFromCategory)
router.delete("/removeSubCategory/:subCategoryId",auth(endPoints.removeSubCategory),subCategoryController.removeSubCategory)
router.put("/UpdateSubCategory/:subCategoryId",auth(endPoints.updateSubCategory),myMulter(fileValidation.image).single("image"),HME,subCategoryController.UpdateSubCategory)
router.get("/allSubCategory",subCategoryController.allSubCategory)
router.get("/getSubCategory/:subCategoryId",subCategoryController.getSubCategory)


export default router
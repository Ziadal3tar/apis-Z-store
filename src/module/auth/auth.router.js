import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { fileValidation, HME, myMulter } from "../../services/multer.js";
import { endPoints } from "./auth.endPoint.js";
import { logInValidation, signUpValidation, updateRoleValidation } from "./auth.validation.js";
import * as registerControl from './controller/registration.js'
const router = Router()
router.get("/", (req, res) => {
    res.status(200).json({ message: 'Auth Module' })
})

router.post("/signUp",validation(signUpValidation), registerControl.signUp)
router.get("/confirmEmail/:token", registerControl.confirmEmail)
router.get("/refreshToken/:token", registerControl.resendConfirmEmail)
router.post("/logIn",validation(logInValidation), registerControl.logIn)
router.get("/allUser", registerControl.allUser)
router.get("/allAdmins", registerControl.getAllAdmins)
router.delete("/removeUser/:_id",auth(endPoints.removeRole), registerControl.removeUser)
router.get("/getUserById/:_id", registerControl.getUserById)

router.put("/updateRole",auth(endPoints.updateRole),validation(updateRoleValidation),registerControl.updateRole)
router.get("/getUser/:token", registerControl.getUser)
router.patch("/editProfilePic",myMulter(fileValidation.image).single("image"),HME,registerControl.editProfilePic)
router.put("/addAdmin/:_id",registerControl.addAdmin)
router.delete("/removeAdmin/:_id",registerControl.removeAdmin)
router.put("/block/:_id",registerControl.blockUser)
router.post("/searchUser",auth(endPoints.addAdmin),registerControl.searchUser)
router.put("/updateUser/:id",registerControl.updateUser)
router.post("/sendEmail",registerControl.sendEmaiil)
export default router
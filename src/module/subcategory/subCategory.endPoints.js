import { roles } from "../../middleware/auth.js";


export const endPoints = {
    addSubCategory:[roles.Admin],
    removeSubCategory:[roles.Admin],
    updateSubCategory:[roles.Admin],
}
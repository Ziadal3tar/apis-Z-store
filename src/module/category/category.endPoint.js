import { roles } from "../../middleware/auth.js";
export const endPoints = {
    addCategory:[roles.Admin],
    updateCategory:[roles.Admin],
    removeCategory:[roles.Admin]

}

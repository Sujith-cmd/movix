import express from "express"
import {adminLogin, listing, signout ,utility} from "../Controllers/adminController.js"
const router=express.Router()

router.post("/login",adminLogin)
router.get("/list",listing)
router.get("/signout",signout)
router.put("/utility",utility)
export default router
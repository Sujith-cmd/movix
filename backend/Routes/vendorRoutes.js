import express from "express"
import { vendorSignin,allowEdit, prodDet, trendingList, vendorApproval, vendorDetails, vendorEatables, vendorEdit, vendorFacilities, vendorList, vendorRegistration, vendorSignup, vendorTimings,signout ,testing,vendorListing,subscribe, putNotAllowed} from "../Controllers/vendorController.js"
import { verifyToken } from "../utils/verifyUser.js"


const router=express.Router()

router.post("/signup",vendorSignup)
router.post("/signin",vendorSignin)
router.get("/vendorList",vendorList)
router.get("/trending/:type",trendingList)
router.get("/signout",signout)
router.post("/update/:id",verifyToken,allowEdit)
router.patch("/facilities/:id",verifyToken,vendorFacilities)
router.get("/facilities/:id",vendorDetails)
router.patch("/eatables/:id",verifyToken,vendorEatables)
router.post("/testing/:id",vendorTimings)
router.get("/explore/:type",vendorListing)
router.post("/subscribe",subscribe)
router.post("/putAllow",putNotAllowed)


// router.get("/registration/:id",vendorRegistration)
router.put("/registration/:id",vendorRegistration)
router.put("/timings/:id",vendorTimings)
router.put("/approval/:id",vendorApproval)
router.get("/getDetails/:id",prodDet)


export default router
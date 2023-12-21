import express from "express"
import { booking, login,userDet, search, signup ,google, updateUser, deleteUser,signout,checkout, cancelShow} from "../Controllers/viewersController.js"
import { verifyToken } from "../utils/verifyUser.js"

const router=express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/booking/:vid/:uid",booking)
router.post("/update/:id",updateUser)
router.get("/:id",userDet)
// router.post("/availableSlots/:vid/:date",booking)
router.post("/cancel/:id",cancelShow)
router.get("/signout",signout)
router.post("/checkout-session",checkout)


router.get("/search",search)
// router.post("/booking/:uid/:tid",booking)
router.post('/google',google)
router.delete("/delete/:id",verifyToken,deleteUser)
// router.get("/braintree/token",braintreeTokenController)
// router.post("/braintree/token",braintreePaymentController)

export default router
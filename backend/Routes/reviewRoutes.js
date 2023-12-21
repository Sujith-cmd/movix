import express from "express"
import { addRating, createReview } from "../Controllers/reviewController.js"
import { getReview } from "../Controllers/reviewController.js"
import { verifyToken } from "../utils/verifyUser.js"
const router = express.Router()

router.post("/createReview/:theatreId/:userId",createReview)
router.get("/getReview/:theatreId",verifyToken,getReview)
router.post("/rating/:userId/:theatreId",addRating)

export default router
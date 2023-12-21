import express from 'express'
import { addMessage, getMessages } from '../Controllers/messageController.js'
const router = express.Router()

router.post("/",addMessage)
router.get("/:chatId",getMessages)
// router.get("/find/:firstId/:secondId",findChat)

export default router
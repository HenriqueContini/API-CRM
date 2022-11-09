import express from "express";
import multer from "multer";
import UserController from "../controllers/UserController.js";
import FileService from "../services/FileService.js";

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage()
});

router
    .post('/user/login', UserController.login)
    .get('/user/getuser/:user', UserController.getUser)
    .put('/user/updateuser/:user', upload.single('file'), FileService.updateUserImage, UserController.updateUser)
    .post('/user/createuser/:user', UserController.createUser)

export default router;
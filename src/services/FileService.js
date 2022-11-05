import admin, { BUCKET } from "../config/firebaseConfig.js";

const bucket = admin.storage().bucket();

export default class FileService {
    static updateUserImage(req, res, next) {
        if (!req.file) {
            return next();
        }

        const image = req.file;
        const imageName = `${Date.now()}.${image.originalname.split('.').pop()}`;

        const bucketFile = bucket.file(`user/${imageName}`);

        const stream = bucketFile.createWriteStream({
            metadata: {
                contentType: image.mimetype
            }
        })

        stream.on("error", (e) => {
            console.log(e);
        })

        stream.on("finish", async () => {
            await bucketFile.makePublic();

            req.file.firebaseURL = `https://storage.googleapis.com/${BUCKET}/user/${imageName}`;
            next();
        })

        stream.end(image.buffer);
    }

    static async addFilesCRM(req, res, next) {
        if (req.files.length === 0) {
            return next();
        }

        let filesList = req.files;
        let i = 0;

        filesList.forEach((file, index) => {
            const fileName = `${Date.now()}.${file.originalname.split('.').pop()}`;

            const bucketFile = bucket.file(`crmfiles/${fileName}`);
            const stream = bucketFile.createWriteStream({
                metadata: {
                    contentType: file.mimetype
                }
            })

            stream.on("error", (e) => {
                console.log(e);
            })

            stream.on("finish", async () => {
                await bucketFile.makePublic();

                req.files[index].firebaseURL = `https://storage.googleapis.com/${BUCKET}/crmfiles/${fileName}`;

                i++;

                if (i === filesList.length) {
                    next();
                }
            })
            stream.end(file.buffer);
        })
    }
}
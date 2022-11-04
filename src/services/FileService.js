import admin, { BUCKET } from "../config/firebaseConfig.js";

const bucket = admin.storage().bucket();

export default class FileService {
    static updateUserImage(req, res, next) {
        if(!req.file) {
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
}
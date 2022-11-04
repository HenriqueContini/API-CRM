import admin from "firebase-admin";
import serviceAccount from "./firebasekey.json" assert {type: 'json'};

const BUCKET = `qq-crm.appspot.com`;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: BUCKET
});

export {BUCKET, admin as default};
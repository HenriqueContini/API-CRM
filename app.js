import express from "express";
import routes from "./src/routes/index.js";
import db from "./src/config/dbconfig.js";

const app = express();
const port = process.env.PORT || 8080;

try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
} catch (e) {
    console.log('Unable to connect to the database:', e);
}

routes(app);

app.listen(port, () => {
    console.log(`Server running in: http://localhost:${port}`);
})
import express from "express";
import routes from "./src/routes/index.js";

const app = express();
const port = process.env.PORT || 8080;

routes(app);

app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`);
})
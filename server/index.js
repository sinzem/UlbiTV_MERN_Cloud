const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const fileUpload = require("express-fileupload");
const fileRouter = require("./routes/file.routes");
const authRouter = require("./routes/auth.routes");
const corsMiddleware = require("./middleware/cors.middleware");
const filePathMiddleware = require("./middleware/filepath.middleware");
const path = require("path");


const app = express();
const PORT = process.env.PORT || config.get("serverPort");

app.use(fileUpload({}))
app.use(corsMiddleware);
app.use(filePathMiddleware(path.resolve(__dirname, "files"))); /* (добавит путь к папке с сохраняемыми файлами к запросу) */
app.use(express.json());
app.use(express.static("static")); /* (для работы со статическими файлами подключаем папку static из корневой папки) */
app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);

const start = async () => {
    try {
        await mongoose.connect(config.get("dbUrl"));

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start(); /* (npm start - запуск, npm dev - запуск с nodemon) */
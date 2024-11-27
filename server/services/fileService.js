const fs = require("fs");
const config = require("config");
const file = require("../models/File");

class FileService {

    createDir(req, file) {
        /* const filePath = `${config.get("filePath")}\\${file.user}\\${file.path}`; */ /* (складываем путь к файлу - изначально создаем общую папку file, далее папку для каждого пользователя(будет создаваться при регистрации), в нее складываем загруженные файлы) */
        const filePath = this.getPath(req, file); /* (путь к файлу получаем из запроса(миддлвер filepath добавит к запросу соответстыующее поле)) */
        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath);
                    return resolve("File was created")
                } else {
                    return reject({message: "File already exist"})
                }
            } catch (e) {
                return reject({message: "File error"});
            }
        })
    }

    deleteFile(req, file) {
        const path = this.getPath(req, file);
        if (file.type === "dir") {
            fs.rmdirSync(path);
        } else {
            fs.unlinkSync(path);
        }
    }

    getPath(req, file) {
        return /* config.get("filePath") */req.filePath + "\\" + file.user + "\\" + file.path;
    }
}

module.exports = new FileService();
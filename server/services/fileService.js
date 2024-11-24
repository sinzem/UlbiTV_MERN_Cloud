const fs = require("fs");
const config = require("config");
const file = require("../models/File");

class FileService {

    createDir(file) {
        const filePath = `${config.get("filePath")}\\${file.user}\\${file.path}`; /* (складываем путь к файлу - изначально создаем общую папку file, далее папку для каждого пользователя(будет создаваться при регистрации), в нее складываем загруженные файлы) */
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

    deleteFile(file) {
        const path = this.getPath(file);
        if (file.type === "dir") {
            fs.rmdirSync(path);
        } else {
            fs.unlinkSync(path);
        }
    }

    getPath(file) {
        return config.get("filePath") + "\\" + file.user + "\\" + file.path;
    }
}

module.exports = new FileService();
const config = require("config");
const fs = require("fs");
const fileService = require("../services/fileService");
const User = require("../models/User");
const File = require("../models/File");

class FileController {
    async createDir(req, res) {
        try {
            const {name, type, parent} = req.body; /* (в запросе передаем имя, тип и id родительской папки(если не передали, создаст в корневой папке пользователя, если передали - создаст вложенную в parent)) */
            const file = new File({name, type, parent, user: req.user.id}); /* (данные файла получаем из тела запроса, id пользователя - из токена(миддлвер извлечет и добавит к запросу как req.usr.id)) */
            const parentFile = await File.findOne({_id: parent}); /* (по id находим родительский файл) */
            if (!parentFile) {
                /* (если родительский файл не найден, сохраняем файл как родительский с создаем директорию) */
                file.path = name;
                await fileService.createDir(file);
            } else {
                /* (если родительский файл найден, дописываем путь загружаемого и сохраняем как дочерний) */
                file.path = `${parentFile.path}\\${file.name}`;
                await fileService.createDir(file);
                parentFile.childs.push(file._id);
                await parentFile.save();
            }
            await file.save();
            return res.json(file);
            /* (сохраняем, возвращаем на пользователя) */
        } catch (e) {
            console.log(e);
            return res.status(400).json(e);
        }
    }

    async getFiles(req, res) { /* (для получения файлов - по id пользователя из jwt и id родительской папки из query) */
        try {
            const files = await File.find({user: req.user.id, parent: req.query.parent});
            return res.json(files);
        } catch (e) {

        }
    }

    async uploadFile(req, res) {
        try {
            const file = req.files.file; /* (получаем файл из запроса) */

            const parent = await File.findOne({user: req.user.id, _id: req.body.parent}); /* (получаем папку для сохранения) */
            const user = await User.findOne({_id: req.user.id}); /* (получим самого юзера(только для получения данных об оставшемся свободном месте на диске)) */

            if (user.usedSpace + file.size > user.diskspace) {
                return res.status(400).json({message: "There no space on the disk"});
            } /* (проверяем достаточно ли места) */

            user.usedSpace = user.usedSpace + file.size; /* (обновляем данные об использованом месте) */

            let path;
            if (parent) {
                path = `${config.get("filePath")}\\${user._id}\\${parent.path}\\${file.name}`;
            } else {
                path = `${config.get("filePath")}\\${user._id}\\${file.name}`;
            } /* (составляем путь к файлу) */

            if (fs.existsSync(path)) {
                return res.status(400).json({message: "File already exists"});
            }

            file.mv(path); /* (отправляем файл по заданному пути) */

            const type = file.name.split(".").pop(); /* (получаем тип файла) */
            const dbFile = new File({
                name: file.name,
                type,
                size: file.size,
                path: parent?.path,
                parent: parent?._id,
                user: user._id
            });  /* (составляем новый обьект для записи в БД) */ 

            /* (сохраняем данные в БД) */
            await dbFile.save();
            await user.save();

            res.json(dbFile);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Upload error"});
        }
    }
}

module.exports = new FileController(); /* (подключаем в роутах(file.routes.ts)) */
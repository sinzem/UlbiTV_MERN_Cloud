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
}

module.exports = new FileController();
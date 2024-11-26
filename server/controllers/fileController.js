const config = require("config");
const fs = require("fs");
const fileService = require("../services/fileService");
const User = require("../models/User");
const File = require("../models/File");
const uuid = require("uuid");

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
            const {sort} = req.query; /* (ожидаем в запросе название сортировки) */
            let files;
            switch (sort) {
                case "name": 
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({name: 1}); /* (при -1 отсортирует по убыванию) */
                    break;
                case "type": 
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({type: 1});
                    break;
                case "date": 
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({date: 1});
                    break;
                default:
                    files = await File.find({user: req.user.id, parent: req.query.parent});
                    break;
            }
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
            let filePath = file.name;
            if (parent) {
                filePath = parent.path + "\\" + file.name;
            }
            const dbFile = new File({
                name: file.name,
                type,
                size: file.size,
                path: filePath,
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

    async downloadFile(req, res) { /* (для скачивания файла) */
        try {
            const file = await File.findOne({_id: req.query.id, user: req.user.id}); /* (ищем файл и совпадение id пользователя(чтобы любой другой пользователь не мог скачать файл)) */
            const path = fileService.getPath(file);
            if (fs.existsSync(path)) { /* (если существует, загружаем) */
                return res.download(path, file.name);
            }
            return res.status(400).json({message: "Download error"}); /* (если что-то пошло не так, выдаем ошибку) */
         } catch (e) {
            console.log(e);
            res.status(500).json({message: "Download error"})
        }
    }

    async deleteFile(req, res) {
        try {
            const file = await File.findOne({_id: req.query.id, user: req.user.id});
            console.log(file);
            if (!file) {
                return res.status(400).json({message: "File not found"});
            }
            /* (удаляем файл из папки на сервере и запись о файле в таблице) */
            fileService.deleteFile(file);
            // await file.remove(); /* (как у автора - не работает) */
            await File.deleteOne({_id: req.query.id});
            return res.json({message: "File was deleted"});
        } catch (e) {
            console.log(e);
            return res.status(400).json({message: e.message});  /* (наиболее вероятной ошибкой может быть error при попытке удалить папку, если в ней еще есть файлы или папки(нужно прописать рекурсивное удаление)) */
        }
    }

    async searchFile(req, res) { /* (для поиска) */
        try {
            const searchName = req.query.search;  /* (получаем строку поиска из запроса) */
            let files = await File.find({user: req.user.id}); /* (получаем все файлы пользователя) */
            files = files.filter(file => file.name.includes(searchName)); /* (отфильтровываем включающие запрос) */
            return res.json(files);
        } catch (e) {
            console.log(e);
            return res.status(400).json({message: "Search error"});
        }
    }

    async uploadAvatar(req, res) {
        try {
            const file = req.files.file; /* (получаем файл из запроса) */
            const user = await User.findById(req.user.id); /* (Получаем пользователя из БД по id из токена) */
            const avatarName = uuid.v4() + ".jpg"; /* (генерируем имя для аватарки пользователя) */
            file.mv(config.get("staticPath") + "\\" + avatarName); /* (помещаем фото в папку для статики) */
            user.avatar = avatarName; /* (добавляем путь к фото в обьект пользователя) */
            await user.save(); /* (сохраняем изменения в БД) */
            return res.json(user);
        } catch (e) {
            console.log(e);
            return res.status(400).json({message: "There was an error loading the avatar"});
        }
    }

    async deleteAvatar(req, res) {
        try {
            const user = await User.findById(req.user.id);
            fs.unlinkSync(config.get("staticPath") + "\\" + user.avatar); 
            user.avatar = null; 
            await user.save(); 
            return res.json(user);
        } catch (e) {
            console.log(e);
            return res.status(400).json({message: "An error occurred while deleting your avatar"});
        }
    }
}


module.exports = new FileController(); /* (подключаем в роутах(file.routes.ts)) */
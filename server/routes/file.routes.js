const Router = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const fileController = require("../controllers/fileController");

const router = new Router();

router.post("", authMiddleware, fileController.createDir); /* (сохраняем по маршруту api/files, передаем миддлвер для извлечения id и функцию для создания директорий) */
router.post("/upload", authMiddleware, fileController.uploadFile); /* (для сохранения файла и данных о нем в БД) */
router.get("", authMiddleware, fileController.getFiles); /* (выдаст папки по id пользователя, чтобы обратиться к конкретной папке, добавляем query к запросу (api/files?parent=e1235312fvqe123)) */
router.get("/download", authMiddleware, fileController.downloadFile); /* (для загрузки файла с сервера) */
router.get("/search", authMiddleware, fileController.searchFile);
router.delete("/", authMiddleware, fileController.deleteFile);


module.exports = router;
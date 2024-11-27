const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 8080;

const app = express();
/* (подключаем для раздачи статики) */
app.use(express.static(__dirname));
app.use(express.static(path.resolve(__dirname, "build")));

/* (подключаем отправку index.html на запрос(если пользователь нажмет обновить страницу во время работы, отправляется запрос на несуществующий эндпоинт, вернем ему index в любом случае)) */
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
})

app.listen(PORT);
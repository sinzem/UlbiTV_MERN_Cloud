const {model, Schema, ObjectId} = require("mongoose");

const File = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true}, /* (разрешение файла) */
    accessLink: {type: String},
    size: {type: Number, default: 0},
    path: {type: String, default: ""},
    user: {type: ObjectId, ref: "User"}, /* (id добавившего пользователя) */
    parent: {type: ObjectId, ref: "File"}, /* (ссылка на родительскую папку) */
    childs: [{type: ObjectId, ref: "File"}] /* (массив с адресами файлов) */
})

module.exports = model("File", File);
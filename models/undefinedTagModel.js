//导入 mongoose
const mongoose = require('mongoose');
//创建文档的结构对象
//设置集合中文档的属性以及属性值的类型
let undefinedTagSchema = new mongoose.Schema({
    //标签
    name: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 1
    },

});

//创建模型对象  对文档操作的封装对象
let undefinedTagModel = mongoose.model('undefinedTag', undefinedTagSchema);

//暴露模型对象
module.exports = undefinedTagModel;

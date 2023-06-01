//导入 mongoose
const mongoose = require('mongoose');
//创建文档的结构对象
//设置集合中文档的属性以及属性值的类型
let emoticSchema = new mongoose.Schema({
    //标题
    id: {
        type: String,
        required: true
    },
    //标签
    tags: {
        type: Array,
        required: true
    },
    //备注
    other: {
        type: String,
    },
    //上传时间
    upTime: {
        type: Date,
        default:-1,
    },
    //是否审核
    audit: {
        type: Number,
        default:1,
    },
    fileList:{
        type:Array,
        required:true
    }
});

//创建模型对象  对文档操作的封装对象
let emoticModel = mongoose.model('emotic', emoticSchema);

//暴露模型对象
module.exports = emoticModel;

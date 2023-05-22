const emoticModel = require('../models/emoticModel');
const userModel = require('../models/userModel');
var express = require('express');
const IndexModel = require("../models/IndexModel");
var router = express.Router();


let validateToken=async (req,res,next)=> {
    const headers = req.headers;
    const ReqToken = headers.token
    const data=await(userModel.findOne())
    const compareToken=data.token
    if(ReqToken === compareToken)
    {
        next()
    }else{
        res.status(401).json({
            code: 401,
            message: '验证失败或者token不正确',
        });
    }
}
router.get('/readEmotic', (req, res) => {
    const { name, sortname, sortorder, page = 1, limit } = req.query;

    // 构造查询条件
    const condition = {};
    if (name) {
        condition.$or = [
            // {name: {$regex: new RegExp(name, 'i')}},
            { tags: { $regex: new RegExp(name, 'i') } },
            { other: { $regex: new RegExp(name, 'i') } }
        ];
    }

    // 构造排序条件
    const sort = {};
    if (sortname && ['audit'].includes(sortname)) {
        sort[sortname] = sortorder === 'desc' ? 1 : -1;
    }
    const sortObj = sortname ? { [sortname]: sort[sortname] } : { upTime: -1 };

    // 构造限制条件（即跳过前面几条数据）
    const skipNum = (page - 1) * limit;

    // 执行查询操作并响应结果
    // 使用Promise方式处理
    let tempCount=null
    emoticModel.countDocuments(condition).then(count=>
    {tempCount=count
        return emoticModel.find(condition)
            .sort(sortObj)
            .skip(skipNum)
            .limit(parseInt(limit))})
        .then(data => {
            // 响应成功的提示
            res.json({
                data: {
                    code: 200,
                    count:tempCount,
                    list: data
                }
            });
        })
        .catch(err => {
            res.status(500).send('读取失败~~~');
        });
});

router.post('/editEmotic', validateToken, (req, res) => {
    const { id, tags, other, upTime, audit, fileList } = req.body;
    // emoticModel.find().then(e=>console.log(e)).catch(err=>console.log(err))
    const audit_num = parseInt(audit);
    Promise.resolve({then:resolve=>{if(audit_num){resolve(1)}resolve(0)}})
        .then(type=> {
                    console.log('emoticModel将执行修改')
                    return emoticModel.findOneAndUpdate({id:id},{
                        tags:tags,
                        other:other,
                        upTime:upTime,
                        fileList:fileList,
                        audit:audit_num,
                    })
            }
        )
        .then(data=> {console.log(`${data}`);res.status(200).json({
            code: 200,
            data: {
                message: '修改成功',
            },
        })})
        .catch(err=>res.status(500).send(`修改失败：${err}`))
});

router.post('/delEmotic', validateToken,(req, res) => {
    const { id } = req.body;
    if (!id) {
        res.json({
            code: -999,
            message: '参数不正确',
        });
    } else {
        emoticModel.deleteOne({id:id}).then(data=>{
            res.status(200).json({
                code: 200,
                message: '删除成功',
            })
        }).catch(er=>{
            res.status(500).json({
                code:500,
                message:"删除失败",
            })
        })
    }
});

module.exports = router;

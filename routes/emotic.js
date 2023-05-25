const emoticModel = require('../models/emoticModel');
const userModel = require('../models/userModel');
var express = require('express');
var router = express.Router();
const { Configuration, OpenAIApi } = require("openai");


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

let randomTag=function(data){
    let tempRow = data[parseInt(Math.random() * (data.length))]
    return tempRow.fileList[parseInt(Math.random() * (tempRow.fileList.length))]
}
router.get('/readEmotic', (req, res) => {
    const { name, sortname, sortorder, page = 1, limit=2 } = req.query;

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


router.get('/getOneEmo', (req, res) => {
    const { name } = req.query;
    console.log(name)
    // 构造查询条件
    const condition = {};
    if (name) {
        condition.$or = [
            { tags: { $regex: new RegExp(name, 'i') } },
        ];
    }

    // 执行查询操作并响应结果
    // 使用Promise方式处理
    let emo=''
        emoticModel.find(condition)
        .then(async data => {
            if (data.length === 0) {

                data = await emoticModel.find();
                const tagArr = data.reduce((accumulator, currentValue) => accumulator.concat(currentValue.tags), []);
                let tagStr = tagArr.toString()
                let openai = "";
                let chatContent = `我需要你完成词义相似度功能，请从[${tagStr}]这个数组中选择与${name}关联性或词义最相近的一个标签，请你直接输出答案不要加任何标点符号`
                console.log(chatContent)
                const connectOpenAI = async () => {
                    const configuration = new Configuration({
                        apiKey: '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',
                        proxy: {
                            host: 'localhost',
                            port: 7980,
                        },
                    });
                    openai = new OpenAIApi(configuration);
                    return {openai};
                };

                connectOpenAI().then(async ({openai}) => {
                    // 对话
                    const completion = await openai.createChatCompletion({
                        model: "gpt-3.5-turbo",
                        messages: [{role: "user", content: chatContent}],
                        stream: false, // 是否是数据流，默认为 false
                    });
                    console.log("result", completion.data.choices[0].message);
                    let relativeTag = completion.data.choices[0].message.content
                    data=await emoticModel.find({tag:relativeTag})
                    emo = randomTag(data)
                    res.send(
                        emo
                    );
                })
            .catch(async err => {
                console.log('gpt调用失败~~~，将使用"万能表情"')
                data = await emoticModel.find({tag: '万能表情'})
                emo = randomTag(data)
                res.send(emo);
            });
            } else {
                emo = randomTag(data)
                res.send(
                    emo
                );
            }
            // 响应成功的提示
        })
        .catch(err => {
            res.status(500).send('读取表情失败~~~');
        });
});

router.post('/editEmotic', validateToken, (req, res) => {
    const { id, tags, other, upTime, audit, fileList } = req.body;
    const audit_num = parseInt(audit);
    Promise.resolve({then:resolve=>{if(audit_num){resolve(1)}resolve(0)}})
        .then(type=> {
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

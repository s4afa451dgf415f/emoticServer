//权限与会话管理
const fs = require('fs');
var express = require('express');
const path = require("path");
var router = express.Router();
const shortid=require('shortid')
const UserModel = require('../models/userModel');


// const password_path = path.join(__dirname,'/../data/user.json')


/* GET users listing. */
router.post('/getMenu', (req, res) => {
  const { username, password } = req.body
  //其中password为前端传过来由md5('123456')加密而成的，为什么会输出'not match'
  // 先判断用户是否存在
  // 判断账号和密码是否对应
  if (username === 'NGzhinengyanjiusuo' && password === 'e10adc3949ba59abbe56e057f20f883e') {
    let tempToken=shortid.generate()
    UserModel.find().then(data=>{if(data.length===0){return UserModel.create({token:tempToken})}return data}).then(data=>UserModel.findOneAndUpdate({},{token:tempToken})).catch(err => {
      console.error('初始化或更新token失败', err);
    })
    res.json({
      code: 200,
      data: {
        menu: [
          {
            path: '/admin',
            name: 'admin',
            label: '表情管理',
            icon: 'picture',
            url: 'Admin.vue'
          },
          {
            path: '/emotic',
            name: 'emotic',
            label: '表情管理(已审核)',
            icon: 'picture',
            url: 'Emotic.vue'
          },
        ],
        token: tempToken,
        message: '获取成功'
      }})}
   else {
    res.json({
      code: -999,
      data: {
        message: '密码错误'
      }
    })
  }
});

module.exports = router;

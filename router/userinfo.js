const express = require('express');
const router = express.Router();
const userinfo_handler = require('../router_handler/userinfo.js')



//获取用户基本信息的路由
router.get('/userinfo', userinfo_handler.getUserInfo)

//更新用户基本信息的路由
router.post('/userinfo', userinfo_handler.updateUserInfo)

//更新用户密码的路由
router.post('/updatepwd', userinfo_handler.updatePassword)

//更新用户头像的路由
router.post('/update/avatar', userinfo_handler.updateAvatar)

//绑定手机号
router.post('/bindPhoneNumber', userinfo_handler.bindPhone)

//获取手机号
router.get('/getPhoneNumber', userinfo_handler.getPhone)

//更新简介的路由
router.post('/update/introduction', userinfo_handler.updateIntroduction)

//修改邮箱的路由
router.post('/update/email', userinfo_handler.updateEmail)


module.exports = router;
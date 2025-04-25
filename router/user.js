const express = require('express');
const router = express.Router();

//导入用户处理函数模块
const userHandler = require('../router_handler/user.js')


//注册新用户
router.post('/reguser', userHandler.regUser)

//登录
router.post('/login', userHandler.login)

//发送验证码
router.post('/sendCode', userHandler.sendCode)

//重置密码
router.post('/resetPassword', userHandler.resetPassword)


module.exports = router; 
const express = require('express')
const router = express.Router()

const logHandler = require('../router_handler/log')

//新增日志的接口
router.post('/addLog', logHandler.addLog)

//加载日志数据接口
router.get('/getUserLogs', logHandler.getUserLogs)


module.exports = router
const express = require('express')
const router = express.Router()

const surveyHandler = require('../router_handler/survey.js')


//获取问卷列表
router.get('/list', surveyHandler.getSurveyList)

//获取已推送问卷列表
router.get('/listShared', surveyHandler.getPushSurveyList)

//获取问卷热门程度统计数据
router.get('/popular', surveyHandler.getSurveyPopular)

//修改热门数据
router.post('/addviewCount', surveyHandler.addviewCount)
router.post('/addshareCount', surveyHandler.addshareCount)

//保存问卷
router.post('/save', surveyHandler.saveSurvey)

//删除问卷
router.post('/delete', surveyHandler.deleteSurvey)

//修改问卷
router.post('/update', surveyHandler.updateSurvey)

//根据id获取问卷内容
router.get('/getContent', surveyHandler.getContent)

//根据id获取问卷内容(无需权限)
router.get('/getShareContent', surveyHandler.getShareContent)

//根据id获取问卷名
router.get('/getSurveyTitle', surveyHandler.getSurveyTitle)

//推送问卷
router.post('/push', surveyHandler.surveyPush)

module.exports = router
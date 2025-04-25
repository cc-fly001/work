const express = require('express')
const router = express.Router()

const commentHandler = require('../router_handler/comments')


//根据问卷id获得相应评论
router.get('/getSurveyComments', commentHandler.getSurveyComments)

//保存评论
router.post('/commentSaving', commentHandler.commentSaving)

//删除评论
router.post('/commentDeleting', commentHandler.commentDeleting)

//获取用户所有问卷未读评论数接口
router.get('/getUserNewCommentsCount', commentHandler.getUserNewCommentsCount)

//标记评论已读
router.post('/markCommentsRead', commentHandler.markCommentsRead)

module.exports = router
const express = require('express');
const app = express();

//跨域问题
const cors = require('cors');
app.use(cors());


//封装res.cc函数
app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})


app.use(express.json({ limit: '10mb' })); // 将限制设置为 10MB
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // 解析 URL 编码数据


const { expressjwt: expressJWT } = require('express-jwt');
const config = require('./config')
//使用jwt中间件验证token
app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api/, /^\/HTML\/shareSurvey\.html$/] }));

const path = require('path');
app.use('/HTML', express.static(path.join(__dirname, 'HTML')));


//导入用户路由模块
const userRouter = require('./router/user.js');
app.use('/api', userRouter)
//导入用户信息模块
const userInfoRouter = require('./router/userinfo.js');
app.use('/my', userInfoRouter)
//导入问卷操作模块
const surveyRouter = require('./router/survey.js');
app.use('/survey', surveyRouter)
//导入评论操作模块
const commentRouter = require('./router/comments.js')
app.use('/comment', commentRouter)
//导入日志操作模块
const logRouter = require('./router/log.js')
app.use('/log', logRouter)

//定义错误级别的中间件
app.use((err, req, res, next) => {
  //身份认证错误之后的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  //未知错误
  res.cc(err)
})

app.listen(3007, () => {
  console.log('api server running at http://127.0.0.1:3007')
})
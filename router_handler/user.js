//导入数据库操作模块
const db = require('../db/index')
//导入生成token的包
const jwt = require('jsonwebtoken')
const config = require('../config')

const aliyun = require('../aliyun')

function simpleDecrypt(str) {
  return decodeURIComponent(escape(Buffer.from(str, 'base64').toString('binary')));
}

//注册新用户处理函数
exports.regUser = (req, res) => {
  const userinfo = req.body
  if (!userinfo.username || !userinfo.password) {
    return res.send({ status: 1, message: '用户名或密码不能为空!' })
  }

  // 解码密码
  const decryptedPassword = simpleDecrypt(userinfo.password);

  //定义sql语句
  const sqlStr = 'select * from ev_users where username = ?'
  db.query(sqlStr, userinfo.username, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    //判断用户名是否被占用
    if (results.length > 0) {
      return res.cc('用户名已被占用!')
    }
    //插入新用户
    const sql = 'insert into ev_users set ?'
    db.query(sql, { username: userinfo.username, password: decryptedPassword }, (err, results) => {
      if (err) {
        return res.cc(err)
      }
      //判断影响行数是否为一
      if (results.affectedRows !== 1) {
        return res.cc('注册用户失败，请稍后再试！')
      }
      //注册成功
      res.cc('注册成功！', 0)
    })
  })
}


//登录的处理函数
exports.login = (req, res) => {
  //接收表单的数据
  const userinfo = req.body
  const sql = 'select * from ev_users where username = ?'
  db.query(sql, userinfo.username, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) {
      return res.cc('没有此用户！')
    }

    const decryptedPassword = simpleDecrypt(userinfo.password);

    //判断密码是否正确
    if (decryptedPassword !== results[0].password) {
      return res.cc('密码错误！')
    }

    //在服务器端生成token字符串 
    const user = { ...results[0], password: '', user_pic: '' }
    //生成token字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
    res.send({
      status: 0,
      message: '登录成功！',
      token: 'Bearer ' + tokenStr, //将生成的token字符串响应给客户端
      id: results[0].id //将用户id也响应给客户端
    })
  })
}



// 发送验证码接口
exports.sendCode = (req, res) => {
  const { phone_number } = req.body;

  // 验证手机号是否为空
  if (!phone_number) {
    return res.send({ status: 1, message: '手机号不能为空！' });
  }

  // 生成6位随机验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // 调用阿里云短信服务 API
  aliyun.smsClient
    .sendSMS({
      PhoneNumbers: phone_number, // 接收短信的手机号
      SignName: '阿里云短信测试',
      TemplateCode: 'SMS_154950909',
      TemplateParam: JSON.stringify({ code }),
    })
    .then((result) => {
      if (result.Code === 'OK') {
        console.log(`验证码 ${code} 已发送到手机号 ${phone_number}`);
        res.send({ status: 0, message: '验证码发送成功！', code });
      } else {
        console.error('短信发送失败：', result);
        res.send({ status: 1, message: '短信发送失败，请稍后再试！' });
      }
    })
    .catch((err) => {
      console.error('短信发送异常：', err);
      res.send({ status: 1, message: '短信发送异常，请稍后再试！' });
    });
};


//重置密码的处理函数
exports.resetPassword = (req, res) => {
  //接收表单数据
  const userinfo = req.body
  // 验证手机号是否为空
  if (!userinfo.phone_number) {
    return res.cc('手机号不能为空！');
  }

  const decryptedPassword = simpleDecrypt(userinfo.newPassword);

  //定义sql语句
  const sqlStr = 'select * from ev_users where phone_number = ?'
  db.query(sqlStr, userinfo.phone_number, (err, results) => {
    if (err) return res.cc(err)
    //判断手机号是否存在
    if (results.length === 0) return res.cc('手机号不存在！')
    //更新密码
    const sql = 'update ev_users set password = ? where phone_number = ?'
    db.query(sql, [decryptedPassword, userinfo.phone_number], (err, results) => {
      if (err) return res.cc(err)
      //判断影响行数是否为1
      if (results.affectedRows === 0) return res.cc('重置密码失败，请稍后再试！')
      //成功
      res.cc('重置密码成功！', 0)
    })
  })
}
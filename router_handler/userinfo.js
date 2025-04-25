//导入数据库操作模块
const db = require('../db/index')


//获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  const sql = 'select id,username,nickname,email,user_pic,phone_number,introduction from ev_users where id = ?'
  db.query(sql, req.auth.id, (err, results) => {
    if (err) return res.cc(err)
    //查询结果为空
    if (results.length !== 1) return res.cc('获取用户信息失败！')
    //成功
    res.send({
      status: 0,
      message: '获取用户信息成功！',
      data: results[0]
    })
  })
}

exports.updateUserInfo = (req, res) => {
  const sql = 'update ev_users set ? where id = ?'
  db.query(sql, [req.body, req.auth.id], (err, results) => {
    if (err) return res.cc(err)
    //判断影响行数是否为1
    if (results.affectedRows !== 1) return res.cc('更新用户信息失败！')
    //成功
    res.cc('更新用户信息成功！', 0)
  })
}


exports.updatePassword = (req, res) => {
  // 1. 查询用户是否存在
  const sql = 'select * from ev_users where id = ?'
  db.query(sql, req.auth.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('用户不存在！')

    // 2. 验证旧密码是否正确
    const user = results[0]
    if (req.body.oldPassword !== user.password) {
      return res.cc('旧密码错误！')
    }

    // 3. 验证新密码是否符合规则
    if (req.body.newPassword.length < 6) {
      return res.cc('新密码长度不能小于 6 位！')
    }

    // 4. 更新新密码
    const updateSql = 'update ev_users set password = ? where id = ?'
    db.query(updateSql, [req.body.newPassword, req.auth.id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('更新密码失败！')
      res.cc('更新密码成功！', 0)
    })
  })
}


exports.updateAvatar = (req, res) => {
  const { user_pic } = req.body

  // 验证 user_pic 是否为字符串
  if (typeof user_pic !== 'string') {
    return res.cc('头像数据必须为字符串！')
  }

  // 验证 user_pic 是否为 dataURL 格式
  const dataUrlPattern = /^data:image\/(png|jpeg|jpg|gif);base64,/
  if (!dataUrlPattern.test(user_pic)) {
    return res.cc('头像数据必须为有效的 Base64 格式的 DataURL!')
  }

  // 更新头像
  const sql = 'update ev_users set user_pic = ? where id = ?'
  db.query(sql, [user_pic, req.auth.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) { return res.cc('更新头像失败！') }
    res.cc('更新头像成功！', 0)
  })
}

//绑定手机号的处理函数
exports.bindPhone = (req, res) => {
  const userinfo = req.body
  if (!userinfo.phone_number) {
    return res.cc('手机号不能为空！')
  }
  if (!isValidPhoneNumber(userinfo.phone_number)) {
    return res.cc('手机号格式不正确！')
  }
  //定义sql语句
  const sqlStr = 'update ev_users set phone_number = ? where id = ?'
  db.query(sqlStr, [userinfo.phone_number, req.auth.id], (err, results) => {
    if (err) {
      return res.cc(err)
    }
    //判断影响行数是否为一
    if (results.affectedRows !== 1) {
      return res.cc('绑定手机号失败，请稍后再试！')
    }
    //绑定手机号成功
    res.cc('绑定手机号成功！', 0)
  })
}

function isValidPhoneNumber(phoneNumber) {
  // 定义正则表达式，匹配中国大陆的 11 位手机号码
  const phoneRegex = /^1[3-9]\d{9}$/;

  // 测试手机号是否匹配规则
  return phoneRegex.test(phoneNumber);
}


//获取手机号的处理函数
exports.getPhone = (req, res) => {
  const sqlStr = 'select phone_number from ev_users where id = ?'
  db.query(sqlStr, req.auth.id, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    //判断影响行数是否为一
    if (results.length !== 1) {
      return res.cc('获取手机号失败，请稍后再试！')
    }
    //获取手机号成功
    res.send({
      status: 0,
      message: '获取手机号成功！',
      data: results[0].phone_number
    })
  })
}

//更新简介的处理函数
exports.updateIntroduction = (req, res) => {
  const { introduction } = req.body

  // 验证 introduction 是否为字符串
  if (typeof introduction !== 'string') {
    return res.cc('简介数据必须为字符串！')
  }

  // 更新简介
  const sql = 'update ev_users set introduction = ? where id = ?'
  db.query(sql, [introduction, req.auth.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更新简介失败！')
    res.cc('更新简介成功！', 0)
  })
}


//更新邮箱的处理函数
exports.updateEmail = (req, res) => {
  const { email } = req.body

  // 验证 email 是否为字符串
  if (typeof email !== 'string') {
    return res.cc('邮箱数据必须为字符串！')
  }

  // 验证 email 是否符合格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.cc('邮箱格式不正确！')
  }

  // 更新邮箱
  const sql = 'update ev_users set email = ? where id = ?'
  db.query(sql, [email, req.auth.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更新邮箱失败！')
    res.cc('更新邮箱成功！', 0)
  })
}
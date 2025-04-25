const db = require('../db/index')


exports.addLog = (req, res) => {
  const { user_id, action, description, survey_id } = req.body;

  // 简单校验必填字段
  if (!user_id || !action) {
    return res.status(400).json({ status: 1, message: '缺少必要参数 user_id 或 action' });
  }

  // SQL语句
  const sql = `INSERT INTO user_logs (user_id, action, description, survey_id) VALUES (?, ?, ?, ?)`;

  db.query(sql, [user_id, action, description || '', survey_id], (err, results) => {
    if (err) {
      console.error('插入日志失败:', err);
      return res.status(500).json({ status: 1, message: '服务器错误，插入日志失败' });
    }

    res.json({
      status: 0,
      message: '日志添加成功',
      data: {
        logId: results.insertId,
      }
    });
  });
}


exports.getUserLogs = (req, res) => {
  const user_id = req.query.user_id;
  if (!user_id) return res.cc('获取用户id失败!')

  //sql语句
  const sql = 'select * from user_logs where user_id = ?'
  db.query(sql, user_id, (err, results) => {
    if (err) return res.cc(err);
    //成功
    res.send({
      status: 0,
      message: '获取用户日志成功!',
      data: results
    })
  })
}
const db = require('../db/index')


//根据问卷id获取相应评论
// exports.getSurveyComments = (req, res) => {
//   const survey_id = req.query.survey_id
//   if (!survey_id) return res.cc('获取问卷id错误')
//   const sql = 'select id , user_id , content , created_at from survey_comments where survey_id = ?'
//   db.query(sql, survey_id, (err, results) => {
//     if (err) return res.cc(err);
//     //成功
//     res.send({
//       status: 0,
//       message: '获取问卷评论列表成功!',
//       data: results,
//     })
//   })
// }

exports.getSurveyComments = (req, res) => {
  const survey_id = req.query.surveyId;
  if (!survey_id) return res.cc('获取问卷id错误');

  const sql = `
    SELECT c.id, c.user_id, u.username, c.content, c.created_at
    FROM survey_comments c
    LEFT JOIN ev_users u ON c.user_id = u.id
    WHERE c.survey_id = ?
    ORDER BY c.created_at DESC
  `;

  db.query(sql, survey_id, (err, results) => {
    if (err) return res.cc(err);

    res.send({
      status: 0,
      message: '获取问卷评论列表成功!',
      data: results,
    });
  });
};


//保存评论
exports.commentSaving = (req, res) => {
  const user_id = req.auth.id;
  const { survey_id, content } = req.body;

  if (!user_id) return res.cc('用户未登录或身份验证失败');
  if (!survey_id) return res.cc('缺少问卷ID');
  if (!content || content.trim() === '') return res.cc('评论内容不能为空');

  const sql = `INSERT INTO survey_comments (survey_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())`;

  db.query(sql, [survey_id, user_id, content.trim()], (err, results) => {
    if (err) return res.cc(err);

    if (results.affectedRows !== 1) return res.cc('评论保存失败，请重试');

    res.send({
      status: 0,
      message: '评论保存成功',
      data: {
        commentId: results.insertId,
      },
    });
  });
};


//删除评论
exports.commentDeleting = (req, res) => {
  const user_id = req.auth.id;
  const { comment_id } = req.body;

  if (!user_id) return res.cc('用户未登录或身份验证失败');
  if (!comment_id) return res.cc('缺少评论ID');

  // 先查询评论是否存在且属于当前用户
  const checkSql = 'SELECT user_id FROM survey_comments WHERE id = ?';
  db.query(checkSql, comment_id, (err1, results1) => {
    if (err1) return res.cc(err1);

    if (results1.length === 0) return res.cc('评论不存在');
    if (results1[0].user_id !== user_id) return res.cc('无权限删除他人评论');

    // 删除评论
    const deleteSql = 'DELETE FROM survey_comments WHERE id = ?';
    db.query(deleteSql, comment_id, (err2, results2) => {
      if (err2) return res.cc(err2);

      if (results2.affectedRows !== 1) return res.cc('删除评论失败，请重试');

      res.send({
        status: 0,
        message: '删除评论成功',
      });
    });
  });
};

exports.getUserNewCommentsCount = (req, res) => {
  const userId = req.auth.id;
  const sql = `
    SELECT s.id AS surveyId,
      COUNT(c.id) AS newCommentsCount
    FROM surveys s
    LEFT JOIN survey_comments c ON c.survey_id = s.id
    LEFT JOIN user_survey_comment_read r ON r.survey_id = s.id AND r.user_id = ?
    WHERE s.user_id = ?
      AND (r.last_read_at IS NULL OR c.created_at > r.last_read_at)
    GROUP BY s.id
  `;

  db.query(sql, [userId, userId], (err, results) => {
    if (err) return res.cc(err);

    const filtered = results.filter(item => item.newCommentsCount > 0);

    res.send({
      status: 0,
      data: filtered,
    });
  })
}


//标记评论已读
exports.markCommentsRead = (req, res) => {
  const userId = req.auth.id;
  const { survey_id } = req.body;

  if (!survey_id) return res.cc('缺少survey_id参数');

  const now = new Date();

  // 先尝试更新
  const updateSql = `
    UPDATE user_survey_comment_read
    SET last_read_at = ?
    WHERE user_id = ? AND survey_id = ?
  `;

  db.query(updateSql, [now, userId, survey_id], (err, result) => {
    if (err) return res.cc(err);

    if (result.affectedRows === 0) {
      // 如果没有记录，插入一条
      const insertSql = `
        INSERT INTO user_survey_comment_read (user_id, survey_id, last_read_at)
        VALUES (?, ?, ?)
      `;
      db.query(insertSql, [userId, survey_id, now], (err2) => {
        if (err2) return res.cc(err2);
        res.send({ status: 0, message: '标记已读成功' });
      });
    } else {
      res.send({ status: 0, message: '标记已读成功' });
    }
  });
}
const db = require('../db/index')

//保存列表
exports.saveSurvey = (req, res) => {
  // 检查必填项是否为空
  const { user_id, title, content } = req.body;
  if (!user_id || !title || !content) {
    return res.cc('user_id、title 和 content 均为必填项，不能为空！')
  }

  // 确保 content 是 JSON 字符串
  const contentString = JSON.stringify(content);

  //定义sql语句
  const sqlStr = 'INSERT INTO surveys (user_id, title, content) VALUES (?, ?, ?)';
  db.query(sqlStr, [user_id, title, contentString], (err, results) => {
    if (err) return res.cc(err)
    //判断影响行数是否为1
    if (results.affectedRows !== 1) return res.cc('保存问卷失败！')
    //成功
    res.send({
      status: 0,
      message: '保存问卷成功',
      id: results.insertId
    })
  })
}



// 删除问卷
exports.deleteSurvey = (req, res) => {
  // 获取请求参数
  const id = req.body.id;

  // 检查 id 是否为空
  if (!id) {
    return res.cc('问卷 ID 不能为空！');
  }

  // 定义 SQL 语句
  const sqlStr = 'UPDATE surveys SET is_deleted = ? WHERE id = ?';
  db.query(sqlStr, [1, id], (err, results) => {
    if (err) return res.cc(err);
    // 判断影响行数是否为 1
    if (results.affectedRows !== 1) return res.cc('删除问卷失败！');
    // 成功
    res.cc('删除问卷成功！', 0);
  });
};



// 根据用户id获取问卷列表
exports.getSurveyList = (req, res) => {
  // 定义 SQL 语句
  const sqlStr = 'SELECT id, title, content, created_at,viewCount, shareCount FROM surveys WHERE is_deleted = ? and user_id=? ORDER BY created_at DESC';
  db.query(sqlStr, [0, req.query.user_id], (err, results) => {
    if (err) return res.cc(err);
    // 成功
    res.send({
      status: 0,
      message: '获取问卷列表成功！',
      data: results,
    });
  });
};

//获取所有推送问卷列表
exports.getPushSurveyList = (req, res) => {
  // 定义 SQL 语句
  const sqlStr = `
  SELECT s.id, s.user_id, s.title, s.content, s.created_at, s.viewCount, s.shareCount, u.username AS ownerName
  FROM surveys s
  JOIN ev_users u ON s.user_id = u.id
  WHERE s.is_deleted = 0 AND s.is_post = 1
  ORDER BY s.created_at DESC
`;

  db.query(sqlStr, (err, results) => {
    if (err) return res.cc(err);
    // 成功
    res.send({
      status: 0,
      message: '获取问卷列表成功！',
      data: results,
    });
  });
};

//更新问卷内容
exports.updateSurvey = (req, res) => {
  const { title, content, id } = req.body;

  if (!id || !title || !content) {
    return res.cc('问卷ID、标题和内容均为必填项！');
  }

  const contentString = JSON.stringify(content);

  //sql语句
  const sqlStr = 'update surveys set title = ?, content = ? where id = ?'
  db.query(sqlStr, [title, contentString, id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) {
      return res.cc('修改问卷失败！');
    }

    //更新成功
    res.send({
      status: 0,
      message: '修改问卷成功',
    });
  });
};

//根据id获取问卷内容
exports.getContent = (req, res) => {
  const userId = req.auth.id;
  if (!req.query.id) return res.cc('id不能为空！')

  //sql语句
  const sql = 'select title, content, created_at, is_post from surveys where id = ? and user_id = ? and is_deleted = 0'
  db.query(sql, [req.query.id, userId], (err, results) => {
    if (err) return res.cc(err);
    if (results.length === 0) return res.cc('无权限访问该问卷', 403);
    //获取成功
    res.send({
      status: 0,
      message: '获取问卷内容成功!',
      data: results[0]
    })
  })
}


//根据id获取问卷内容（无需权限）
exports.getShareContent = (req, res) => {
  if (!req.query.id) return res.cc('id不能为空！')

  //sql语句
  const sql = 'select title, content, created_at from surveys where id = ? and is_deleted = 0 and is_post = 1'
  db.query(sql, req.query.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length === 0) return res.cc('非共享问卷无法访问！')
    //获取成功
    res.send({
      status: 0,
      message: '获取问卷内容成功!',
      data: results[0]
    })
  })
}


//获取项目热门程度
exports.getSurveyPopular = (req, res) => {
  const user_Id = req.body.user_id || req.query.user_id || req.params.user_id;
  if (!user_Id) {
    return res.cc('获取用户id失败!');
  }
  const sql = `SELECT id, title, viewCount, shareCount FROM surveys WHERE user_id = ? and is_deleted = 0`
  db.query(sql, user_Id, (err, results) => {
    if (err) return res.cc(err);

    //成功
    res.send({
      status: 0,
      message: '获取问卷热门程度成功!',
      data: results
    })
  })
}


//修改热门数据
exports.addviewCount = (req, res) => {
  const id = req.body.id || req.query.id || req.params.id;
  if (!id) return res.cc('获取问卷id失败!');

  const sql = 'update surveys set viewCount = viewCount + 1 where id = ?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) {
      return res.cc('更新浏览次数失败！')
    }
    //成功
    res.send({
      status: 0,
      message: '更新浏览次数成功!',
    })
  })
}

exports.addshareCount = (req, res) => {
  const id = req.body.id;
  if (!id) return res.cc('获取问卷id失败!');

  const sql = 'update surveys set shareCount = shareCount + 1 where id = ?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) {
      return res.cc('更新分享次数失败！')
    }
    //成功
    res.send({
      status: 0,
      message: '更新分享次数成功!',
    })
  })
}

//推送问卷
exports.surveyPush = (req, res) => {
  const id = req.body.id;
  if (!id) return res.cc('获取问卷id失败!');
  const sql = 'update surveys set is_post = 1 where id = ?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) {
      return res.cc('推送失败!')
    };
    //成功
    res.send({
      status: 0,
      message: '推送成功!'
    })
  })
}


//根据id获取问卷名
exports.getSurveyTitle = (req, res) => {
  const survey_id = req.query.survey_id;
  if (!survey_id) return res.cc('获取问卷id失败!')

  //sql语句
  const sql = 'select title from surveys where id = ? and is_deleted = 0'
  db.query(sql, survey_id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length === 0) {
      return res.cc('问卷已删除')
    };
    //成功
    res.send({
      status: 0,
      message: '获取问卷名成功!',
      data: results[0]
    })
  })
}
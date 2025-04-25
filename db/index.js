const mysql = require('mysql2');

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '20051204pyq.',
  database: 'my_db_01'
})


module.exports = db; //导出数据库连接池对象
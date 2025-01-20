// db-init.js
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '.env.production')
});

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

const sqlFilePath = path.resolve(__dirname, 'src', 'db', 'db_init.sql');
const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');

connection.connect((err) => {
  if (err) {
    console.error('数据库连接失败:', err);
    return;
  }

  console.log('成功连接到数据库');

  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error('执行 SQL 失败:', err);
    } else {
      console.log('SQL 执行成功:', results);
    }

    // 关闭数据库连接
    connection.end();
  });
});
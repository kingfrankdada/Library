const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const WebSocket = require('ws');
const system = require('systeminformation');
const schedule = require('node-schedule');

const app = express();
const port = 3000;
const wsport = 8081;
const saltRounds = 10;

app.use(cors());
app.use(bodyParser.json());

// MySQL 数据库连接
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'library'
});

// 初始化数据库连接
connection.connect(err => {
  if (err) {
    console.error('数据库连接失败:', err.stack);
    return;
  }
  console.log('数据库连接成功');
});

// 在线用户列表
let onlineUsers = new Set();

// WebSocket 服务器
const wss = new WebSocket.Server({
  noServer: true
});

// 处理 WebSocket 连接
wss.on('connection', (ws) => {
  onlineUsers.add(ws);
  console.log(`新用户连接，当前在线用户数: ${onlineUsers.size}`);

  broadcastOnlineUsers();

  ws.on('message', (message) => {
    console.log(`收到消息: ${message}`);
  });

  ws.on('close', () => {
    onlineUsers.delete(ws);
    console.log(`用户断开连接，当前在线用户数: ${onlineUsers.size}`);
    broadcastOnlineUsers();
  });
});

// 广播在线用户数
function broadcastOnlineUsers() {
  const onlineUserCount = onlineUsers.size;
  const message = JSON.stringify({
    type: 'onlineUserCount',
    count: onlineUserCount
  });
  onlineUsers.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}

// 将 WebSocket 服务器与 HTTP 服务器连接
const server = app.listen(wsport, () => {
  console.log(`WebSocket服务正在监听 http://localhost:${wsport}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// 获取系统信息的api
app.get('/api/systemInfo', async (req, res) => {
  try {
    const cpuInfo = await system.cpu();
    const cpuLoad = await system.currentLoad();
    const memoryUsage = await system.mem();
    const systemInfo = {
      cpuUsage: {
        brand: cpuInfo.brand || "暂无数据",
        speed: cpuInfo.speed || "暂无数据",
        usedPercentage: cpuLoad.currentLoad.toFixed(2),
      },
      memoryUsage: {
        totalMemory: memoryUsage.total || "暂无数据",
        usedMemory: memoryUsage.used || "暂无数据",
        usedPercentage: ((memoryUsage.used / memoryUsage.total) * 100).toFixed(2),
      },
    };
    res.json(systemInfo);
  } catch (error) {
    console.error("获取系统信息失败:", error);
    res.status(500).json({
      error: "获取系统信息失败"
    });
  }
});

// 获取历史在线人数api
app.get('/api/selectDailyUser', (req, res) => {
  const query = 'SELECT * FROM daily_user';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('查询失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    res.json({
      message: '查询成功',
      dailyUser: results
    });
  });
});

// 定时任务：每天中午12点插入当日在线人数
schedule.scheduleJob('0 12 * * *', () => {
  logOnlineUsers();
});

// 查询当天数据，如果没有则写入 0
function logOnlineUsers() {
  const today = new Date();
  const sysDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  // 查询当天是否已有数据
  const query = 'SELECT * FROM daily_user WHERE sys_date = ?';
  connection.query(query, [sysDate], (err, results) => {
    if (err) {
      console.error('查询每日记录失败:', err.stack);
      return;
    }
    // 如果当天没有记录，插入默认数据
    if (results.length === 0) {
      const onlineUserCount = onlineUsers.size || 0; // 获取当前在线人数，如果没有在线则为 0
      const query = 'INSERT INTO daily_user (sys_date, user_count) VALUES (?, ?)';
      connection.query(query, [sysDate, onlineUserCount], (insertErr) => {
        if (insertErr) {
          console.error('插入每日记录失败:', insertErr.stack);
        } else {
          console.log(`已插入当日(${sysDate})在线人数: ${onlineUserCount}`);
        }
      });
    } else {
      console.log(`当日(${sysDate})已有记录，不插入数据`);
    }
  });
}

// 登录请求api
app.post('/api/login', (req, res) => {
  const {
    username,
    password
  } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      error: '用户名和密码不能为空'
    });
  }
  const query = 'SELECT * FROM user WHERE username = ?';
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('查询失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    if (results.length > 0) {
      const user = results[0];
      // 哈希验证
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error('密码验证失败:', err.stack);
          return res.status(500).json({
            error: '服务器内部错误'
          });
        }
        if (result) {
          userState = user.state;
          if (userState === 0) {
            return res.status(401).json({
              error: '用户已被封禁'
            });
          } else {
            // 使用 bcrypt.hashSync() 方法来添加时间戳生成唯一用户token
            const usertoken = bcrypt.hashSync(Date.now().toString(), saltRounds);
            res.status(200).json({
              message: '登录成功',
              username: user.username,
              usertoken: usertoken,
            });
          }
        } else {
          return res.status(401).json({
            error: '用户名或密码错误'
          });
        }
      });
    } else {
      // 用户名不存在
      return res.status(401).json({
        error: '用户名或密码错误'
      });
    }
  });
});

// 注册请求api
app.post('/api/reg', (req, res) => {
  let {
    username,
    password,
    email,
    creditCount,
    state,
    adddate
  } = req.body;
  // 后端数据二次验证
  if (!username || !password) {
    return res.status(400).json({
      error: '用户名和密码不能为空'
    });
  } else if (!email) {
    return res.status(400).json({
      error: '邮箱不能为空'
    });
  }

  // 用户密码进行哈希处理
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error('哈希加密失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    const query = 'INSERT INTO user (username, password, email, credit_count, state, adddate) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [username, hash, email, creditCount, state, adddate], (err, results) => {
      if (results) {
        // 使用 bcrypt.hashSync() 方法来添加时间戳生成唯一用户token
        const usertoken = bcrypt.hashSync(Date.now().toString(), saltRounds);
        res.status(200).json({
          message: '注册成功',
          username: username,
          usertoken: usertoken
        });
      } else if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({
            error: '用户名或邮箱已存在，请选择其他用户名或邮箱'
          });
        } else {
          console.error('插入失败:', err.stack);
          return res.status(500).json({
            error: '服务器内部错误'
          });
        }
      }
    });
  });
});

// 查找用户api
app.get('/api/selectUser', (req, res) => {
  const query = 'SELECT * FROM user';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('查询失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    if (results.length > 0) {
      res.status(200).json({
        message: '查询成功',
        users: results
      });
    } else {
      res.status(404).json({
        error: '未找到用户记录'
      });
    }
  });
});

// 按用户名查找用户api
app.get('/api/selectUser/:username', (req, res) => {
  const username = req.params.username;
  const query = 'SELECT * FROM user WHERE username = ?';
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('查询失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    if (results.length > 0) {
      res.status(200).json({
        message: '查询成功',
        users: results
      });
    } else {
      res.status(404).json({
        error: '未找到用户记录'
      });
    }
  });
});

// 更新用户api
app.post('/api/updateUser/:id', (req, res) => {
  const userId = req.params.id;
  let userState = req.body;
  const query = 'UPDATE user SET ? WHERE id = ?';
  connection.query(query, [userState, userId], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      message: '用户信息更新成功'
    });
  });
});

// 重置密码api
app.post('/api/resetPassword/:id', async (req, res) => {
  let user = req.body;
  const selectQuery = 'SELECT password FROM user WHERE id = ?';
  connection.query(selectQuery, [user.id], async (err, results) => {
    if (err) {
      console.error('查询失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    if (results.length > 0) {
      const returnUser = results[0];
      // 哈希验证
      bcrypt.compare(user.oldPassword, returnUser.password, async (err, result) => {
        if (err) {
          console.error('密码验证失败:', err.stack);
          return res.status(500).json({
            error: '服务器内部错误'
          });
        }
        if (!result) {
          return res.status(401).json({
            error: '旧密码不正确'
          });
        }
        // 哈希加密
        if (user.password) {
          try {
            user.password = await bcrypt.hash(user.password, 10);
          } catch (error) {
            return res.status(500).json({
              error: '密码加密失败'
            });
          }
        }
        const query = 'UPDATE user SET password = ? WHERE id = ?';
        const values = [user.password, user.id];
        connection.query(query, values, (err, results) => {
          if (err) {
            return res.status(500).json({
              error: err.message
            });
          }
          res.json({
            message: '用户信息更新成功'
          });
        });
      });
    } else {
      return res.status(404).json({
        error: '用户不存在'
      });
    }
  });
});

// 删除用户api
app.post('/api/delUser/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM user WHERE id = ?';
  connection.query(query, [userId], (err) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      message: '用户信息删除成功'
    });
  });
});

// 图书查询api
app.get('/api/selectBook', (req, res) => {
  const query = 'SELECT * FROM book';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('查询失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    if (results.length > 0) {
      res.status(200).json({
        message: '查询成功',
        books: results
      });
    } else {
      res.status(404).json({
        error: '未找到图书记录'
      });
    }
  });
});

// 更新图书api
app.post('/api/updateBook/:id', (req, res) => {
  const bookId = req.params.id;
  let bookData = req.body;
  const query = 'UPDATE book SET ? WHERE id = ?';
  connection.query(query, [bookData, bookId], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      message: '图书信息更新成功'
    });
  });
});

// 分类标题查询api
app.get('/api/menuTitles', (req, res) => {
  const query = 'SELECT title FROM menu';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      titles: results.map(row => row.title)
    });
  });
});

// 添加图书 API
app.post('/api/addBook', (req, res) => {
  const newBook = req.body;
  const query = 'INSERT INTO book (name, author, menu, price, press, num, img, info, state, adddate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [newBook.name, newBook.author, newBook.menu, newBook.price, newBook.press, newBook.num, newBook.img, newBook.info, newBook.state, newBook.adddate];
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('添加图书失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    res.json({
      message: '图书添加成功',
      bookId: results.insertId
    });
  });
});

// 上传图片
const multer = require('multer');
const path = require('path');
// 设置 multer 存储配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/assets/img'));
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.originalname}`;
    cb(null, fileName);
  }
});

const upload = multer({
  storage
});

// 添加图片api
app.post('/api/uploadImage', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: '文件上传失败'
    });
  }
  res.json({
    message: '文件上传成功',
    fileName: req.file.filename
  });
});

// 删除图书api
app.post('/api/delBook/:id', (req, res) => {
  const bookId = req.params.id;
  // let bookData = req.body;
  const query = 'DELETE FROM book WHERE id = ?';
  connection.query(query, [bookId], (err) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      message: '图书信息删除成功'
    });
  });
});

// 添加分类 API
app.post('/api/addMenu', (req, res) => {
  const newMenu = req.body;
  const query = 'INSERT INTO menu (title, state) VALUES (?, ?)';
  const values = [newMenu.title, newMenu.state];
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('添加分类失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    res.json({
      message: '分类添加成功',
      menuId: results.insertId
    });
  });
});

// 分类查询api
app.get('/api/selectMenu', (req, res) => {
  const query = 'SELECT * FROM menu';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('查询失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    if (results.length > 0) {
      res.status(200).json({
        message: '查询成功',
        menus: results
      });
    } else {
      res.status(404).json({
        error: '未找到分类记录'
      });
    }
  });
});

// 更新分类api
app.post('/api/updateMenu/:id', (req, res) => {
  const menuId = req.params.id;
  let menuData = req.body;
  const query = 'UPDATE menu SET ? WHERE id = ?';
  connection.query(query, [menuData, menuId], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      message: '分类信息更新成功'
    });
  });
});

// 删除分类api
app.post('/api/delMenu/:id', (req, res) => {
  const menuId = req.params.id;
  const query = 'DELETE FROM menu WHERE id = ?';
  connection.query(query, [menuId], (err) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      message: '分类信息删除成功'
    });
  });
});

// 添加公告api
app.post('/api/addNotice', (req, res) => {
  const newNotice = req.body;
  const query = 'INSERT INTO notice (title, info, adduser, adddate, top) VALUES (?, ?, ?, ?, ?)';
  const values = [newNotice.title, newNotice.info, newNotice.adduser, newNotice.adddate, newNotice.top];
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('添加公告失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    res.json({
      message: '公告添加成功',
      noticeId: results.insertId
    });
  });
});

// 公告查询api
app.get('/api/selectNotice', (req, res) => {
  const query = 'SELECT * FROM notice';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('查询失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    if (results.length > 0) {
      res.status(200).json({
        message: '查询成功',
        notice: results
      });
    } else {
      res.status(404).json({
        error: '未找到公告记录'
      });
    }
  });
});

// 更新公告api
app.post('/api/updateNotice/:id', (req, res) => {
  const noticeId = req.params.id;
  let noticeData = req.body;
  const query = 'UPDATE notice SET ? WHERE id = ?';
  connection.query(query, [noticeData, noticeId], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      message: '公告信息更新成功'
    });
  });
});

// 删除公告api
app.post('/api/delNotice/:id', (req, res) => {
  const noticeId = req.params.id;
  const query = 'DELETE FROM notice WHERE id = ?';
  connection.query(query, [noticeId], (err) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      message: '公告信息删除成功'
    });
  });
});

// 添加论坛留言api
app.post('/api/addMessage', (req, res) => {
  const newMessage = req.body;
  const query = 'INSERT INTO message (title, info, adduser, adddate, views, likes) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [newMessage.title, newMessage.info, newMessage.adduser, newMessage.adddate, newMessage.views, newMessage.likes];
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('添加论坛留言失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    res.json({
      message: '论坛留言添加成功',
      messageId: results.insertId
    });
  });
});

// 论坛留言查询api
app.get('/api/selectMessage', (req, res) => {
  const query = 'SELECT * FROM message';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('查询失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    if (results.length > 0) {
      res.status(200).json({
        message: '查询成功',
        message: results
      });
    } else {
      res.status(404).json({
        error: '未找到论坛留言记录'
      });
    }
  });
});

// 按用户名查询论坛留言api
app.get('/api/selectMessage/:username', (req, res) => {
  const username = req.params.username;
  const query = 'SELECT * FROM message WHERE adduser = ?';
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('查询失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    res.json({
      message: '查询成功',
      message: results
    });
  });
});

// 更新论坛留言api
app.post('/api/updateMessage/:id', (req, res) => {
  const messageId = req.params.id;
  let messageData = req.body;
  const query = 'UPDATE message SET ? WHERE id = ?';
  connection.query(query, [messageData, messageId], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      message: '论坛留言信息更新成功'
    });
  });
});

// 删除论坛留言api
app.post('/api/delMessage/:id', (req, res) => {
  const messageId = req.params.id;
  const query = 'DELETE FROM message WHERE id = ?';
  connection.query(query, [messageId], (err) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      message: '论坛留言信息删除成功'
    });
  });
});

// 添加收藏api
app.post('/api/addFavorite', (req, res) => {
  const newFavorite = req.body;
  const query = 'INSERT INTO favorite (name, user, author, menu, price, press, num, img, info, state, adddate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [newFavorite.name, newFavorite.user, newFavorite.author, newFavorite.menu, newFavorite.price, newFavorite.press, newFavorite.num, newFavorite.img, newFavorite.info, newFavorite.state, newFavorite.adddate];
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('添加收藏失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    res.json({
      message: '收藏添加成功',
      FavoriteId: results.insertId
    });
  });
});

// 按用户名查询收藏api
app.get('/api/selectFavorite/:username', (req, res) => {
  const username = req.params.username;
  const query = 'SELECT * FROM favorite WHERE user = ?';
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('查询失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    res.json({
      message: '查询成功',
      favorite: results
    });
  });
});

// 检查指定书籍是否已收藏api
app.get('/api/checkFavorite', (req, res) => {
  const {
    bookName,
    user
  } = req.query;

  const query = 'SELECT * FROM favorite WHERE user = ? AND name = ?';
  connection.query(query, [user, bookName], (err, results) => {
    if (err) {
      console.error('查询失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }

    const isFavorited = results.length > 0;
    res.json({
      message: '查询成功',
      isFavorited: isFavorited
    });
  });
});


// 按用户名和图书删除收藏api
app.post('/api/delFavorite/:username/:book', (req, res) => {
  const username = req.params.username;
  const book = req.params.book;
  const query = 'DELETE FROM favorite WHERE user = ? AND name = ?';
  connection.query(query, [username, book], (err) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      message: '收藏信息删除成功'
    });
  });
});

// 管理员删除书籍时删除对应收藏书籍api
app.post('/api/delFavoriteByBookName/:bookName', (req, res) => {
  const bookName = req.params.bookName;
  const query = 'DELETE FROM favorite WHERE name = ?';

  connection.query(query, [bookName], (err, results) => {
    if (err) {
      console.error('删除收藏记录失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    res.json({
      message: '删除包含该书名的收藏记录成功'
    });
  });
});

// 添加日志api
app.post('/api/addLog', (req, res) => {
  const newLog = req.body;
  const query = 'INSERT INTO log (username, user_ip, type, info, credit_count, adddate) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [newLog.username, newLog.userIP, newLog.type, newLog.info, newLog.creditCount, newLog.adddate];
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('添加日志失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    res.json({
      message: '日志添加成功',
      logId: results.insertId
    });
  });
});

// 日志查询api
app.get('/api/selectLog', (req, res) => {
  const query = 'SELECT * FROM log';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('查询失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    if (results.length > 0) {
      res.status(200).json({
        message: '查询成功',
        log: results
      });
    } else {
      res.status(404).json({
        error: '未找到日志记录'
      });
    }
  });
});

// 按用户名查询日志api
app.get('/api/selectLog/:username', (req, res) => {
  const username = req.params.username;
  const query = 'SELECT * FROM log WHERE username = ?';
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('查询失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    res.json({
      message: '查询成功',
      log: results
    });
  });
});

// 更新日志api
app.post('/api/updateLog/:id', (req, res) => {
  const logId = req.params.id;
  let logData = req.body;
  const query = 'UPDATE log SET ? WHERE id = ?';
  connection.query(query, [logData, logId], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      message: '日志信息更新成功'
    });
  });
});

// 删除日志api
app.post('/api/delLog/:id', (req, res) => {
  const logId = req.params.id;
  const query = 'DELETE FROM log WHERE id = ?';
  connection.query(query, [logId], (err) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      message: '日志信息删除成功'
    });
  });
});

// 信誉分查询api
app.get('/api/selectCredit', (req, res) => {
  const query = 'SELECT * FROM credit';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('查询失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    if (results.length > 0) {
      res.status(200).json({
        message: '查询成功',
        credit: results
      });
    } else {
      res.status(404).json({
        error: '未找到日志记录'
      });
    }
  });
});

// 添加信誉分记录api
app.post('/api/addCredit', (req, res) => {
  const newCredit = req.body;
  const query = 'INSERT INTO credit (username, credit_count, info, adddate) VALUES (?, ?, ?, ?)';
  const values = [newCredit.username, newCredit.creditCount, newCredit.info, newCredit.adddate];
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('添加日志失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    res.json({
      message: '日志添加成功',
      creditId: results.insertId
    });
  });
});

// 删除信誉分api
app.post('/api/delCredit/:username', (req, res) => {
  const username = req.params.username;
  const query = 'DELETE FROM credit WHERE username = ?';
  connection.query(query, [username], (err) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      message: '信誉分信息删除成功'
    });
  });
});

app.listen(port, () => {
  console.log(`服务器正在监听 http://localhost:${port}`);
});
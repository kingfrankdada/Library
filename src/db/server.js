const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const WebSocket = require('ws');
const system = require('systeminformation');
const schedule = require('node-schedule'); // 定时任务

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
        brand: cpuInfo.brand,
        speed: cpuInfo.speed,
        usedPercentage: cpuLoad.currentLoad.toFixed(2),
      },
      memoryUsage: {
        totalMemory: memoryUsage.total,
        usedMemory: memoryUsage.used,
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
              userName: user.username,
              userToken: usertoken,
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
    email
  } = req.body;
  const state = 1; // 默认为1，封禁账户为0
  const adddate = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: undefined,
    minute: undefined,
    second: undefined
  });
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
    const query = 'INSERT INTO user (username, password, email, state, adddate) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [username, hash, email, state, adddate], (err, results) => {
      if (results) {
        // 使用 bcrypt.hashSync() 方法来添加时间戳生成唯一用户token
        const usertoken = bcrypt.hashSync(Date.now().toString(), saltRounds);
        res.status(200).json({
          message: '注册成功',
          userName: username,
          userToken: usertoken
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
  const query = 'INSERT INTO book (name, author, menu, price, press, num, img, more, state, adddate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [newBook.name, newBook.author, newBook.menu, newBook.price, newBook.press, newBook.num, newBook.img, newBook.more, newBook.state, newBook.adddate];
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

app.listen(port, () => {
  console.log(`服务器正在监听 http://localhost:${port}`);
});
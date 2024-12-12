const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const WebSocket = require('ws');
const system = require('systeminformation');
const schedule = require('node-schedule');
const os = require('os');

const app = express();
const port = 3000;
const wsport = 8081;
const saltRounds = 10;

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

app.use(cors());
app.use(bodyParser.json());

// MySQL 数据库连接
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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

// 获取用户IP的api
app.get("/api/getLocalIP", (req, res) => {
  const networkInterfaces = os.networkInterfaces();
  let localIP = "127.0.0.1";
  for (const iface in networkInterfaces) {
    for (const alias of networkInterfaces[iface]) {
      if (alias.family === "IPv4" && !alias.internal) {
        localIP = alias.address;
        break;
      }
    }
  }
  res.json({
    ip: localIP
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

// 每天中午12点插入当日在线人数，执行逾期检查
schedule.scheduleJob('0 12 * * *', () => {
  logOnlineUsers();
  dailyOverCheck();
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
              role: user.role
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
    role,
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
    const query = 'INSERT INTO user (username, password, role, email, credit_count, state, adddate) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [username, hash, role, email, creditCount, state, adddate], (err, results) => {
      if (results) {
        // 使用 bcrypt.hashSync() 方法来添加时间戳生成唯一用户token
        const usertoken = bcrypt.hashSync(Date.now().toString(), saltRounds);
        res.status(200).json({
          message: '注册成功',
          username: username,
          usertoken: usertoken,
          role: role
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

// 按书名或作者模糊查询图书api
app.get('/api/selectBook/:name', (req, res) => {
  const name = req.params.name;
  const query = 'SELECT * FROM book WHERE name LIKE ? OR author LIKE ?';
  connection.query(query, [`%${name}%`, `%${name}%`], (err, results) => {
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
    const ext = path.extname(file.originalname);
    const fileName = `${timestamp}${ext}`; // 使用时间戳和扩展名生成文件名
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

// 借阅api
app.post('/api/borrow', (req, res) => {
  const {
    username,
    bookname,
    start_date,
    over_date,
    days
  } = req.body;
  const adddate = new Date().toISOString().split('T')[0];
  const record_days = 1;
  const state = 1;

  // 查询是否已借阅此书且未归还
  const checkQuery = `
    SELECT * FROM record 
    WHERE username = ? AND bookname = ? AND return_date IS NULL
  `;
  connection.query(checkQuery, [username, bookname], (err, results) => {
    if (err) {
      console.error('检查借阅记录失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        error: '已借阅该书，请先归还后再借阅',
      });
    }

    // 插入借阅记录
    const insertQuery = `
      INSERT INTO record (username, bookname, start_date, over_date, days, record_days, state, adddate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [username, bookname, start_date, over_date, days, record_days, state, adddate];
    connection.query(insertQuery, values, (insertErr, insertResults) => {
      if (insertErr) {
        console.error('借阅失败:', insertErr.stack);
        return res.status(500).json({
          error: '服务器内部错误'
        });
      }

      // 更新图书表，将图书数量-1
      const updateBookQuery = 'UPDATE book SET num = num - 1 WHERE name = ?';
      connection.query(updateBookQuery, [bookname], (updateErr) => {
        if (updateErr) {
          console.error('更新图书数量失败:', updateErr.stack);
        }
      });

      res.json({
        message: '借阅成功',
        borrowId: insertResults.insertId,
      });
    });
  });
});

// 按用户名查询借阅记录api
app.get('/api/selectBorrow/:username', (req, res) => {
  const username = req.params.username;
  const query = 'SELECT * FROM record WHERE username = ?';
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('查询失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    res.json({
      message: '查询成功',
      record: results
    });
  });
});

// 查询所有借阅记录api
app.get('/api/selectBorrow', (req, res) => {
  const query = 'SELECT * FROM record';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('查询失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }
    res.json({
      message: '查询成功',
      record: results
    });
  });
});

// 更新借阅记录api
app.post('/api/updateBorrow/:id', (req, res) => {
  const recordId = req.params.id;
  let recordData = req.body;
  const query = 'UPDATE record SET ? WHERE id = ?';
  connection.query(query, [recordData, recordId], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      message: '借阅信息更新成功'
    });
  });
});

// 续借api
app.post('/api/renew', (req, res) => {
  const {
    username,
    bookname,
    start_date,
    over_date,
    days
  } = req.body;

  // 查询是否有未归还的借阅记录
  const checkQuery = `
    SELECT * FROM record 
    WHERE username = ? AND bookname = ? AND return_date IS NULL AND is_renew = 0
  `;
  connection.query(checkQuery, [username, bookname], (err, results) => {
    if (err) {
      console.error('查询借阅记录失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: '已经续借过该书，请先归还后再续借',
      });
    }

    const recordId = results[0].id; // 获取借阅记录ID

    // 更新借阅记录的日期信息
    const updateQuery = `
      UPDATE record
      SET start_date = ?, over_date = ?, days = days + ?, is_renew = 1, state = 1
      WHERE id = ?
    `;
    const values = [start_date, over_date, days, recordId];
    connection.query(updateQuery, values, (updateErr) => {
      if (updateErr) {
        console.error('续借失败:', updateErr.stack);
        return res.status(500).json({
          error: '服务器内部错误'
        });
      }

      // 返回续借成功信息
      res.json({
        message: '续借成功',
        recordId: recordId,
      });
    });
  });
});

// 删除借阅记录api
app.post('/api/delBorrow/:id', (req, res) => {
  const recordId = req.params.id;
  const query = 'DELETE FROM record WHERE id = ?';
  connection.query(query, [recordId], (err) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      message: '借阅信息删除成功'
    });
  });
});

// 归还api
app.post('/api/return', (req, res) => {
  const {
    id,
    username,
    bookname
  } = req.body;
  const return_date = new Date().toISOString().split('T')[0];

  // 查询借阅记录
  const selectQuery = `
    SELECT * FROM record 
    WHERE username = ? AND bookname = ? AND id = ? AND return_date IS NULL
  `;
  connection.query(selectQuery, [username, bookname, id], (err, results) => {
    if (err) {
      console.error('查询借阅记录失败:', err.stack);
      return res.status(500).json({
        error: '服务器内部错误'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: '未找到未归还的借阅记录'
      });
    }

    const {
      start_date,
      over_date
    } = results[0];

    // 计算实际借阅天数，确保至少为1天
    const record_days = Math.max(
      1,
      Math.ceil((new Date(return_date) - new Date(start_date)) / (1000 * 60 * 60 * 24))
    );

    // 计算逾期时间
    const overtime = Math.max(
      0,
      Math.ceil((new Date(return_date) - new Date(over_date)) / (1000 * 60 * 60 * 24))
    );

    // 计算信誉分变化（逾期一天扣5分）
    const credit_delta = 5 * overtime;

    // 更新借阅记录
    const updateQuery = `
      UPDATE record 
      SET return_date = ?, record_days = ?, overtime = ?, credit_delta = ?, state = 0
      WHERE username = ? AND id = ?
    `;
    connection.query(updateQuery, [return_date, record_days, overtime, credit_delta, username, id], (updateErr) => {
      if (updateErr) {
        console.error('归还失败:', updateErr.stack);
        return res.status(500).json({
          error: '归还失败'
        });
      }

      // 更新图书表
      const updateBookQuery = 'UPDATE book SET num = num + 1 WHERE name = ?';
      connection.query(updateBookQuery, [bookname], (bookErr) => {
        if (bookErr) {
          console.error('更新图书数量失败:', bookErr.stack);
          return res.status(500).json({
            error: '更新图书数量失败'
          });
        }
      });

      // 恢复用户信誉分
      const updateUserCreditQuery = `
        UPDATE user 
        SET credit_count = credit_count + ?
        WHERE username = ?
      `;
      connection.query(updateUserCreditQuery, [credit_delta, username], (creditErr) => {
        if (creditErr) {
          console.error('更新用户信誉分失败:', creditErr.stack);
          return res.status(500).json({
            error: '更新用户信誉分失败'
          });
        }

        // 插入信誉分变动记录
        const insertCreditQuery = `
          INSERT INTO credit (username, credit_count, info, adddate)
          VALUES (?, (SELECT credit_count FROM user WHERE username = ?), ?, ?)
        `;
        const creditInfo = `归还图书：${bookname}`;
        const insertValues = [username, username, creditInfo, return_date];
        connection.query(insertCreditQuery, insertValues, (insertErr) => {
          if (insertErr) {
            console.error('插入信誉分记录失败:', insertErr.stack);
            return res.status(500).json({
              error: '插入信誉分记录失败'
            });
          }
          res.json({
            message: '归还成功',
            credit_delta,
          });
        });
      });
    });
  });
});

function dailyOverCheck() {
  console.log("开始逾期检查...");
  const today = new Date().toISOString().split("T")[0];

  // 查询所有状态为 1 和 2 的借阅记录
  const fetchRecordsQuery = `
    SELECT id, start_date, username 
    FROM record 
    WHERE state IN (1, 2)
  `;
  connection.query(fetchRecordsQuery, (fetchErr, records) => {
    if (fetchErr) {
      console.error("查询借阅记录失败:", fetchErr.stack);
      return;
    }

    records.forEach((record) => {
      const {
        id,
        start_date
      } = record;

      // 计算借阅天数
      const record_days = Math.max(
        1,
        Math.ceil((new Date(today) - new Date(start_date)) / (1000 * 60 * 60 * 24))
      );

      const updateDaysQuery = `
        UPDATE record 
        SET record_days = ?
        WHERE id = ?
      `;
      connection.query(updateDaysQuery, [record_days, id], (updateErr) => {
        if (updateErr) {
          console.error(`更新 record_days 失败（ID: ${id}）:`, updateErr.stack);
        } else {
          console.log(`更新 record_days 成功（ID: ${id}, 借阅天数: ${record_days}）`);
        }
      });
    });

    performOverdueCheck(today);
  });
}

// 逾期检查
function performOverdueCheck(today) {
  const query = `
    SELECT r.id, r.over_date, r.last_penalty_date, r.username, r.credit_delta, u.credit_count
    FROM record r
    JOIN user u ON r.username = u.username
    WHERE r.return_date IS NULL AND r.over_date < ?
  `;
  connection.query(query, [today], (err, results) => {
    if (err) {
      console.error("查询逾期记录失败:", err.stack);
      return;
    }

    const userPenaltyMap = {};

    results.forEach((record) => {
      const {
        id,
        over_date,
        last_penalty_date,
        username,
        credit_delta,
        credit_count
      } = record;

      // 如果今天已经扣过分，跳过
      if (last_penalty_date === today) {
        console.log(`记录已扣分，跳过（记录ID: ${id}, 用户: ${username}）`);
        return;
      }

      const overtime = Math.ceil((new Date(today) - new Date(over_date)) / (1000 * 60 * 60 * 24));
      const new_credit_delta = 5 * overtime;

      if (!userPenaltyMap[username]) {
        // console.log("现在信誉分：" + credit_count),
        userPenaltyMap[username] = {
          originalCredit: credit_count + (results.filter(r => r.username === username).reduce((acc, r) => acc + (r.credit_delta || 0), 0)), // 恢复到扣分前的状态
          totalPenalty: 0,
        };
        // console.log("恢复后原始信誉分:" + userPenaltyMap[username].originalCredit);
      }

      // 累积新的扣分
      userPenaltyMap[username].totalPenalty += new_credit_delta;

      // 更新借阅记录
      const updateBorrowQuery = `
        UPDATE record 
        SET overtime = ?, credit_delta = ?, last_penalty_date = ?, state = 2
        WHERE id = ?
      `;
      connection.query(updateBorrowQuery, [overtime, new_credit_delta, today, id], (updateErr) => {
        if (updateErr) {
          console.error(`更新记录失败（ID: ${id}）:`, updateErr.stack);
          return;
        }
      });
    });

    // 更新用户总扣分并处理
    Object.keys(userPenaltyMap).forEach((username) => {
      const {
        originalCredit,
        totalPenalty
      } = userPenaltyMap[username];
      const updated_credit = Math.max(0, originalCredit - totalPenalty);

      // 更新用户信誉分
      const updateUserQuery = `
        UPDATE user 
        SET credit_count = ? 
        WHERE username = ?
      `;
      connection.query(updateUserQuery, [updated_credit, username], (userErr) => {
        if (userErr) {
          console.error(`更新用户信誉分失败（用户名: ${username}）:`, userErr.stack);
          return;
        }
        console.log(`更新用户信誉分成功（用户名: ${username}, 当前信誉分: ${updated_credit}）`);
      });

      // 插入信誉分记录
      const insertCreditLogQuery = `
        INSERT INTO credit (username, credit_count, info, adddate)
        VALUES (?, ?, ?, ?)
      `;
      const creditInfo = `借阅超期，扣除总共${totalPenalty}分（共逾期${totalPenalty / 5}天）`;
      const insertValues = [username, updated_credit, creditInfo, today];
      connection.query(insertCreditLogQuery, insertValues, (insertErr) => {
        if (insertErr) {
          console.error(`插入信誉分记录失败（用户名: ${username}）:`, insertErr.stack);
          return;
        }
        console.log(`插入信誉分记录成功（用户名: ${username}, 当前信誉分: ${updated_credit}）`);
      });
    });

    console.log("逾期检查完成,已更新" + results.length + "条记录");
  });
}

app.listen(port, () => {
  console.log(`服务器正在监听 http://localhost:${port}`);
  console.log('当前环境:', process.env.NODE_ENV);
  console.log('数据库配置:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
  });

  dailyOverCheck(); // 开发环境，启动时执行逾期检查
});
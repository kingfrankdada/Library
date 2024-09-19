const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const WebSocket = require('ws');
const os = require('os');
const si = require('systeminformation');

const app = express();
const port = 3000;
const wsport = 3001;
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
  // 新连接，添加用户
  onlineUsers.add(ws);
  console.log(`新用户连接，当前在线用户数: ${onlineUsers.size}`);

  // 向所有客户端广播当前在线用户数
  broadcastOnlineUsers();

  // 处理客户端消息
  ws.on('message', (message) => {
    console.log(`收到消息: ${message}`);
    // 根据需要处理消息
  });

  // 处理连接关闭
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

// 获取系统信息的 API
app.get('/api/systemInfo', async (req, res) => {
  try {
    // 获取 CPU 和内存信息
    const cpuInfo = await si.cpu(); // 获取 CPU 信息
    const cpuLoad = await si.currentLoad(); // 获取 CPU 当前负载（占用率）
    const memoryUsage = await si.mem(); // 获取内存信息

    const systemInfo = {
      cpuUsage: {
        brand: cpuInfo.brand, // CPU 类型
        speed: cpuInfo.speed, // CPU 速度
        load: cpuLoad.currentLoad.toFixed(2), // CPU 占用率
      },
      memoryUsage: {
        totalMemory: memoryUsage.total, // 总内存
        usedMemory: memoryUsage.used, // 已用内存
        usedPercentage: ((memoryUsage.used / memoryUsage.total) * 100).toFixed(2), // 内存占用率
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
          // 使用 bcrypt.hashSync() 方法来添加时间戳生成唯一用户token
          const usertoken = bcrypt.hashSync(Date.now().toString(), saltRounds);
          res.status(200).json({
            message: '登录成功',
            userName: user.username,
            userToken: usertoken
          });
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
        error: '未找到图书记录'
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

app.listen(port, () => {
  console.log(`服务器正在监听 http://localhost:${port}`);
});
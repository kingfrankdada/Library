# 高校图书管理系统

## 项目简介

本项目是一个基于 Vue2 和 Node.js 的高校图书管理系统，旨在为学校提供高效、便捷的图书管理与借阅功能。系统包括图书管理、用户管理、借阅管理、公告系统、论坛系统和日志系统等功能模块，并采用前后端分离架构进行开发。

该项目包含了以下模块：

- **图书管理**：提供图书的增、删、改、查功能。
- **用户管理**：支持用户信息管理、权限控制。
- **借阅管理**：实现图书借阅、归还和借阅记录查看。
- **公告系统**：管理员发布公告，用户查看公告。
- **论坛系统**：用户可在论坛中发布留言、评论和点赞。
- **日志管理**：记录系统操作日志，包括登陆，退出，注销，新增图书，借阅等。

## 项目设置

### 安装依赖

首先，确保你已安装 [Node.js](https://nodejs.org/) 和 [Yarn](https://yarnpkg.com/)。

- Node版本推荐：16.20.2
- Yarn版本推荐：1.22.22

然后在项目根目录下运行以下命令来安装依赖：

```bash
yarn install
```

### 启动开发服务器

运行以下命令启动开发服务器（包含Vue CLI 与 Node）：

```bash
yarn serve
```

### 启动后端服务器

本项目的后端部分使用 Node.js 实现，在[package.json](./package.json)已集成后端启动脚本，也可以通过以下命令单独启动后端服务器：

```bash
yarn start-server
```

### 生产构建

运行以下命令进行生产环境构建：

```bash
yarn build
```

运行以下命令使用Vue CLI进行生产环境构建（包含Node）：

```bash
yarn serve-prod
```

## 功能模块

- **图书管理**：提供图书的增、删、改、查功能。
- **用户管理**：支持用户信息管理、权限控制。
- **权限控制**：对账户进行角色划分，实现不同角色的权限控制。
- **图书搜索**：独立全站搜索功能，实现快速查找图书信息。
- **借阅管理**：用户可借阅、归还图书，管理员可查看借阅记录，手动维护借阅记录。
- **公告系统**：管理员发布公告，用户查看公告，可在发布新书时进行自动推送等。
- **论坛系统**：用户可在论坛中发布、评论和点赞。
- **日志管理**：超级管理员可查看系统操作日志，包含系统事件，用户操作等。管理员只能查看借阅记录。
- **i18n**：支持中文和英文语言切换。
- **夜间模式**：支持夜间模式。

## 运行环境和技术栈

- **前端**：
  - Vue.js + Remix Icon
- **后端**：
  - Node.js + Express
- **数据库**：
  - MySQL
- **开发工具**：
  - Webpack + Babel
  - ESLint + Prettier

## 环境变量

项目中使用 `.env` 文件管理不同环境的配置。请根据需求按配置下列环境：

- `.env.development`：开发环境配置。
- `.env.production`：生产环境配置。

这些文件包含了数据库连接信息等配置，确保在不同环境下正确运行。

### 示例 `.env.development` 配置

```plaintext
# .env.development

VUE_APP_API_BASE_URL=your_api_base_url

# Database configuration
DB_HOST=your_database_host
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
```

## 常见问题

### 1. **如何配置开发环境？**

- 安装 [Node.js](https://nodejs.org/) 和 [Yarn](https://yarnpkg.com/)
- 在项目根目录运行 `yarn install` 安装依赖
- 启动开发服务器 `yarn serve`
- 数据库初始化SQL文件可使用[db_init.sql](./src/db/db_init.sql)

### 2. **如何进行生产构建？**

- 运行 `yarn build` 打包项目，部署至生产服务器。

### 3. **如何配置数据库初始化？**

- 手动执行[db_init.sql](./src/db/db_init.sql), 或者在项目根目录运行 `yarn db-init` 初始化数据库。

### 4. **如何部署生产环境？**

- 安装说明将以 CentOS 7.6 为例，可根据实际情况进行调整

- 安装 `nodejs`

```bash
sudo curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs
```

- 安装 `yarn`

```bash
sudo npm install -g yarn
```

- 安装 `serve`

```bash
yarn global add serve
```

- (可选) 项目根目录`Library-main`安装依赖

```bash
yarn install
```

- (可选) 项目根目录 `Library-main` 先启动后端nodemon服务

```bash
yarn start-server-prod
```

- (可选) 生产环境目录 `dist` 启动前端生产环境

```bash
serve -s .
```

- (可选) 测试启动成功后将会看到如下（示例）

```plaintext
   ┌──────────────────────────────────────────┐
   │                                          │
   │   Serving!                               │
   │                                          │
   │   - Local:    http://localhost:3000      │
   │   - Network:  http://192.168.0.1:3000    │
   │                                          │
   └──────────────────────────────────────────┘
   ```

- 安装 `Nginx`

```bash
sudo yum install nginx
```

- 将 `dist` 目录或者您的生产环境目录放置于 `/var/www/` 目录下

- 修改Nginx配置文件 `nginx.conf`

```bash
sudo vim /etc/nginx/nginx.conf
```

- 示例Nginx配置文件 `nginx.conf` 部分：

```bash
# nginx.conf (Part)
    server {
        listen       80;
        listen       [::]:80;
        server_name  your_server_name;  # 服务器IP地址或域名
        root         /var/www/dist/index.html; # 生产环境目录根页面文件

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
            proxy_pass http://127.0.0.1:3000;  # 这里的端口默认为前端3000端口
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # API路径配置代理
        location /api/ {
            proxy_pass http://127.0.0.1:3001;  # 这里的端口默认为后端3001端口
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
```

- 重启Nginx

```bash
sudo systemctl restart nginx
```

### 5. **如何部署系统服务？**

- 在 `/root` 下创建 [start-fullstack.sh](./start-fullstack.sh) 启动脚本（包含日志输出）

```sh
#!/bin/bash
# start-fullstack.sh

# 启动前端和后端服务
cd /root/Library-main
# 替换为实际node项目根目录
/usr/bin/yarn start-server-prod &

cd /var/www/dist
# 替换为实际生产环境目录
/usr/local/bin/serve -s . &

# 重启Nginx
sudo systemctl restart nginx

wait
```

- 为 `start-fullstack.sh` 添加执行权限

```bash
chmod +x start-fullstack.sh
```

- 创建 [start-fullstack.service](./start-fullstack.service) 服务文件

```bash
# start-fullstack.service

[Unit]
Description=Start Fullstack (Frontend and Backend) Library Servers
After=network.target

[Service]
Type=simple
ExecStart=/root/start-fullstack.sh # 替换为实际上述启动脚本路径
WorkingDirectory=/root # 替换为实际项目根目录
StandardOutput=journal # 可使用journalctl -u start-fullstack.service -f查看日志
StandardError=journal
Restart=always
Environment=PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin # 设置环境变量以及yarn路径
Environment=NODE_ENV=production
User=root

[Install]
WantedBy=multi-user.target
```

- 启动 `start-fullstack` 服务并执行状态检查

```bash
systemctl daemon-reload
systemctl start start-fullstack.service
systemctl status start-fullstack.service
```

- （可选）设置为开机自启动

```bash
sudo systemctl enable start-fullstack.service
```

## 开发日志

本项目开发日志，记录了项目的迭代过程和新增功能，帮助开发者了解项目的进展和历史。
详见 [开发日志](./note.md)

## License

本项目采用 [MIT License](./LICENSE)。

### 说明

- **项目简介**：简要介绍了项目的功能与背景，便于用户快速了解项目的目标和意义。
- **安装与开发流程**：提供了如何安装依赖、运行开发服务器以及生产构建的步骤，方便开发者快速开始开发。
- **功能模块**：详细列出了项目的各个功能模块，帮助开发者和用户了解项目组成。
- **开发日志**：记录了项目的迭代过程和新增功能，便于开发者了解项目的进展和历史。
- **常见问题**：提供了开发和生产环境中的常见问题解答，帮助新开发者快速上手。

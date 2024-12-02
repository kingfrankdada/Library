# 高校图书管理系统

## 项目简介

本项目是一个基于 Vue.js 和 Node.js 的高校图书管理系统，旨在为学校提供高效、便捷的图书管理与借阅功能。系统包括图书管理、用户管理、借阅管理、公告系统、论坛系统和日志系统等功能模块，并采用前后端分离架构进行开发。

## 项目设置

### 安装依赖

首先，确保你已安装 [Node.js](https://nodejs.org/) 和 [Yarn](https://yarnpkg.com/)，然后在项目根目录下运行以下命令来安装依赖：

```bash
yarn install
```

### 启动开发服务器

运行以下命令启动开发服务器:

```bash
yarn serve
```

## 功能模块

- **图书管理**：提供图书的增、删、改、查功能等。
- **用户管理**：支持用户信息管理、权限控制等。
- **权限控制**：对账户进行角色划分，实现不同角色的权限控制。
- **图书搜索**：独立全站搜索功能，实现快速查找图书信息。
- **借阅管理**：用户可借阅、归还图书，管理员可查看借阅记录，手动维护借阅记录等。
- **公告系统**：管理员发布公告，用户查看公告，可在发布新书的时候进行自动推送等。
- **论坛系统**：用户可在论坛中发布、评论和点赞。
- **日志管理**：超级管理员可查看系统操作日志，包含系统事件，用户操作等。

## 运行环境和技术栈

- **前端**：Vue.js + Vuex + Vue Router + Remix Icon
- **后端**：Node.js + Express
- **数据库**：MySQL

## 常见问题

1. **如何配置开发环境？**
   - 安装 [Node.js](https://nodejs.org/) 和 [Yarn](https://yarnpkg.com/)
   - 在项目根目录运行 `yarn install` 安装依赖
   - 启动开发服务器 `yarn serve`
   - 数据库初始化SQL文件 `src/db/init.sql`

2. **如何进行生产构建？**
   - 运行 `yarn build` 打包项目，部署至生产服务器。

3. **如何使用 ESLint？**
   - 运行 `yarn lint` 检查代码并修复格式问题。

## License

本项目采用 [MIT License](./LICENSE).

## 贡献者

感谢所有贡献者的支持与努力！

### 项目说明

1. **项目简介**：简要介绍了项目的背景和功能模块，便于其他开发者快速了解该项目的用途和功能。

2. **安装与开发流程**：明确了如何安装依赖、运行开发服务器以及构建生产版本的步骤。增强了文档的可操作性。

3. **功能模块**：列出了系统的主要功能模块，便于用户或开发者了解系统的组成部分。

4. **运行环境**：提到前端框架、后端技术栈以及使用的数据库，有助于开发人员在本地配置环境时参考。

5. **开发日志**：详情请移步至[开发日志](./note.md)。

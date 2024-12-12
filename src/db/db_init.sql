-- 高校图书管理系统 v1.0
-- 数据库初始化执行语句 
-- MySQL 8.0 DDL

-- 创建数据库
CREATE DATABASE IF NOT EXISTS library DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 创建表

-- 图书表 book
CREATE TABLE `book` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    `author` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    `menu` varchar(255) DEFAULT NULL,
    `price` float DEFAULT NULL,
    `press` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    `num` int DEFAULT NULL,
    `img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    `info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    `state` int DEFAULT NULL,
    `adddate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_book_menu` (`menu`),
    CONSTRAINT `fk_book_menu` FOREIGN KEY (`menu`) REFERENCES `menu` (`title`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 84 DEFAULT CHARSET = utf8mb4 COLLATE = ut8mb4_0900_ai_ci

-- 积分记录表 credit
CREATE TABLE `credit` (
    `id` int NOT NULL AUTO_INCREMENT,
    `username` varchar(255) DEFAULT NULL,
    `credit_count` int DEFAULT NULL,
    `info` varchar(255) DEFAULT NULL,
    `adddate` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_username` (`username`)
) ENGINE = InnoDB AUTO_INCREMENT = 74 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

-- 历史在线记录表 daily_user
CREATE TABLE `daily_user` (
    `id` int NOT NULL AUTO_INCREMENT,
    `sys_date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `user_count` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 86 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

-- 收藏表 favorite
CREATE TABLE `favorite` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    `user` varchar(255) DEFAULT NULL,
    `author` varchar(255) DEFAULT NULL,
    `menu` varchar(255) DEFAULT NULL,
    `price` float DEFAULT NULL,
    `press` varchar(255) DEFAULT NULL,
    `num` int DEFAULT NULL,
    `img` varchar(255) DEFAULT NULL,
    `info` text,
    `state` int DEFAULT NULL,
    `adddate` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 45 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

-- 日志表 log
CREATE TABLE `log` (
    `id` int NOT NULL AUTO_INCREMENT,
    `username` varchar(255) DEFAULT NULL,
    `user_ip` varchar(255) DEFAULT NULL,
    `type` varchar(255) DEFAULT NULL,
    `info` varchar(255) DEFAULT NULL,
    `credit_count` int DEFAULT NULL,
    `adddate` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 183 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

-- 分类表 menu
CREATE TABLE `menu` (
    `id` int NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `state` int NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `title` (`title`),
    UNIQUE KEY `title_2` (`title`)
) ENGINE = InnoDB AUTO_INCREMENT = 24 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

-- 论坛留言表 message
CREATE TABLE `message` (
    `id` int NOT NULL AUTO_INCREMENT,
    `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `info` mediumtext NOT NULL,
    `adduser` varchar(255) NOT NULL,
    `adddate` varchar(255) NOT NULL,
    `views` int NOT NULL,
    `likes` int NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 37 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

-- 系统公告表 notice
CREATE TABLE `notice` (
    `id` int NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `info` mediumtext NOT NULL,
    `adduser` varchar(255) NOT NULL,
    `adddate` varchar(255) NOT NULL,
    `top` int NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 59 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

-- 借阅表 record
CREATE TABLE `record` (
    `id` int NOT NULL AUTO_INCREMENT,
    `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    `bookname` varchar(255) DEFAULT NULL,
    `start_date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    `over_date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    `days` int DEFAULT NULL,
    `return_date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    `record_days` int DEFAULT NULL,
    `overtime` int DEFAULT NULL,
    `credit_delta` int DEFAULT NULL,
    `last_penalty_date` varchar(255) DEFAULT NULL,
    `state` int DEFAULT NULL,
    `is_renew` int DEFAULT '0',
    `adddate` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `userid` (`username`),
    KEY `book` (`bookname`),
    CONSTRAINT `record_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user` (`username`)
) ENGINE = InnoDB AUTO_INCREMENT = 73 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

-- 用户表 user
CREATE TABLE `user` (
    `id` int NOT NULL AUTO_INCREMENT,
    `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `credit_count` int DEFAULT NULL,
    `state` int DEFAULT NULL,
    `adddate` datetime DEFAULT NULL,
    `email` varchar(50) DEFAULT NULL,
    PRIMARY KEY (`id`, `username`),
    UNIQUE KEY `unique_username` (`username`),
    UNIQUE KEY `unique_email` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 75 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci
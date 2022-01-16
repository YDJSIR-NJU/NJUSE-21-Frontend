-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- 主机： db
-- 生成日期： 2021-12-12 10:14:37
-- 服务器版本： 8.0.1-dmr
-- PHP 版本： 7.4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `user_info`
--

-- --------------------------------------------------------

--
-- 表的结构 `base_info`
--

CREATE TABLE `base_info` (
  `username` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL,
  `email` varchar(256) NOT NULL,
  `hash` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL,
  `passwd` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL,
  `uid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 转存表中的数据 `base_info`
--

INSERT INTO `base_info` (`username`, `email`, `hash`, `passwd`, `uid`) VALUES
('ss1', 's@s', '3a8rg45ra6r3b7pfook7drari5a', '$2a$10$0Pmc7ycrdQ6xMtAorL5trOrCbO/EcPwrCn7GG9dXRGBIeo1Hpg2CG', 24),
('ss2', 's@s', '0dqeb4an58975ipeinl6agb0op6', '$2a$10$jn75rUEbH028JnUvG62mmeETXwfkGf0bmGnKaljt9qD6eClmRoAxa', 25),
('ss3', 's@s', '8grpcojmc6d0coc24p0nnqkberm', '$2a$10$2MGzOt1uPoL5wDClxISro.G3nKeCSniCvw0DO2jQ9sgIQm.x3dtke', 26);

--
-- 转储表的索引
--

--
-- 表的索引 `base_info`
--
ALTER TABLE `base_info`
  ADD PRIMARY KEY (`uid`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `base_info`
--
ALTER TABLE `base_info`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

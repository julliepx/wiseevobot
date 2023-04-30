CREATE DATABASE IF NOT EXISTS `wiserp` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `wiserp`;

CREATE TABLE IF NOT EXISTS `vrp_chests` (
  `permission` varchar(50) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `coordinates` text NOT NULL,
  `weight` int(11) NOT NULL DEFAULT 0,
  `webhook` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `vrp_estoque` (
  `vehicle` varchar(100) NOT NULL,
  `quantidade` int(11) NOT NULL DEFAULT 3,
  PRIMARY KEY (`vehicle`) USING BTREE,
  KEY `vehicle` (`vehicle`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `vrp_homes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT 'Homes0001',
  `interior` varchar(255) NOT NULL DEFAULT 'Middle',
  `user_id` int(11) NOT NULL DEFAULT 0,
  `price` int(11) NOT NULL DEFAULT 0,
  `residents` int(11) NOT NULL DEFAULT 1,
  `vault` int(11) NOT NULL DEFAULT 1,
  `owner` int(11) NOT NULL DEFAULT 0,
  `tax` int(11) NOT NULL DEFAULT 0,
  `contract` int(11) NOT NULL DEFAULT 0,
  `fridge` int(11) NOT NULL DEFAULT 25,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `vrp_infos` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `discord` varchar(50) NOT NULL DEFAULT '0',
  `steam` varchar(50) NOT NULL DEFAULT 'steam:000000000000',
  `whitelist` tinyint(1) NOT NULL DEFAULT 0,
  `playtime` int(20) NOT NULL DEFAULT 0,
  `ban_time` int(20) NOT NULL DEFAULT 0,
  `maintenance_access` tinyint(1) NOT NULL DEFAULT 0,
  `priority` int(11) NOT NULL DEFAULT 0,
  `initial_kit` tinyint(1) NOT NULL DEFAULT 0,
  `ip` varchar(20) NOT NULL DEFAULT '0.0.0.0',
  `gems` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE,
  KEY `whitelisted` (`whitelist`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `vrp_prison` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `nuser_id` int(11) NOT NULL DEFAULT 0,
  `date` varchar(25) NOT NULL DEFAULT '0.0.0',
  `price` int(11) NOT NULL DEFAULT 0,
  `text` text NOT NULL,
  `services` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `vrp_srv_data` (
  `dkey` varchar(100) NOT NULL,
  `dvalue` text DEFAULT NULL,
  PRIMARY KEY (`dkey`) USING BTREE,
  KEY `dkey` (`dkey`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `vrp_users` (
  `id` int(11) NOT NULL,
  `last_login` timestamp NOT NULL DEFAULT current_timestamp(),
  `discord` int(50) DEFAULT 0,
  `registration` varchar(20) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `name` varchar(50) NOT NULL DEFAULT 'Individuo',
  `name2` varchar(50) NOT NULL DEFAULT 'Indigente',
  `bank` int(11) NOT NULL DEFAULT 4500,
  `prison` int(11) NOT NULL DEFAULT 0,
  `kills` int(11) NOT NULL DEFAULT 0,
  `deaths` int(11) NOT NULL DEFAULT 0,
  `fines` int(11) NOT NULL DEFAULT 0,
  `xp` int(11) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL DEFAULT 1,
  KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `vrp_user_data` (
  `user_id` int(11) NOT NULL,
  `dkey` varchar(100) NOT NULL,
  `dvalue` text DEFAULT NULL,
  PRIMARY KEY (`user_id`,`dkey`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE,
  KEY `dkey` (`dkey`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `vrp_user_ids` (
  `identifier` varchar(100) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`identifier`) USING BTREE,
  KEY `fk_user_ids_users` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `vrp_vehicles` (
  `user_id` int(11) NOT NULL,
  `vehicle` varchar(100) NOT NULL,
  `plate` varchar(20) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `arrest` int(11) NOT NULL DEFAULT 0,
  `time` int(11) NOT NULL DEFAULT 0,
  `premiumtime` int(11) NOT NULL DEFAULT 0,
  `rentaltime` int(11) NOT NULL DEFAULT 0,
  `engine` int(11) NOT NULL DEFAULT 1000,
  `body` int(11) NOT NULL DEFAULT 1000,
  `fuel` int(11) NOT NULL DEFAULT 100,
  `work` varchar(10) NOT NULL DEFAULT 'false',
  `doors` varchar(254) NOT NULL DEFAULT '{}',
  `windows` varchar(254) NOT NULL DEFAULT '{}',
  `tyres` varchar(254) NOT NULL DEFAULT '{}',
  PRIMARY KEY (`user_id`,`vehicle`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE,
  KEY `vehicle` (`vehicle`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `vrp_walmart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` tinyint(4) NOT NULL,
  `item_id` varchar(25) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `shop` varchar(25) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `vrp_webhooks` (
  `name` varchar(25) NOT NULL,
  `webhook` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;
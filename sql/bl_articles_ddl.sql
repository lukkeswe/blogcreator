CREATE TABLE `bl_articles` (
  `user_id` varchar(6) NOT NULL,
  `bl_id` varchar(11) NOT NULL,
  `id` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `text` text,
  `src` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table to store the contents of all the articles.'
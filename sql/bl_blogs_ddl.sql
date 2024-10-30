CREATE TABLE `bl_blogs` (
  `user_id` varchar(6) NOT NULL,
  `bl_id` varchar(11) NOT NULL,
  `bl_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'No name' COMMENT 'Name of the blog'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
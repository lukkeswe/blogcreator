CREATE TABLE `bl_child_articles` (
  `bl_id` varchar(11) NOT NULL,
  `parent_article_id` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `text` text,
  `src` varchar(1000) DEFAULT NULL,
  `id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table to store the contents of the child artiles for flexarticle elements.'
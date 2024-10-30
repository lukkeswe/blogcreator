CREATE TABLE `bl_styles` (
  `bl_id` varchar(11) NOT NULL,
  `article_id` varchar(255) NOT NULL,
  `titleColour` varchar(255) DEFAULT NULL,
  `textColour` varchar(255) DEFAULT NULL,
  `backgroundColor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `titleWeight` varchar(255) DEFAULT NULL,
  `textWeight` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table to store the style variables of all the articles.'
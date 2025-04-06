CREATE DATABASE `ai_task_manager_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
CREATE TABLE `suggestion` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Owner_ID` int NOT NULL,
  `Current_Suggestion` text NOT NULL,
  `Current_Alternative_Suggestion` text NOT NULL,
  `Current_Moti_Message` text NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `idx_suggestion_owner` (`Owner_ID`),
  CONSTRAINT `suggestion_ibfk_1` FOREIGN KEY (`Owner_ID`) REFERENCES `user` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `task` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Owner_ID` int NOT NULL,
  `Title` varchar(100) NOT NULL,
  `ETA_Time` varchar(10) NOT NULL,
  `Task_Type` enum('Mental','Physical','Creative') DEFAULT NULL,
  `Priority` enum('Critical','High','Normal','Low') NOT NULL,
  `Status` enum('Pending','Ongoing','Completed') NOT NULL,
  `Due_Date` datetime DEFAULT NULL,
  `Should_Notify` tinyint(1) NOT NULL DEFAULT '0',
  `Notify_When` enum('On Due Time','5 Minutes Before','30 Minutes Before','1 Hour Before') DEFAULT NULL,
  `Created_At` datetime DEFAULT CURRENT_TIMESTAMP,
  `Position` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `idx_task_owner` (`Owner_ID`),
  CONSTRAINT `task_ibfk_1` FOREIGN KEY (`Owner_ID`) REFERENCES `user` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `user` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `PassHash` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `user_data` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Owner_ID` int NOT NULL,
  `Current_Mood` enum('Happy','Calm','Focused','Anxious','Sad','Bored') NOT NULL,
  `Current_Energy` enum('High','Moderate','Low') NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `idx_user_data_owner` (`Owner_ID`),
  CONSTRAINT `user_data_ibfk_1` FOREIGN KEY (`Owner_ID`) REFERENCES `user` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `otp` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `User_ID` int NOT NULL,
  `OTP_Code` varchar(6) NOT NULL,
  `Purpose` enum('Registration','PasswordReset') NOT NULL,
  `Created_At` datetime DEFAULT CURRENT_TIMESTAMP,
  `Expires_At` datetime NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `idx_otp_user` (`User_ID`),
  CONSTRAINT `otp_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
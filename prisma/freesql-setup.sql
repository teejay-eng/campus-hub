-- Run once in FreeSQLDatabase phpMyAdmin (SQL tab).
-- Free hosting uses older MySQL; Prisma migrate/db push cannot run against it.
-- After this, deploy on Vercel (build only generates the client) and run: npm run db:seed

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `Grade`;
DROP TABLE IF EXISTS `Student`;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS `Hostel`;
DROP TABLE IF EXISTS `Event`;
DROP TABLE IF EXISTS `ReadingMaterial`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `User` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `role` ENUM('ADMIN', 'STUDENT') NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Hostel` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `location` VARCHAR(191) NOT NULL,
  `capacity` INT NOT NULL,
  `availableSpaces` INT NOT NULL,
  `gender` ENUM('MALE', 'FEMALE', 'MIXED') NOT NULL,
  `description` TEXT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Student` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `studentId` VARCHAR(191) NOT NULL,
  `fullName` VARCHAR(191) NOT NULL,
  `age` INT NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `school` VARCHAR(191) NOT NULL,
  `faculty` VARCHAR(191) NOT NULL,
  `course` VARCHAR(191) NOT NULL,
  `yearOfAdmission` INT NOT NULL,
  `hostelId` VARCHAR(191) NULL,
  `profileImage` VARCHAR(191) NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Student_userId_key` (`userId`),
  UNIQUE KEY `Student_studentId_key` (`studentId`),
  KEY `Student_hostelId_idx` (`hostelId`),
  CONSTRAINT `Student_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Student_hostelId_fkey` FOREIGN KEY (`hostelId`) REFERENCES `Hostel` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Event` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `date` DATE NOT NULL,
  `time` VARCHAR(191) NOT NULL,
  `venue` VARCHAR(191) NOT NULL,
  `image` VARCHAR(191) NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ReadingMaterial` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `course` VARCHAR(191) NOT NULL,
  `category` VARCHAR(191) NOT NULL,
  `fileUrl` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Grade` (
  `id` VARCHAR(191) NOT NULL,
  `studentId` VARCHAR(191) NOT NULL,
  `courseCode` VARCHAR(191) NOT NULL,
  `courseName` VARCHAR(191) NOT NULL,
  `semester` INT NOT NULL,
  `academicYear` VARCHAR(191) NOT NULL,
  `marks` INT NOT NULL,
  `grade` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Grade_studentId_idx` (`studentId`),
  CONSTRAINT `Grade_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

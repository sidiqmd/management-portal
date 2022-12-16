CREATE TABLE `user` (
    `user_id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255),
    `full_name` VARCHAR(255),
    `membership` ENUM('Premium','Normal') NOT NULL DEFAULT 'Normal',
    `refresh_token` VARCHAR(500),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL,
    PRIMARY KEY (`user_id`)
);

CREATE TABLE `category` (
    `category_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(500) NULL,
    `activated` tinyint(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL,
    PRIMARY KEY (`category_id`)
);

CREATE TABLE `post` (
    `post_id` INT NOT NULL AUTO_INCREMENT,
    `category_id` INT NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `body` TEXT NOT NULL,
    `status` ENUM('Draft','Published','Pending Review') NOT NULL DEFAULT 'Draft',
    `label` ENUM('Premium','Normal') NOT NULL DEFAULT 'Normal',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL,
    PRIMARY KEY (`post_id`),
    FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
);

CREATE TABLE `payment` (
    `payment_id` VARCHAR(255),
    `user_id` INT NOT NULL,
    `amount` DOUBLE NOT NULL DEFAULT '0.00',
    `payment_method` VARCHAR(255) NULL,
    `status` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL,
    PRIMARY KEY (`payment_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
);
-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 05, 2026 at 04:25 AM
-- Server version: 8.0.44-0ubuntu0.22.04.2
-- PHP Version: 8.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tshirt_store_node`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_number` varchar(255) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `shipping_address` text NOT NULL,
  `phone` varchar(255) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_number`, `total_price`, `shipping_address`, `phone`, `payment_method`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'ORD-AE954FA5-3', '799.00', 'sdfjiosj', '1657446897', 'UPI', 'cancelled', '2026-01-29 05:00:20', '2026-02-03 07:24:50'),
(2, 2, 'ORD-F9EAFBDE-C', '2417.00', 'sdjhfniuoy', '54168579746', 'UPI', 'pending', '2026-02-02 12:54:02', '2026-02-02 12:54:02'),
(3, 1, 'ORD-C79B535C-2', '4015.00', 'Modasa', '5484654689', 'UPI', 'processing', '2026-02-03 06:45:26', '2026-02-03 07:23:20'),
(6, 1, 'ORD-8A86F1A3-8', '3596.00', 'Modasa', '5484654689', 'Card', 'pending', '2026-02-03 11:31:53', '2026-02-03 11:31:53'),
(7, 1, 'ORD-8BD3D229-1', '2497.00', 'Modasa', '5484654689', 'card', 'shipped', '2026-02-04 04:51:33', '2026-02-04 08:58:40'),
(8, 1, 'ORD-AB3EDF0F-5', '2617.00', '187,Modasa\n', '7863078420', 'card', 'delivered', '2026-02-04 08:48:21', '2026-02-04 08:58:25');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `size` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `created_at`, `updated_at`, `size`) VALUES
(2, 2, 4, 1, '899.00', '2026-02-02 12:54:02', '2026-02-02 12:54:02', ''),
(3, 2, 5, 1, '799.00', '2026-02-02 12:54:02', '2026-02-02 12:54:02', ''),
(4, 2, 2, 1, '719.00', '2026-02-02 12:54:02', '2026-02-02 12:54:02', ''),
(5, 3, 3, 2, '799.00', '2026-02-03 06:45:26', '2026-02-03 06:45:26', ''),
(6, 3, 4, 1, '899.00', '2026-02-03 06:45:26', '2026-02-03 06:45:26', ''),
(7, 3, 11, 1, '799.00', '2026-02-03 06:45:26', '2026-02-03 06:45:26', ''),
(8, 3, 2, 1, '719.00', '2026-02-03 06:45:26', '2026-02-03 06:45:26', ''),
(13, 6, 12, 4, '899.00', '2026-02-03 11:31:53', '2026-02-03 11:31:53', ''),
(14, 7, 3, 2, '799.00', '2026-02-04 04:51:33', '2026-02-04 04:51:33', ''),
(15, 7, 4, 1, '899.00', '2026-02-04 04:51:33', '2026-02-04 04:51:33', ''),
(16, 8, 2, 1, '819.00', '2026-02-04 08:48:21', '2026-02-04 08:48:21', 'XL'),
(17, 8, 4, 2, '899.00', '2026-02-04 08:48:21', '2026-02-04 08:48:21', 'M');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'view-products', '2026-01-28 09:01:46', '2026-01-28 09:01:46'),
(2, 'create-products', '2026-01-28 09:01:46', '2026-01-28 09:01:46'),
(3, 'edit-products', '2026-01-28 09:01:46', '2026-01-28 09:01:46'),
(4, 'delete-products', '2026-01-28 09:01:46', '2026-01-28 09:01:46'),
(5, 'view-users', '2026-01-28 09:01:46', '2026-01-28 09:01:46'),
(6, 'delete-users', '2026-01-28 09:01:46', '2026-01-28 09:01:46'),
(7, 'update-permission', '2026-01-28 09:01:46', '2026-01-28 09:01:46'),
(8, 'view-dashboard', '2026-01-28 09:01:46', '2026-01-28 09:01:46'),
(9, 'view-analytics', '2026-01-28 09:01:46', '2026-01-28 09:01:46'),
(10, 'view-orders', '2026-01-28 09:01:46', '2026-01-28 09:01:46'),
(11, 'view-earnings', '2026-01-28 09:01:46', '2026-01-28 09:01:46'),
(12, 'add-to-cart', '2026-01-28 09:01:46', '2026-01-28 09:01:46'),
(13, 'checkout', '2026-01-28 09:01:46', '2026-01-28 09:01:46'),
(14, 'payment', '2026-01-28 09:01:46', '2026-01-28 09:01:46'),
(15, 'place-orders', '2026-01-28 09:01:46', '2026-01-28 09:01:46'),
(16, 'update-order-status', '2026-02-03 07:18:05', '2026-02-03 07:18:05');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount` decimal(5,2) DEFAULT '0.00',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `sizes` json NOT NULL,
  `size` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `url`, `price`, `discount`, `created_at`, `updated_at`, `sizes`, `size`) VALUES
(2, 'Thar Roxx T-Shirt', 'https://chriscross.in/cdn/shop/files/MahindraTharRoxxgreentshirt.jpg?v=1747661046&width=1000', '799.00', '10.00', '2026-02-02 09:53:56', '2026-02-02 12:28:44', 'null', ''),
(3, 'Yamaha RD350', 'https://chriscross.in/cdn/shop/files/ChrisCrossYamahaRD350blackcottontshirt.jpg?v=1740994644&width=1000', '799.00', '0.00', '2026-02-02 09:53:56', '2026-02-02 11:07:05', 'null', ''),
(4, 'Yamaha RD 350 Torque Induction Bikers T-Shirt', 'https://chriscross.in/cdn/shop/files/YamahaRD350bluetshirt_b18d3a40-8d58-4db5-b08b-36cab421fdf0.jpg?v=1740994650&width=1000', '899.00', '0.00', '2026-02-02 09:53:56', '2026-02-02 09:53:56', 'null', ''),
(5, 'Himalayan Spirit', 'https://chriscross.in/cdn/shop/files/RoyalEnfieldHimalayan450Tshirtblackcotton.jpg?v=1740994031&width=1000', '799.00', '0.00', '2026-02-02 09:53:56', '2026-02-02 09:53:56', 'null', ''),
(6, 'Suzuki Jimny T-Shirt', 'https://chriscross.in/cdn/shop/files/SuzukiJimnyTshirtBeigecottontshirtmens.jpg?v=1745402090&width=1000', '849.00', '0.00', '2026-02-02 09:53:56', '2026-02-02 09:53:56', 'null', ''),
(7, 'Yamaha RX100 T-Shirt', 'https://chriscross.in/cdn/shop/files/YamahaRX100ChrisCrossCottonTshirtBlack.jpg?v=1740994062&width=1000', '749.00', '0.00', '2026-02-02 09:53:56', '2026-02-02 09:53:56', 'null', ''),
(8, 'Classic Mercedes Benz T Shirt', 'https://chriscross.in/cdn/shop/files/ChrisCrossMercedesBenzClassic90stshirt.jpg?v=1740994620&width=1000', '699.00', '0.00', '2026-02-02 09:53:56', '2026-02-02 09:53:56', 'null', ''),
(9, 'Suzuki Jimny Oversized T-Shirt', 'https://chriscross.in/cdn/shop/files/JimnyOversizedT-shirtNavyblue.jpg?v=1748928220&width=600', '1299.00', '0.00', '2026-02-02 09:53:56', '2026-02-02 09:53:56', 'null', ''),
(10, 'Thar Roxx T-Shirt', 'https://chriscross.in/cdn/shop/files/MahindraTharRoxxgreentshirt.jpg?v=1747661046&width=1000', '799.00', '0.00', '2026-02-02 10:53:13', '2026-02-02 10:53:13', 'null', ''),
(11, 'Yamaha RD350 - The Original Superbike T-Shirt', 'https://chriscross.in/cdn/shop/files/ChrisCrossYamahaRD350blackcottontshirt.jpg?v=1740994644&width=1000', '799.00', '0.00', '2026-02-02 10:53:13', '2026-02-02 10:53:13', 'null', ''),
(12, 'Yamaha RD 350 Torque Induction Bikers T-Shirt', 'https://chriscross.in/cdn/shop/files/YamahaRD350bluetshirt_b18d3a40-8d58-4db5-b08b-36cab421fdf0.jpg?v=1740994650&width=1000', '899.00', '0.00', '2026-02-02 10:53:13', '2026-02-02 10:53:13', 'null', ''),
(13, 'Himalayan Spirit', 'https://chriscross.in/cdn/shop/files/RoyalEnfieldHimalayan450Tshirtblackcotton.jpg?v=1740994031&width=1000', '799.00', '0.00', '2026-02-02 10:53:13', '2026-02-02 10:53:13', 'null', ''),
(14, 'Suzuki Jimny T-Shirt', 'https://chriscross.in/cdn/shop/files/SuzukiJimnyTshirtBeigecottontshirtmens.jpg?v=1745402090&width=1000', '849.00', '0.00', '2026-02-02 10:53:13', '2026-02-02 10:53:13', 'null', ''),
(15, 'Yamaha RX100 T-Shirt', 'https://chriscross.in/cdn/shop/files/YamahaRX100ChrisCrossCottonTshirtBlack.jpg?v=1740994062&width=1000', '749.00', '0.00', '2026-02-02 10:53:13', '2026-02-02 10:53:13', 'null', ''),
(16, 'Classic Mercedes Benz T Shirt', 'https://chriscross.in/cdn/shop/files/ChrisCrossMercedesBenzClassic90stshirt.jpg?v=1740994620&width=1000', '699.00', '0.00', '2026-02-02 10:53:13', '2026-02-02 10:53:13', 'null', ''),
(17, 'Suzuki Jimny Oversized T-Shirt', 'https://chriscross.in/cdn/shop/files/JimnyOversizedT-shirtNavyblue.jpg?v=1748928220&width=600', '1299.00', '0.00', '2026-02-02 10:53:13', '2026-02-02 10:53:13', 'null', '');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'super-admin', '2026-01-28 09:01:46', '2026-01-28 09:01:46'),
(2, 'admin', '2026-01-28 09:01:46', '2026-01-28 09:01:46'),
(3, 'user', '2026-01-28 09:01:46', '2026-01-28 09:01:46');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`created_at`, `updated_at`, `role_id`, `permission_id`) VALUES
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 1, 1),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 1, 2),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 1, 3),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 1, 4),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 1, 5),
('2026-02-03 11:05:06', '2026-02-03 11:05:06', 1, 6),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 1, 7),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 1, 8),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 1, 9),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 1, 10),
('2026-02-04 09:50:07', '2026-02-04 09:50:07', 1, 11),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 1, 12),
('2026-02-04 09:49:57', '2026-02-04 09:49:57', 1, 13),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 1, 14),
('2026-02-03 07:18:05', '2026-02-03 07:18:05', 1, 16),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 2, 1),
('2026-02-03 12:53:49', '2026-02-03 12:53:49', 2, 2),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 2, 5),
('2026-02-03 12:55:11', '2026-02-03 12:55:11', 2, 6),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 2, 8),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 2, 9),
('2026-02-04 09:50:09', '2026-02-04 09:50:09', 2, 10),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 2, 12),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 2, 13),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 2, 14),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 2, 15),
('2026-02-03 07:18:05', '2026-02-03 07:18:05', 2, 16),
('2026-02-03 13:13:53', '2026-02-03 13:13:53', 3, 12),
('2026-02-04 09:49:58', '2026-02-04 09:49:58', 3, 13),
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 3, 14);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `phone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `resetPasswordToken`, `resetPasswordExpires`, `created_at`, `updated_at`, `phone`) VALUES
(1, 'Super Admin', 'patelsatya2804@gmail.com', '$2a$10$Inw./dhFRxBzFzVMzW7pg.g1hsDSqZ/QJNdKUZTGsXttDUM/wrmo2', NULL, NULL, '2026-01-28 09:01:46', '2026-01-28 09:01:46', NULL),
(2, 'Satya Patel', 'satyachopada284@gmail.com', '$2a$10$xRclVltbc3SO8FZ71eRjI.NAn8232T3lpDktCTm6nwiaEfUHbU2nO', NULL, NULL, '2026-02-02 12:53:16', '2026-02-02 12:53:16', NULL),
(5, 'akash', 'a@gmail.com', '$2a$10$VdyICu1LG93qVLboeJT.ge4L/jroIeDWLF9Zlx/snlt00k8a6iUOe', NULL, NULL, '2026-02-03 11:22:50', '2026-02-03 11:22:50', '1234567895'),
(6, 'kabir', 'k@gmail.com', '$2a$10$drpLVxFhZRlc2kbDLna2BOPblclZ8BJRNOriaXVRlnctPJ2OyseLC', NULL, NULL, '2026-02-03 11:28:18', '2026-02-03 11:28:18', '1425369610'),
(11, 'Dipesh', 'd@gmail.com', '$2a$10$Y4aXIH6gV7/RkBlkPDllseM9RPAzkVvIZVQScVHJuKznzNcweeX/.', NULL, NULL, '2026-02-03 12:38:16', '2026-02-03 12:38:16', '9685743625');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_id` int NOT NULL,
  `role_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`created_at`, `updated_at`, `user_id`, `role_id`) VALUES
('2026-01-28 09:01:46', '2026-01-28 09:01:46', 1, 1),
('2026-02-03 13:04:35', '2026-02-03 13:04:35', 2, 2),
('2026-02-03 12:51:04', '2026-02-03 12:51:04', 5, 2),
('2026-02-03 11:33:31', '2026-02-03 11:33:31', 6, 3),
('2026-02-03 12:38:16', '2026-02-03 12:38:16', 11, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD UNIQUE KEY `order_number_2` (`order_number`),
  ADD UNIQUE KEY `order_number_3` (`order_number`),
  ADD UNIQUE KEY `order_number_4` (`order_number`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_7` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_8` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

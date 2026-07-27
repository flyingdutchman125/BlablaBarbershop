CREATE DATABASE IF NOT EXISTS barbershop_db;
USE barbershop_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'cashier', 'admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  birth_date DATE,
  points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kapsters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  photo_url VARCHAR(255),
  status ENUM('active', 'inactive') DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_minutes INT NOT NULL,
  image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_code VARCHAR(50) NOT NULL UNIQUE,
  customer_id INT,
  kapster_id INT,
  service_id INT,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status ENUM('pending', 'checked_in', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (kapster_id) REFERENCES kapsters(id) ON DELETE SET NULL,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  receipt_number VARCHAR(50) NOT NULL UNIQUE,
  reservation_id INT,
  cashier_id INT,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('cash', 'qris', 'transfer', 'debit') NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL,
  change_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE SET NULL,
  FOREIGN KEY (cashier_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Seed Data
INSERT IGNORE INTO users (name, phone, password, role) VALUES 
('Admin Barbershop', '08111111111', '$2b$10$xyz', 'admin'),
('Kasir 1', '08222222222', '$2b$10$xyz', 'cashier'),
('Pelanggan Dummy', '08333333333', '$2b$10$xyz', 'customer');

INSERT IGNORE INTO kapsters (name, bio, photo_url, status) VALUES 
('Budi', 'Spesialis Fade dan Pompadour.', 'https://placehold.co/150/1e1e1e/d4af37?text=Budi', 'active'),
('Andi', 'Ahli Hair Tattoo dan Classic Cut.', 'https://placehold.co/150/1e1e1e/d4af37?text=Andi', 'active');

INSERT IGNORE INTO services (name, description, price, duration_minutes, image_url) VALUES 
('Premium Haircut', 'Potong rambut + Cuci + Styling dengan produk premium', 75000.00, 45, 'https://placehold.co/300/1e1e1e/d4af37?text=Premium+Cut'),
('Classic Shave', 'Cukur kumis & jenggot dengan handuk hangat', 50000.00, 30, 'https://placehold.co/300/1e1e1e/d4af37?text=Classic+Shave'),
('Hair Coloring', 'Pewarnaan rambut kualitas tinggi (Bleach & Color)', 250000.00, 120, 'https://placehold.co/300/1e1e1e/d4af37?text=Hair+Coloring'),
('Casual Service', 'Potong rambut casual standard', 25000.00, 30, 'https://placehold.co/300/1e1e1e/d4af37?text=Casual+Service'),
('Clean Service', 'Potong rambut clean cut, rapi dan segar', 30000.00, 35, 'https://placehold.co/300/1e1e1e/d4af37?text=Clean+Service'),
('Grooming Service', 'Potong rambut + cuci + massage + premium pomade', 50000.00, 45, 'https://placehold.co/300/1e1e1e/d4af37?text=Grooming+Service'),
('Registrasi Member', 'Pendaftaran member baru BLABLA BARBER', 100000.00, 0, 'https://placehold.co/300/1e1e1e/d4af37?text=Member');

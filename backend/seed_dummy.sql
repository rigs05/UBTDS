-- Prototype seed data for UBTDS (HQ/RC/Zone/Distributor + books and flows).

CREATE TABLE IF NOT EXISTS headquarters (
  id SERIAL PRIMARY KEY,
  name TEXT,
  location TEXT
);

CREATE TABLE IF NOT EXISTS regional_centers (
  id SERIAL PRIMARY KEY,
  code TEXT,
  location TEXT
);

CREATE TABLE IF NOT EXISTS zones (
  id SERIAL PRIMARY KEY,
  code TEXT,
  rc_code TEXT,
  location TEXT,
  hubs INT,
  distributor_code TEXT
);

CREATE TABLE IF NOT EXISTS distributors (
  id SERIAL PRIMARY KEY,
  code TEXT,
  zone_code TEXT,
  contact TEXT
);

CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  code TEXT,
  title TEXT,
  course TEXT,
  isbn TEXT,
  condition TEXT,
  is_used BOOLEAN,
  price NUMERIC
);

CREATE TABLE IF NOT EXISTS shipments (
  id SERIAL PRIMARY KEY,
  enrollment TEXT,
  status TEXT,
  current_stop TEXT,
  eta_days INT,
  rc_code TEXT,
  zone_code TEXT
);

CREATE TABLE IF NOT EXISTS bulk_requests (
  id SERIAL PRIMARY KEY,
  requestor TEXT,
  role TEXT,
  book_code TEXT,
  count INT,
  note TEXT,
  payment TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  enrollment TEXT,
  name TEXT,
  feedback_type TEXT,
  message TEXT,
  actor_role TEXT
);

INSERT INTO headquarters (name, location) VALUES
  ('IGNOU HQ', 'Maidan Garhi, Delhi');

INSERT INTO regional_centers (code, location) VALUES
  ('RC-01', 'North Delhi'),
  ('RC-02', 'Dwarka'),
  ('RC-03', 'Rohini');

INSERT INTO zones (code, rc_code, location, hubs, distributor_code) VALUES
  ('Z-05', 'RC-01', 'Connaught Place', 2, 'D-05'),
  ('Z-12', 'RC-02', 'South Delhi', 2, 'D-12'),
  ('Z-18', 'RC-03', 'Rohini Extension', 2, 'D-18'),
  ('Z-01', 'RC-01', 'North Campus', 2, 'D-01'),
  ('Z-03', 'RC-01', 'Model Town', 2, 'D-03'),
  ('Z-07', 'RC-02', 'Vasant Kunj', 2, 'D-07'),
  ('Z-10', 'RC-03', 'Dwarka', 2, 'D-10'),
  ('Z-15', 'RC-02', 'Saket', 2, 'D-15');

INSERT INTO distributors (code, zone_code, contact) VALUES
  ('D-05', 'Z-05', '+91-98765-00001'),
  ('D-12', 'Z-12', '+91-98765-00012'),
  ('D-18', 'Z-18', '+91-98765-00018'),
  ('D-01', 'Z-01', '+91-98765-00002'),
  ('D-03', 'Z-03', '+91-98765-00003'),
  ('D-07', 'Z-07', '+91-98765-00007'),
  ('D-10', 'Z-10', '+91-98765-00010'),
  ('D-15', 'Z-15', '+91-98765-00015');

INSERT INTO books (code, title, course, isbn, condition, is_used, price) VALUES
  ('BCS-011', 'Computer Basics', 'BCA', '978-81-237-0110-1', 'New', FALSE, 420),
  ('MCS-034', 'Data Structures', 'MCA_NEW', '978-81-237-0340-2', 'Good', TRUE, 280),
  ('BCSL-056', 'Network Lab Manual', 'BCA', '978-81-237-0560-5', 'New', FALSE, 360),
  ('MCS-011', 'Problem Solving & Programming', 'MCA_OL', '978-81-237-0111-2', 'Like New', TRUE, 300);

INSERT INTO shipments (enrollment, status, current_stop, eta_days, rc_code, zone_code) VALUES
  ('2201234567', 'Ready for Pickup', 'Hub H-44 (Janakpuri)', 1, 'RC-02', 'Z-12'),
  ('2202234567', 'In Transit', 'Zone Z-05', 2, 'RC-01', 'Z-05'),
  ('2203234567', 'Dispatched', 'Headquarters', 5, 'RC-03', 'Z-18');

INSERT INTO bulk_requests (requestor, role, book_code, count, note, payment, status) VALUES
  ('RC-01', 'RC_ADMIN', 'BCS-011', 120, 'Exam cycle Jan batch', 'PO', 'Requested'),
  ('HQ', 'ADMIN', 'MCS-034', 300, 'Reprint Delhi+Jaipur', 'NEFT', 'Queued for Print'),
  ('Distributor D-12', 'DISTRIBUTOR', 'BCSL-056', 45, 'Hub replenishment', 'UPI', 'In Transit');

INSERT INTO feedback (enrollment, name, feedback_type, message, actor_role) VALUES
  ('2201234567', 'Amit Sharma', 'Delivery', 'Pickup from Janakpuri hub confirmed.', 'STUDENT'),
  ('D-12', 'South Delhi Distributor', 'Stock', 'Need 40 copies of BCS-011.', 'DISTRIBUTOR');

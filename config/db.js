import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"12345678",
  database:"event_ticketing",
});
console.log("Database connected successfully");


console.log(await db.execute("SHOW DATABASES"));

 await db.execute("CREATE TABLE IF NOT EXISTS events (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(200) NOT NULL, description TEXT, event_date DATETIME NOT NULL, venue VARCHAR(200) NOT NULL, available_tickets INT NOT NULL, price DECIMAL(10, 2) NOT NULL)");

 const [rows] = await db.execute(
  "SELECT COUNT(*) AS count FROM events"
);


if (rows[0].count === 0) {
await db.execute("CREATE TABLE IF NOT EXISTS bookings (id INT AUTO_INCREMENT PRIMARY KEY, event_id INT NOT NULL, user_name VARCHAR(100) NOT NULL, user_email VARCHAR(100) NOT NULL, tickets_booked INT NOT NULL, booking_date DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (event_id) REFERENCES events(id))");

await db.execute(`
  insert into events (title, description, event_date, venue, available_tickets, price) values
  ('Tech fest 26','A grand tech festival showcasing the latest in technology and innovation.','2026-10-01 08:00:00','Main Auditorium',700,200),
  ('Coding Workshop','An interactive workshop for coding enthusiasts to enhance their skills.','2026-09-25 04:00:00','Seminar Hall',600,350),
  ('Music Night','An enchanting evening filled with live music performances.','2026-09-02 06:30:00','Football Ground',500,150),
  ('Cultural Fest','A celebration of diverse cultures through performances and exhibitions.','2026-11-04 07:00:00','Open Theatre',800,250)
`);

console.log("4 sample events inserted successfully");
} else {
  console.log("Events already exist. No sample events inserted.");
}

export { db };
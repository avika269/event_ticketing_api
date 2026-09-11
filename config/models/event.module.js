import { db } from "../config/db.js";

export const createEvent = async (event) => {
    const { title, description, event_date, venue, available_tickets, price } = event;

    const [result] = await db.execute(
        `INSERT INTO events
        (title,event_date, venue, available_tickets, price)
        VALUES ('Tech fest 26','2026-10-01 08:00:00','Main Auditorium',700,200),
        ('Coding Workshop','2026-09-25 04:00:00','Seminar Hall',600,350),
        ('Music Night','2026-09-02 06:30:00','Football Ground',500,150),
        ('Cultural Fest','2026-11-04 07:00:00','Open Theatre',800,250);`,
        [
            title,
            description || "",
            event_date,
            venue,
            available_tickets,
            price
        ]
    );

    return result;
};

export const getEvents = async () => {
    const [rows] = await db.execute(
        "SELECT * FROM events"
    );

    return rows;
};
import { db } from "../config/db.js";

export const createEvent = async (event) => {
    const {
        title,
        description,
        event_date,
        venue,
        available_tickets,
        price
    } = event;

    const [result] = await db.execute(
        `INSERT INTO events
        (title, description, event_date, venue, available_tickets, price)
        VALUES (?, ?, ?, ?, ?, ?)`,
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
        "SELECT * FROM events ORDER BY event_date"
    );

    return rows;
};
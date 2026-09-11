import { db } from "../config/db.js";

const createEvent = async (req, res) => {
    try {
        const { title, description, date, venue, totalTickets, price } = req.body;

        if (!title || !date || !venue || totalTickets == null || price == null) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (Number(totalTickets) <= 0 || Number(price) < 0) {
            return res.status(400).json({
                message: "Invalid ticket or price value"
            });
        }

        const [result] = await db.execute(
            `INSERT INTO events
            (title, description, event_date, venue, available_tickets, price)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                title,
                description || null,
                date,
                venue,
                Number(totalTickets),
                Number(price)
            ]
        );

        const [event] = await db.execute(
            "SELECT * FROM events WHERE id = ?",
            [result.insertId]
        );

        res.status(201).json({
            message: "Event created successfully",
            event: event[0]
        });

    } catch (error) {
         console.error("CREATE EVENT ERROR:", error);
        

        res.status(500).json({
          message: error.message
        });
    }
};


const getAllEvents = async (req, res) => {
    try {
        const [events] = await db.execute(
            "SELECT * FROM events ORDER BY event_date"
        );

        res.status(200).json(events);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};


const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                message: "Invalid event ID"
            });
        }

        const [events] = await db.execute(
            "SELECT * FROM events WHERE id = ?",
            [id]
        );

        if (events.length === 0) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json(events[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};


const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, venue, availableTickets, price } = req.body;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                message: "Invalid event ID"
            });
        }

        const [existingEvents] = await db.execute(
            "SELECT * FROM events WHERE id = ?",
            [id]
        );

        if (existingEvents.length === 0) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        const event = existingEvents[0];

        const newTitle = title ?? event.title;
        const newDescription = description ?? event.description;
        const newDate = date ?? event.event_date;
        const newVenue = venue ?? event.venue;
        const newAvailableTickets =
            availableTickets ?? event.available_tickets;
        const newPrice = price ?? event.price;

        if (
            Number(newAvailableTickets) < 0 ||
            Number(newPrice) < 0
        ) {
            return res.status(400).json({
                message: "Invalid event values"
            });
        }

        await db.execute(
            `UPDATE events
             SET title = ?,
                 description = ?,
                 event_date = ?,
                 venue = ?,
                 available_tickets = ?,
                 price = ?
             WHERE id = ?`,
            [
                newTitle,
                newDescription,
                newDate,
                newVenue,
                Number(newAvailableTickets),
                Number(newPrice),
                id
            ]
        );

        const [updatedEvent] = await db.execute(
            "SELECT * FROM events WHERE id = ?",
            [id]
        );

        res.status(200).json({
            message: "Event updated successfully",
            event: updatedEvent[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};


const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                message: "Invalid event ID"
            });
        }

        const [result] = await db.execute(
            "DELETE FROM events WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};


export {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
};
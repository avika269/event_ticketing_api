const db = require("../config/db");

const createEvent = async (req, res) => {
    try {
        const { title, date, venue, totalTickets, price } = req.body;

        if (!title || !date || !venue || totalTickets == null || price == null) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (totalTickets <= 0 || price < 0) {
            return res.status(400).json({
                message: "Invalid ticket or price value"
            });
        }

        const [result] = await db.execute(
            `INSERT INTO events
            (title, event_date, venue, total_tickets, available_tickets, price)
            VALUES ('Tech fest 26','A grand tech festival showcasing the latest in technology and innovation.','2026-10-01 08:00:00','Main Auditorium',700,200),
  ('Coding Workshop','An interactive workshop for coding enthusiasts to enhance their skills.','2026-09-25 04:00:00','Seminar Hall',600,350),
  ('Music Night','An enchanting evening filled with live music performances.','2026-09-02 06:30:00','Football Ground',500,150),
  ('Cultural Fest','A celebration of diverse cultures through performances and exhibitions.','2026-11-04 07:00:00','Open Theatre',800,250)`,
            [title, date, venue, totalTickets, totalTickets, price]
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
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
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
        const { title, date, venue, totalTickets, price, availableTickets } = req.body;

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
        const newDate = date ?? event.event_date;
        const newVenue = venue ?? event.venue;
        const newTotalTickets = totalTickets ?? event.total_tickets;
        const newPrice = price ?? event.price;

        let newAvailableTickets;

        if (availableTickets !== undefined) {
            newAvailableTickets = availableTickets;
        } else if (totalTickets !== undefined) {
            const bookedTickets =
                event.total_tickets - event.available_tickets;

            newAvailableTickets = newTotalTickets - bookedTickets;
        } else {
            newAvailableTickets = event.available_tickets;
        }

        if (
            newTotalTickets <= 0 ||
            newPrice < 0 ||
            newAvailableTickets < 0 ||
            newAvailableTickets > newTotalTickets
        ) {
            return res.status(400).json({
                message: "Invalid event values"
            });
        }

        await db.execute(
            `UPDATE events
             SET title = ?,
                 event_date = ?,
                 venue = ?,
                 total_tickets = ?,
                 available_tickets = ?,
                 price = ?
             WHERE id = ?`,
            [
                newTitle,
                newDate,
                newVenue,
                newTotalTickets,
                newAvailableTickets,
                newPrice,
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
            message: "Internal server error"
        });
    }
};


module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
};
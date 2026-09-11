import { db } from "../config/db.js";

const bookTickets = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const { id } = req.params;
        const { userName, userEmail, tickets } = req.body;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                message: "Invalid event ID"
            });
        }

        if (!userName || !userEmail || tickets == null || Number(tickets) <= 0) {
            return res.status(400).json({
                message: "User name, email and valid ticket quantity are required"
            });
        }

        if (!Number.isInteger(Number(tickets))) {
            return res.status(400).json({
                message: "Ticket quantity must be a whole number"
            });
        }

        await connection.beginTransaction();

        const [events] = await connection.execute(
            "SELECT * FROM events WHERE id = ? FOR UPDATE",
            [id]
        );

        if (events.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "Event not found"
            });
        }

        const event = events[0];

        if (event.available_tickets < Number(tickets)) {
            await connection.rollback();

            return res.status(409).json({
                message: "Not enough tickets available",
                availableTickets: event.available_tickets
            });
        }

        const [result] = await connection.execute(
            `INSERT INTO bookings
            (event_id, user_name, user_email, tickets_booked)
            VALUES (?, ?, ?, ?)`,
            [id, userName, userEmail, Number(tickets)]
        );

        await connection.execute(
            `UPDATE events
             SET available_tickets = available_tickets - ?
             WHERE id = ?`,
            [Number(tickets), id]
        );

        await connection.commit();

        res.status(201).json({
            message: "Tickets booked successfully",
            bookingId: result.insertId,
            eventId: Number(id),
            userName,
            userEmail,
            tickets: Number(tickets)
        });

    } catch (error) {
        await connection.rollback();
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });

    } finally {
        connection.release();
    }
};

const getEventBookings = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                message: "Invalid event ID"
            });
        }

        const [events] = await db.execute(
            "SELECT id FROM events WHERE id = ?",
            [id]
        );

        if (events.length === 0) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        const [bookings] = await db.execute(
            `SELECT *
             FROM bookings
             WHERE event_id = ?
             ORDER BY booking_date DESC`,
            [id]
        );

        res.status(200).json(bookings);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const cancelBooking = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                message: "Invalid booking ID"
            });
        }

        await connection.beginTransaction();

        const [bookings] = await connection.execute(
            "SELECT * FROM bookings WHERE id = ? FOR UPDATE",
            [id]
        );

        if (bookings.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const booking = bookings[0];

        await connection.execute(
            `UPDATE events
             SET available_tickets = available_tickets + ?
             WHERE id = ?`,
            [booking.tickets_booked, booking.event_id]
        );

        await connection.execute(
            "DELETE FROM bookings WHERE id = ?",
            [id]
        );

        await connection.commit();

        res.status(200).json({
            message: "Booking cancelled successfully"
        });

    } catch (error) {
        await connection.rollback();
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });

    } finally {
        connection.release();
    }
};

export {
    bookTickets,
    getEventBookings,
    cancelBooking
};
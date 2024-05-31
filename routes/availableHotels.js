import express from "express"

const router = express.Router();

//import models file
const hotelModel = (await import('../models/Hotels.js')).default;
const roomModel = (await import('../models/Rooms.js')).default;

router.post('/', async (request, response) => {
    const { hotelId, searchTime, roomType } = request.body;

    // Build the query object based on the presence of hotelId and roomType
    const query = {};
    if (hotelId) query.hotelId = hotelId;
    if (roomType) query.roomType = roomType;

    try {
        const data = await roomModel.find(query);

        // If searchTime is provided, filter the dates in the range
        if (searchTime) {
            const [searchYear, searchMonth] = searchTime.split('-').map(Number);

            data.forEach(room => {
                room.range = room.range.filter(dateObj => {
                    const date = new Date(dateObj);
                    return date.getUTCFullYear() === searchYear && date.getUTCMonth() + 1 === searchMonth;
                });
            });
        }

        response.json(data);
    } catch (error) {
        response.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
});



export default router;
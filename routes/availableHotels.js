import express from "express"

const router = express.Router();

  
//import models file
const hotelModel = (await import('../models/Hotels.js')).default;
const roomModel = (await import('../models/Rooms.js')).default;
const bookingModel = (await import('../models/Bookings.js')).default;

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
                    return date.getUTCFullYear() === searchYear && date.getUTCMonth()  === searchMonth;
                });
                return room.range.length > 0; // Only keep rooms with non-empty ranges
            });
        }

        const roomData = await Promise.all(data.map(async (room) => {
            const hotel = await hotelModel.findById(room.hotelId);
            const booked = await bookingModel.findOne({hotel:hotel.name,roomId:room.roomId}, { dates: 1 })

            const closeDates = booked ? booked.dates : ''

            const hotelName = hotel ? hotel.name : ''
            if (room.range.length > 0) {
                return {
                    categ: room.roomCateg,
                    name: `${room.roomId} - ${hotelName}`,
                    dates: room.range,
                    close: closeDates
                };
            }
            return null;
        }));

        // Filter out null values from roomData
        const filteredRoomData = roomData.filter(room => room !== null);

        response.json(filteredRoomData);

    } catch (error) {
        response.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
});



export default router;
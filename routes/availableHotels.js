import express from "express"

const router = express.Router();


//import models file
const hotelModel = (await import('../models/Hotels.js')).default;
const roomModel = (await import('../models/Rooms.js')).default;
const bookingModel = (await import('../models/Bookings.js')).default;

// Function to get all dates between a start and end date
const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

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
                    return date.getUTCFullYear() === searchYear && date.getUTCMonth() === searchMonth;
                });
                return room.range.length > 0; // Only keep rooms with non-empty ranges
            });
        }

        const roomData = await Promise.all(data.map(async (room) => {
            const hotel = await hotelModel.findById(room.hotelId);
            const bookedRooms = await bookingModel.find(
                { hotel: hotel.name, roomId: room.roomId, status: 'Booked' },
                { dates: 1 }
            );

            let closeDates = bookedRooms.reduce((acc, booking) => {
                const datesInRange = getDatesInRange(booking.dates[0], booking.dates[1]);
                return acc.concat(datesInRange);
            }, []);


            // filter closeDates to be in range
            if (searchTime) {
                const [searchYear, searchMonth] = searchTime.split('-').map(Number);
                closeDates = closeDates.filter(dateObj => {
                    const date = new Date(dateObj);
                    return date.getUTCFullYear() === searchYear && date.getUTCMonth() === searchMonth;
                });
            }

            let outDates = bookedRooms.reduce((acc, booking) => {
                const lastDate = booking.dates[1];
                return acc.concat(lastDate);
            }, []);

            // filter outDates to be in range
            if (searchTime) {
                const [searchYear, searchMonth] = searchTime.split('-').map(Number);
                outDates = outDates.filter(dateObj => {
                    const date = new Date(dateObj);
                    return date.getUTCFullYear() === searchYear && date.getUTCMonth() === searchMonth;
                });
            }

            // Filter outDates based on the count in closeDates to know if outdate is booked then remove from closeDates
            const dateCounts = {};
            closeDates.forEach(date => {
                dateCounts[date] = (dateCounts[date] || 0) + 1;
            });
            outDates = outDates.filter(date => dateCounts[date] <= 1);

            const noShowRooms = await bookingModel.find(
                { hotel: hotel.name, roomId: room.roomId, status: 'No Show' },
                { dates: 1 }
            );
            const noShowDates = noShowRooms.reduce((acc, noShow) => {
                const datesInRange = getDatesInRange(noShow.dates[0], noShow.dates[1]);
                return acc.concat(datesInRange);
            }, []);

            const hotelName = hotel ? hotel.name : '';
            if (room.range.length > 0) {
                return {
                    categ: room.roomCateg,
                    name: `${room.roomId} - ${hotelName}`,
                    dates: room.range,
                    close: closeDates,
                    outDates: outDates,
                    noShowDates: noShowDates,
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
import express from "express"
import dayjs from "dayjs";
const router = express.Router();

//import bookings model file
const bookingModel = (await import('../models/Bookings.js')).default;

router.post('/', async (request, response) => {
    const { filter, range } = request.body;
    console.log('filter :' + filter)

    let data = {}
    if (filter) {
        switch (filter) {
            case 'Custom Date': {
                if (range[0]) {
                    const now = dayjs();

                    const start = dayjs(range[0]).toDate();
                    const end = dayjs(range[1]).add(1, 'day').toDate();

                    data = await bookingModel.find({
                        bookDate: {
                            $gte: start,
                            $lte: end
                        }
                    });
                }else{//if clear range load all
                    data = await bookingModel.find();
                }
                break;
            }
            case 'Daily': { //last week
                // Get the current date
                const now = dayjs();

                // Calculate the start and end of today
                const startOfToday = now.startOf('day').toDate();
                const endOfToday = now.endOf('day').toDate();

                // Find all bookings for today
                data = await bookingModel.find({
                    bookDate: {
                        $gte: startOfToday,
                        $lte: endOfToday
                    }
                });

                break;
            }
            case 'Weekly': {
                const now = dayjs();

                const startOfLastWeek = now.subtract(1, 'week').startOf('day').toDate();
                const endOfToday = now.endOf('day').toDate();

                data = await bookingModel.find({
                    bookDate: {
                        $gte: startOfLastWeek,
                        $lte: endOfToday
                    }
                });

                break;
            }
            case 'Monthly': {
                const now = dayjs();

                const startOfLastMonth = now.subtract(1, 'month').startOf('day').toDate();
                const endOfToday = now.endOf('day').toDate();

                data = await bookingModel.find({
                    bookDate: {
                        $gte: startOfLastMonth,
                        $lte: endOfToday
                    }
                });

                break;
            }
            case 'Yearly': {
                const now = dayjs();

                const startOfLastYear = now.subtract(1, 'year').startOf('day').toDate();
                const endOfToday = now.endOf('day').toDate();

                data = await bookingModel.find({
                    bookDate: {
                        $gte: startOfLastYear,
                        $lte: endOfToday
                    }
                });

                break;
            }
            default :data = await bookingModel.find();
        }
    }
    else {
        data = await bookingModel.find();
    }

    // Format the dates for each booking
    data = data.map(booking => ({
        ...booking._doc, // Use _doc to access the document data if using Mongoose
        bookDate: dayjs(booking.bookDate).format('YYYY-MM-DD HH:mm'),
        formatedRange: (dayjs(booking.dates[0]).format('YYYY-MM-DD')) + ' - ' + dayjs(booking.dates[1]).format('YYYY-MM-DD')
    }));
    response.json(data);
});

router.get('/', async (request, response) => {

    const { filter, range2 } = request.query;
    const range = request.query.range ? request.query.range.split(',') : [];
    console.log('range ' + range)
    let data = {}
    if (filter) {
        switch (filter) {
            case 'daily': { //last week
                // Get the current date
                const now = dayjs();

                // Calculate the start and end of today
                const startOfToday = now.startOf('day').toDate();
                const endOfToday = now.endOf('day').toDate();

                // Find all bookings for today
                data = await bookingModel.find({
                    bookDate: {
                        $gte: startOfToday,
                        $lte: endOfToday
                    }
                });

                break;
            }
            case 'weekly': {
                const now = dayjs();

                const startOfLastWeek = now.subtract(1, 'week').startOf('day').toDate();
                const endOfToday = now.endOf('day').toDate();

                data = await bookingModel.find({
                    bookDate: {
                        $gte: startOfLastWeek,
                        $lte: endOfToday
                    }
                });

                break;
            }
            case 'monthly': {
                const now = dayjs();

                const startOfLastMonth = now.subtract(1, 'month').startOf('day').toDate();
                const endOfToday = now.endOf('day').toDate();

                data = await bookingModel.find({
                    bookDate: {
                        $gte: startOfLastMonth,
                        $lte: endOfToday
                    }
                });

                break;
            }
            case 'yearly': {
                const now = dayjs();

                const startOfLastYear = now.subtract(1, 'year').startOf('day').toDate();
                const endOfToday = now.endOf('day').toDate();

                data = await bookingModel.find({
                    bookDate: {
                        $gte: startOfLastYear,
                        $lte: endOfToday
                    }
                });

                break;
            }
        }
    }
    else if (range.length) {
        console.log('range ' + range)

        const now = dayjs();

        const start = range[0];
        const end = range[1];

        data = await bookingModel.find({
            bookDate: {
                $gte: start,
                $lte: end
            }
        });
    }
    else {
        data = await bookingModel.find();
    }

    // Format the dates for each booking
    data = data.map(booking => ({
        ...booking._doc, // Use _doc to access the document data if using Mongoose
        bookDate: dayjs(booking.bookDate).format('YYYY-MM-DD HH:mm'),
        formatedRange: (dayjs(booking.dates[0]).format('YYYY-MM-DD')) + ' - ' + dayjs(booking.dates[1]).format('YYYY-MM-DD')
    }));
    response.json(data);
});

router.post('/', async (request, response) => {
    const newBooking = new bookingModel({
        _id: new global.db.Types.ObjectId(), // to generate a value for id
        ...request.body, //to get all data from request.body
    })
    await newBooking.save()
    response.json({ message: 'Saved!', id: newBooking._id })
})

router.put('/', async (request, response) => {
    try {
        const id = request.body._id;// get id for updated record

        const updatedBooking = await bookingModel.findByIdAndUpdate(id, {
            ...request.body
        }, { new: true }); // Return the updated document

        if (!updatedBooking) {
            response.json({ message: 'Booking not found!' })
        }

        response.json({ message: 'Updated!', bookingId: id })

    } catch (err) {
        response.json({ message: 'Error updating booking: ', err })
    }
});

router.delete('/:id', async (request, response) => {
    const { id } = request.params;
    const deletedItem = await bookingModel.findByIdAndDelete(id);
    if (deletedItem) {
        response.status(200).json({ message: 'booking deleted successfully' });
    } else {
        response.status(404).json({ message: 'booking not found' });
    }
})

export default router;
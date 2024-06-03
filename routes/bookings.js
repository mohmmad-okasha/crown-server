import express from "express"
import dayjs from "dayjs";
const router = express.Router();

//import bookings model file
const bookingModel = (await import('../models/Bookings.js')).default;

router.get('/', async (request, response) => {
    let data = await bookingModel.find();
    // Format the dates for each booking
    data = data.map(booking => ({
        ...booking._doc, // Use _doc to access the document data if using Mongoose
        bookDate: dayjs(booking.bookDate).format('YYYY-MM-DD HH:mm'),
        formatedRange: (dayjs(booking.dates[0]).format('YYYY-MM-DD')) + ' - '+dayjs(booking.dates[1]).format('YYYY-MM-DD')
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
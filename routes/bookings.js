import express from "express"

const router = express.Router();

//import bookings model file
const bookingModel = (await import('../models/Bookings.js')).default;

router.get('/', async (request, response) => {
    const data = await bookingModel.find();
    response.json(data);
});

router.post('/', async (request, response) => {
    const newBooking = new bookingModel({
        _id: new global.db.Types.ObjectId(), // to generate a value for id
        ...request.body, //to get all data from request.body
    })
    await newBooking.save()
    response.json({ message: 'Saved!',bookingId: newBooking._id  })
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

        response.json({ message: 'Updated!',bookingId:id })

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
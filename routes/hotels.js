import express from "express"

const router = express.Router();

//import hotels model file
const hotelModel = (await import('../models/Hotels.js')).default;

router.get('/', async (request, response) => {
    const data = await hotelModel.find();
    response.json(data);
});

router.get('/list', async (request, response) => {
    try {
        const data = await hotelModel.find();
        const options = data.map(hotel => ({
            label: hotel.name,
            value: hotel.name
        }));
        response.json(options);
    } catch (error) {
        response.status(500).json({ error: error });
    }
});

//get hotel data by hotelname
router.get('/:hotelName', async (request, response) => {
    const data = await hotelModel.findOne({ name: request.params.hotelName });
    response.json(data);
});

router.post('/', async (request, response) => {
    const { name, country, city, area, rate, allotment, notes, user } = request.body
    const finded = await hotelModel.findOne({ name }) // search if name exist
    if (finded) return (response.json({ message: finded.name + ' Already Exist!' }))

    const newHotel = new hotelModel({
        _id: new global.db.Types.ObjectId(), // to generate a value for id
        ...request.body, //to get all data from request.body
    })
    await newHotel.save()
    response.json({ message: 'Saved!' })
})

router.put('/', async (request, response) => {
    try {
        const id = request.body._id;// get id for updated record

        const updatedHotel = await hotelModel.findByIdAndUpdate(id, {
           ...request.body
        }, { new: true }); // Return the updated document

        if (!updatedHotel) {
            response.json({ message: 'Hotel not found!' })
        }

        response.json({ message: 'Updated!' })

    } catch (err) {
        response.json({ message: 'Error updating hotel: ', err })
    }
});

router.delete('/:id', async (request, response) => {
    const { id } = request.params;
    const deletedItem = await hotelModel.findByIdAndDelete(id);
    if (deletedItem) {
        response.status(200).json({ message: 'hotel deleted successfully' });
    } else {
        response.status(404).json({ message: 'hotel not found' });
    }
})

export default router;
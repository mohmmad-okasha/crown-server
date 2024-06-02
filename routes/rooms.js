import express, { response } from "express"

const router = express.Router();

//import rooms model file
const roomModel = (await import('../models/Rooms.js')).default;

router.get('/', async (request, response) => {
    const data = await roomModel.find();
    response.json(data);
});

router.get('/list', async (request, response) => {
    try {
        const data = await roomModel.find();
        const options = data.map(room => ({
            label: room.roomId,
            value: room.roomId
        }));
        response.json(options);
    } catch (error) {
        response.status(500).json({ error: error });
    }
});

//get room data by roomname
router.get('/:roomId', async (request, response) => {
    const data = await roomModel.findOne({ roomId: request.params.roomName });
    response.json(data);
});

router.post('/', async (request, response) => {

    const newRoom = new roomModel({
        _id: new global.db.Types.ObjectId(), // to generate a value for id
        ...request.body, //to get all data from request.body
    })
    await newRoom.save()
    response.json({ message: 'Room Saved!' })
})

router.put('/', async (request, response) => {
    try {
        const id = request.body._id;// get id for updated record

        const updatedRoom = await roomModel.findByIdAndUpdate(id, {
            ...request.body
        }, { new: true });

        if (!updatedRoom) {
            response.json({ message: 'Room not found!' })
        }

        response.json({ message: 'Updated!' })

    } catch (err) {
        response.json({ message: 'Error updating room: ', err })
    }
});

router.get('/forhotel/:hotelId', async (request, response) => {
    const { hotelId } = request.params
    const data = await roomModel.find({ hotelId: hotelId })
    // Update the range for each room document
    const updatedData = data.map(room => {
        const newRange = [room.range[0], room.range[room.range.length - 1]];
        return {
            ...room._doc, // use `_doc` to get the plain JavaScript object if using Mongoose
            range: room.range
        };
    });
    if (updatedData) {
        const options = data.map(room => ({
            label: room.roomId,
            value: room.roomId,
            type: room.roomType,
            range: room.range,
        }));
        response.json({data:updatedData,options:options});
    } else {
        response.status(404).json({ message: 'rooms not found' });
    }
})


router.delete('/:hotelId', async (request, response) => {
    const { hotelId } = request.params;
    const deletedItem = await roomModel.deleteMany({ hotelId: hotelId });
    if (deletedItem) {
        response.status(200).json({ message: hotelId + ' rooms deleted successfully' });
    } else {
        response.status(404).json({ message: 'rooms not found' });
    }
})

export default router;
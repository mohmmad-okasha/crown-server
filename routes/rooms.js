import express from "express"

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
            label: room.room_id,
            value: room.room_id
        }));
        response.json(options);
    } catch (error) {
        response.status(500).json({ error: error });
    }
});

//get room data by roomname
router.get('/:room_id', async (request, response) => {
    const data = await roomModel.findOne({ room_id: request.params.roomName });
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

router.delete('/:id', async (request, response) => {
    const { id } = request.params;
    const deletedItem = await roomModel.findByIdAndDelete(id);
    if (deletedItem) {
        response.status(200).json({ message: 'room deleted successfully' });
    } else {
        response.status(404).json({ message: 'room not found' });
    }
})

export default router;
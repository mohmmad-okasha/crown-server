import express from "express"

const router = express.Router();

//import models file
const hotelModel = (await import('../models/Hotels.js')).default;
const roomModel = (await import('../models/Rooms.js')).default;

router.post('/', async (request, response) => {
    const {hotelId,range,roomType} = request.body

    const data = await roomModel.find({hotelId:hotelId});

    console.log(hotelId)
    response.json(data);
});



export default router;
import express from "express"

const router = express.Router(); // Create a router instance

//import users model file
const LogsModel = (await import('../models/Logs.js')).default;

router.get('/', async (request, response) => {
    const search =request.params.search;

    const data = await LogsModel.find().sort({ _id: -1 });
    if(search){
        data.filter('userName'===search)
    }
    response.json(data);
});


router.post('/', async (request, response) => {
    const newLogs = new LogsModel({
        _id: new global.db.Types.ObjectId(), // to generate a value for id
        ...request.body, //to get all data from request.body
    })
    await newLogs.save()
    response.json({ message: 'Logs Saved!' })
})


export default router;
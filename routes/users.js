import express from "express"
import bcrypt from "bcryptjs"

const router = express.Router(); // Create a router instance

//import users model file
const userModel = (await import('../models/Users.js')).default; // Destructure and await

router.get('/', async (request, response) => {
    const data = await userModel.find({name:{$ne:'test'}});
    response.json(data);
});
//{name:{$ne:'test'}} to hide test user

router.get('/list', async (request, response) => {
    try {
        const data = await userModel.find();
        const options = data.map(user => ({
            label: user.name,
            value: user.name
        }));
        response.json(options);
    } catch (error) {
        response.status(500).json({ error: error });
    }
});

//get user data by username
router.get('/:userName', async (request, response) => {
    const data = await userModel.findOne({ name: request.params.userName });
    response.json(data);
});

router.post('/', async (request, response) => {

    const { name, password } = request.body
    const finded = await userModel.findOne({ name }) // search if name exist
    if (finded) return (response.json({ message: finded.name + ' Already Exist!' }))

    const newUser = new userModel({
        _id: new global.db.Types.ObjectId(), // to generate a value for id
        password: bcrypt.hashSync(request.body.password, 10), // to hash the password
        name: request.body.name,
        rules: request.body.rules,
        email: request.body.email,
        // ...request.body, //to get all data from request.body
    })
    await newUser.save()
    response.json({ message: 'Saved!' })
})

router.put('/', async (request, response) => {
    try {
        const id = request.body._id;// get id for updated record

        const { name, email, password, rules } = request.body;//get the new data
        const finded = await userModel.findOne({ name }) // search if name exist
        //if (finded) return (response.json({ message: finded.name + ' Already Exist!' }))


        const updatedUser = await userModel.findByIdAndUpdate(id, {
            name,
            email,
            password: bcrypt.hashSync(password, 10),
            rules
        }, { new: true }); // Return the updated document

        if (!updatedUser) {
            response.json({ message: 'User not found!' })
        }

        response.json({ message: 'Updated!' })

    } catch (err) {
        response.json({ message: 'Error updating user: ', err })
    }
});

router.delete('/:id', async (request, response) => {
    const { id } = request.params;
    const deletedItem = await userModel.findByIdAndDelete(id);
    if (deletedItem) {
        response.status(200).json({ message: 'user deleted successfully' });
    } else {
        response.status(404).json({ message: 'user not found' });
    }
})

export default router;
import express, { request, response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = express.Router(); // Create a router instance
const userModel = (await import('../models/Users.js')).default; //import users model file



router.post('/',async (request,response) =>{
    const {name,password} = request.body
    const data = await userModel.findOne({name})
    if(!data){
        response.json({message:'User not exist'})
        return
    }

    const IsPasswordValid =await bcrypt.compare(password,data.password)

    if(!IsPasswordValid) {
        return (response.json({message:'password not valid'}))
    }

    const token = jwt.sign({id:data._id}, 'test')

    return response.json({token, 'userName': data.name})
})


export default router;
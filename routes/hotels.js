import express from "express"
import moment from "moment"

const router = express.Router();

//import hotels model file
const hotelModel = (await import('../models/Hotels.js')).default;
const roomModel = (await import('../models/Rooms.js')).default;
const bookingsModel = (await import('../models/Bookings.js')).default;

function getDateRange(dateRange) {
    try {
        let [startDateString, endDateString] = dateRange.split(',');

        let startDate = moment(startDateString, 'DD/MM/YYYY').startOf('day');
        let endDate = moment(endDateString, 'DD/MM/YYYY').startOf('day');
        let dates = [];

        for (let date = startDate.clone(); date.isSameOrBefore(endDate); date.add(1, 'days')) {
            dates.push(date.toISOString());
        }

        return dates;
    } catch (error) {
        console.error(error);
        return []; // Return empty array on error
    }
}
function getDateRange2(dateRange) {
    try {
        let [startDateString, endDateString] = dateRange.split(',');

        let startDate = moment(startDateString, 'DD/MM/YYYY').format('YYYY-MM-DD');
        let endDate = moment(endDateString, 'DD/MM/YYYY').format('YYYY-MM-DD');
        let dates = [];
        dates.push(startDate)
        dates.push(endDate)

        return dates;
    } catch (error) {
        console.error(error);
        return []; // Return empty array on error
    }
}
router.get('/strtorange2', async (request, response) => {
    const updaterange = await bookingsModel.find()

    updaterange.map(async (t) => {
        t.dates = getDateRange2(t.dates)
        t.save()

    });
    response.json(updaterange);
})
router.get('/kidsNames', async (request, response) => {
    const bookings = await bookingsModel.find({ kidsNames: { $ne: [] } });
    let splited = []
    bookings.map(async (a) => {
        splited = String(a.kidsNames).split(',').map(String)
        a.kidsNames = splited
        a.save()
    });
    response.json(bookings);
})
router.get('/rename', async (request, response) => {
    const rooms = await roomModel.find()
    rooms.map(async (r) => {
        switch (r.hotelId) {
            case '41': {//holiday in trabzon
                r.hotelId = '66778a16940293728d302919'
                break;
            }
            case '42': {//holiday in ALAMAL
                r.hotelId = '66778a16940293728d30291a'
                break;
            }
            case '43': {//The marina trabzon
                r.hotelId = '66778a16940293728d30291b'
                break;
            }
            case '44': {//The marina ALAML
                r.hotelId = '66778a16940293728d30291c'
                break;
            }
            case '47': {//Xanadu Makadi Bay
                r.hotelId = '66778a16940293728d30291d'
                break;
            }
            case '48': {//Albatros Palace Resort
                r.hotelId = '66778a16940293728d30291e'
                break;
            }
            case '49': {//Beach Albatros Resort
                r.hotelId = '66778a16940293728d30291f'
                break;
            }
            case '50': {//Sea Star Beau Rivage
                r.hotelId = '66778a16940293728d302920'
                break;
            }
            case '51': {//Golden Beach Resort
                r.hotelId = '66778a16940293728d302921'
                break;
            }
            case '52': {//Sphinx Resort
                r.hotelId = '66778a16940293728d302922'
                break;
            }
            case '53': {//Albatros Blu Spa(Adults only)
                r.hotelId = '66778a16940293728d302923'
                break;
            }
            case '54': {//Sunrise Aqua joy
                r.hotelId = '66778a16940293728d302924'
                break;
            }
            case '55': {//AMC Royal
                r.hotelId = '66778a16940293728d302925'
                break;
            }
            case '56': {//Hawaii Caesar &  aqua park
                r.hotelId = '66778a16940293728d302926'
                break;
            }
        }
        r.save()
    });
    response.json(rooms);
})
router.get('/roomRange', async (request, response) => {
    const updaterange = await roomModel.find()

    updaterange.map(async (t) => {
        //console.log(t.range)

        let range = await getDateRange(t.range);
        t.range = range
        t.save()

    });
    response.json(updaterange);
})

router.get('/', async (request, response) => {
    // const test = await roomModel.find({ hotelId: '41' });
    // console.log(test);
    // test.map(async (t) => {
    //     t.hotelId = '66778a16940293728d302919';
    //     await t.save()
    // });





    const data = await hotelModel.find();
    response.json(data);
});

router.get('/list', async (request, response) => {
    try {
        const data = await hotelModel.find();
        const options = data.map(hotel => ({
            label: hotel.name,
            value: hotel._id
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
    response.json({ message: 'Saved!', hotelId: newHotel._id })
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

        response.json({ message: 'Updated!', hotelId: id })

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
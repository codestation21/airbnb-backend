const opencage = require('opencage-api-client');
const {combineResolvers} = require('graphql-resolvers');


const {Rooms} = require('../Model/roomModel');
const {isAuthenticated} = require("../Authorization/Autorize");
const {isAdmin} = require("../Authorization/Admin");
const {multipleReadFile, multipleFileDelete} = require("../Middlewares/file");
const {inputValidate, updateValidate} = require("../Validation/roomValidation");
const {stringToBase64, base64ToString} = require('../Middlewares/base');

module.exports = {
    Query: {
        getAllRooms: combineResolvers(isAuthenticated, isAdmin, async() => {
            const rooms = await Rooms.find();
            if(rooms.length === 0) throw new Error("Rooms collection is empty! Please add some room");
            return rooms;
        }),
        getRooms: combineResolvers(isAuthenticated, async (_, {input}) => {
            let order = input.order === 'aesc' ? 1 : -1;
            let sortBy = input.sortBy ? input.sortBy : '_id';
            let limit = parseInt(input.limit);
            let filters = input.filters;
            let args = {};
            for (let key in filters) {
                if (filters[key].length > 0) {
                    if (key === "name") {
                        args["name"] = {
                            $regex: filters['name'],
                            $options: 'i'
                        }
                    } else if (key === 'price') {
                        args['price'] = {
                            $gte: parseInt(filters['price'][0]),
                            $lte: parseInt(filters['price'][1]),
                        }
                    } else if (key === 'category') {
                        args["category"] = filters['category']

                    } else if (key === 'location') {
                        args["address"] = {
                            '$regex': filters['location'],
                            '$options': 'i'
                        }
                    } else if (key === 'guestCapacity') {
                        args['guestCapacity'] = filters['guestCapacity']
                    }
                }
            }
            const currentPage = Number(input.page) || 1;
            const skip = limit * (currentPage - 1);

            const count = await Rooms.countDocuments(args);
            let rooms = await Rooms.find(args)
                .sort({[sortBy]: order})
                .limit(limit)
                .skip(skip)
            if (rooms.length === 0) throw new Error("Nothing found!");
            return {
                rooms: rooms,
                pageInfo: {
                    resultPerPage: limit,
                    count
                }
            };
        }),
        getRoom: combineResolvers(isAuthenticated, async (_, {id}) => {
            const rooms = await Rooms.findOne({
                _id: id
            });
            if (!rooms) throw new Error("Rooms not found!");
            return rooms;
        })
    },
    Mutation: {
        addRooms: combineResolvers(isAuthenticated, isAdmin, async (_, {input, images}) => {
            const {error} = inputValidate(input);
            if (error) throw new Error(error.details[0].message);
            const imageUrl = await multipleReadFile(images);
            let geometry
            let errorMessage
            await opencage
                .geocode({q: input.address})
                .then((data) => {
                    const place = data.results[0];
                    geometry = place.geometry
                })
                .catch((error) => {
                    errorMessage = error.message
                });
            if (errorMessage) throw new Error("Please add a valid address!");
            let rooms = new Rooms({...input, lat: geometry.lat, lng: geometry.lng});
            rooms.images.push(...imageUrl)
            await rooms.save();
            return {
                message: "Room added successfully!",
            }
        }),
        updateRooms: combineResolvers(isAuthenticated, isAdmin, async (_, {input, id, images}) => {
            const rooms = await Rooms.findOne({
                _id: id
            });
            if (!rooms) throw Error("Rooms not found!");
            let imageUrl
            if (images) {
                imageUrl = await multipleReadFile(images);
            }
            Object.keys(input).forEach((key) => input[key] === "" && delete input[key]);
            let geometry
            let errorMessage
            if (input.address) {
                await opencage
                    .geocode({q: input.address})
                    .then((data) => {
                        const place = data.results[0];
                        geometry = place.geometry
                    })
                    .catch((error) => {
                        errorMessage = error.message
                    });
            }
            if (errorMessage) throw new Error("Address is not a valid address!")
            await Rooms.findByIdAndUpdate(id, {
                ...input,
                lat: geometry ? geometry.lat : undefined,
                lng: geometry ? geometry.lng : undefined,
                images: imageUrl ? [...imageUrl] : undefined
            });
            if (images && rooms.images.length !== 0) {
                await multipleFileDelete(rooms.images)
            }
            return {
                message: "Room updated successfully!",
            }
        }),
        deleteRooms: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const rooms = await Rooms.findByIdAndDelete(id);
            if (!rooms) throw new Error("Rooms not found!");
            if (rooms.images.length !== 0) {
                await multipleFileDelete(rooms.images)
            }
            return {
                message: "Room deleted successfully!",
                id: rooms._id,
                name: rooms.name,
                price: rooms.price
            }
        })
    }
}
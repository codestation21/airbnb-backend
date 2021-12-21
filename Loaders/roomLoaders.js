const {Rooms} = require('../Model/roomModel');

module.exports.bathRooms = async (roomIds) => {
    const rooms = await Rooms.find({_id: {$in: roomIds}});
    return roomIds.map(roomId => rooms.find(room => room.id === roomId));
}
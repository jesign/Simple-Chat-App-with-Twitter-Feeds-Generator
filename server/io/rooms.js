const rooms = {
    vueJS: {
        channels: {
            general: {},
            funStuff: {}
        }
    },
    nuxtJS: {
        channels: {
            general: {},
            help: {},
            jobs: {}
        }
    },
    Covid: {
        channels: {
            twitter: {}
        }
    }
}

Object.entries(rooms).forEach(([room, roomInfo]) => {
    roomInfo.users = []
    Object.entries(roomInfo.channels).forEach(([channel, channelInfo]) => {
        channelInfo.users = []
        channelInfo.chats = []
    })
})

const RoomService = function Svc(socket, io) {
    const roomSvc =  Object.freeze({
        getRooms() {
            return Promise.resolve(Object.keys(rooms))
        },
        joinRoom({ room, user }) {
            const fndRoom = getRoom(room)
            if (!fndRoom) {
                return Promise.reject(new Error(`room ${room} not found`))
            }
            return new Promise((resolve, reject) => {
                if (!fndRoom.users.includes(user)) {
                    fndRoom.users.push(user)
                }

                console.log(user + ' joined room: ' + room, fndRoom.users)

                const namespace = `rooms/${room}`
                const channels = Object.keys(fndRoom.channels)
                const { users } = fndRoom
                socket.join(namespace, () => {
                    const resp = { room, users, channels, user, namespace }
                    socket.to(namespace).emit('joinedRoom', resp)
                    resolve(resp)
                })
                
                socket.on('disconnect', () => {
                    roomSvc.leaveRoom({ room, user })
                })
            })
        },
        leaveRoom({ room, user }) {
            const fndRoom = getRoom(room)
            if (!fndRoom) {
                return Promise.reject(new Error(`room ${room} not found`))
            }
            return new Promise((resolve, reject) => {
                if (fndRoom.users.includes(user)) {
                    const userIdx = fndRoom.users.findIndex((u) => u === user)
                    fndRoom.users.splice(userIdx, 1)
                }

                const namespace = `rooms/${room}`
                const { users } = fndRoom
                socket.leave(namespace, () => {
                    const resp = { room: fndRoom, users, user, namespace }
                    socket.to(namespace).emit('leftRoom', resp)
                    resolve(resp)
                })
            })
        }
    })

    return roomSvc
}

export default RoomService;

export function getRoom(room) {
    const fndRoom = rooms[room]
    if (fndRoom === undefined) {
        throw new Error(`Room ${room} not found`)
    }
    return fndRoom
}

export function getChannel(room, channel) {
    const fndRoom = getRoom(room)
    if (fndRoom === undefined) {
        throw new Error(`Room ${room} not found`)
    }

    if (fndRoom.channels === undefined) {
        throw new Error(`Channels not found in ${room}`)
    }
    return fndRoom.channels[channel]
}

export function getCovidChannelNamespace(room, channel) {
    return 'rooms/Covid/twitter'
}

export function testing(){
    return RoomService
}
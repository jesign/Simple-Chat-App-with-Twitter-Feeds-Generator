import {getChannel, getCovidChannelNamespace} from './rooms'
import TwitterService from '../../services/twitter'

export default function Svc(socket, io) {
    const channelSvc = Object.freeze({
        sendMessageFromTwitter(message){
            console.log('sending Message from Twitter:', message)
            let msg = {
                inputMsg: message,
                username: 'Twitter'
            }

            const namespace = getCovidChannelNamespace()
            let channelInfo = getChannel('Covid', 'twitter')
            channelInfo.chats.push(msg)

            socket.to(namespace).emit('newMessage', msg)

            return Promise.resolve(msg)
        },
        addMessage({ inputMsg, namespace, room, channel, username }) {
            console.log('io message', inputMsg, namespace)
            let msg = {
                inputMsg,
                username
            }

            let channelInfo = getChannel(room, channel)
            channelInfo.chats.push(msg)
            socket.to(namespace).emit('newMessage', msg)

            return Promise.resolve(msg)
        },
        getTwitterFeeds() {
            // socket.to(namespace)
            return new Promise((resolve, reject) => {
                console.log('getting twitter feeds...');

                TwitterService.getFeeds().then(response => {
                    let feeds = response.data.tweets.statuses;

                    let i = 0;
                    let interval = setInterval(() => {
                        const namespace = getCovidChannelNamespace()
                        let msg = {
                            inputMsg : feeds[i].text,
                            username : 'twitter'
                        }

                        let channelInfo = getChannel('Covid', 'twitter')
                        channelInfo.chats.push(msg)
                        socket.to(namespace).emit('newTwitterMessage', msg)    
                        socket.emit('localTwitterMessage', msg)
                        
                        i++;
                        if (i >= feeds.length) {
                            clearInterval(interval)
                            return resolve(feeds)   
                        }
                        
                    }, 1000);
                }).catch(error => {
                    return reject(error)
                });
            })
        },
        joinChannel({ room, channel, username }) {
            const fndChannel = getChannel(room, channel)
            if (!fndChannel) {
                return Promise.reject(new Error(`channel ${channel} not found`))
            }

            return new Promise((resolve, reject) => {
                if (!fndChannel.users.includes(username)) {
                    fndChannel.users.push(username)
                }

                const { users, chats } = fndChannel

                console.log('joining channel ', fndChannel)

                const namespace = `rooms/${room}/${channel}`

                socket.join(namespace, () => {
                    const resp = { room, channel, chats, users, username,namespace }

                    console.log('joined', namespace)
                    socket.to(namespace).emit('joinedChannel', resp)
                    resolve(resp)
                })
                socket.on('disconnect', () => {
                    console.log(username + ' left the channel :' + namespace)
                    channelSvc.leaveChannel({ room, channel, username })
                })
            })
        },
        leaveChannel({ room, channel, username }) {
            const fndChannel = getChannel(room, channel)
            if (!fndChannel) {
                return Promise.reject(new Error(`channel ${channel} not found`))
            }

            console.log(username + ' leaving channel ' + channel)

            return new Promise((resolve, reject) => {
                if (fndChannel.users.includes(username)) {
                    const userIdx = fndChannel.users.findIndex((u) => u === username)
                    fndChannel.users.splice(userIdx, 1)
                }

                const { users, chats } = fndChannel

                const namespace = `rooms/${room}/${channel}`

                socket.leave(namespace, () => {
                    const resp = { room, channel, chats, users, username, namespace }
                    console.log(username + ' left the channel ' + channel)

                    socket.to(namespace).emit('leftChannel', resp)
                    resolve(resp)
                })
            })
        },
    })

    return channelSvc
}


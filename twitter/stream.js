import { getChannel, getCovidChannelNamespace } from '../server/io/rooms'

let Twit = require('twit')
let T = new Twit({
    consumer_key:         process.env.TWITTER_CONSUMER_KEY,
    consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
    access_token:         process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

let stream = T.stream('statuses/filter', { track: '#Covid19', language: 'en' })

export default function (req, res, next) {
    // req is the Node.js http request object
    let io = require('socket.io-client');
    let socket = io.connect('http://localhost:3000/channels',{secure: true,    rejectUnauthorized: false});

    socket.on('connect', function(){
        try {
            console.log('socket connect');

            stream.on('tweet', function (tweet) {
                socket.emit('sendMessageFromTwitter', tweet.text)
                /* It should be able to send an event to on socket IO*/
            })
        } catch(e) {
            console.log(e);
        }
    });

    next()
}
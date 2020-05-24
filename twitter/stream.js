let Twit = require('twit')
let T = new Twit({
    consumer_key:         'lva4S6c19emQLeLvLiJLOc4PY',
    consumer_secret:      'bUz5z6eBpbgOqtLimDXmtIVMxFvp2xy8J5T6M1ewXVaeu0Tp3J',
    access_token:         '252474636-A0uOrS5KjN6G18q2Zd5jRIK0iDXY5VgWXl51qefu',
    access_token_secret:  'WU5GOEymn2oLh49KBmwSHIarkegdJVj341PoK26FnJeXJ',
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

let stream = T.stream('statuses/filter', { track: '#Covid19', language: 'en' })

let io = require('socket.io-client');
let socket = io.connect('http://localhost:3000/channels',{secure: true,    rejectUnauthorized: false});

console.log('streaming started')
stream.on('tweet', function (tweet) {
    socket.emit('sendMessageFromTwitter', tweet.text)
})
//
// export default function (req, res, next) {
//     // console.log('awesome...')
//
//     // socket.on('connect', function(){
//     //     try {
//     //         console.log('socket connect');
//     //
//     //
//     //     } catch(e) {
//     //         console.log(e);
//     //     }
//     // });
//
//     // next()
// }
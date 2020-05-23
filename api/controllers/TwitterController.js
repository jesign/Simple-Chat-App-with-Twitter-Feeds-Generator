module.exports.covidFeeds = [
    // validations rules

    function (req, res) {

        const Twitter = require('twitter')

        const TwitterApi = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            bearer_token: process.env.TWITTER_BEARER_TOKEN
        })

        const endpoint = 'search/tweets.json'
        const params = {
            q: 'covid19',
            src: 'typed_query',
            count: 5
        }

        TwitterApi.get(endpoint, params, (error, tweets, response) => {
            return res.json({
                tweets: tweets
            })
        })    
    }
]
const axios = require('axios')

const TwitterService = {    
    getFeeds() {
        console.log(process.env.BASE_URL)
        return axios.get(process.env.BASE_URL + '/api/twitter/feeds');
    }
}

export default TwitterService
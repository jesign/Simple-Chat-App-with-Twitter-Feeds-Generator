const axios = require('axios')

const TwitterService = {    
    getFeeds() {
        return axios.get(process.env.BASE_URL + '/api/twitter/feeds');
    }
}

export default TwitterService
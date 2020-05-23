import TwitterService from '../services/twitter'

export const state = () => ({
    feeds: []
})


export const actions = {
    getCovidFeeds(context) {
        TwitterService.getFeeds().then(response => {
            let feeds = response.data.tweets.statuses;
            console.log(feeds)
            context.commit('updateFeeds', feeds)
        })
    }
}

export const mutations = {
    updateFeeds(state, feeds) {
        return state.feeds = feeds;
    }
}
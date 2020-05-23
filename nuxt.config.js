require('dotenv').config()

module.exports = {
    mode: 'universal',
    /*
    ** Headers of the page
    */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },
    /*
    ** Customize the progress-bar color
    */
    loading: { color: '#fff' },
    /*
    ** Global CSS
    */
    css: [
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [

    ],
    /*
    ** Nuxt.js dev-modules
    */
    buildModules: [
        '@nuxtjs/dotenv',
        '@nuxtjs/vuetify',
    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
        '@nuxtjs/axios',
        'nuxt-socket-io'
    ],
    io: {
        sockets: [
            {
                name: 'home',
                url: 'http://localhost:3000',
                default: true,
                vuex: { // optional
                    mutations: [{ progress: 'examples/SET_PROGRESS' }], // pass in the evt --> mutation map OR array of actions
                    actions: [{ getCovidFeeds: 'twitter/getCovidFeeds' }], // pass in the evt --> action map OR array of actions or mixed!,
                    emitBacks: [{'twitter/feeds': 'channel/newTwitterFeeds' }]
                },
                namespaces: {
                    '/rooms': {
                        emitters: [
                            'getRooms --> rooms',
                            'joinRoom + joinMsg --> roomInfo',
                            'leaveRoom + leaveMsg'
                        ],
                        listeners: ['joinedRoom [updateUsers', 'leftRoom [updateUsers']
                    },
                    '/channels': {
                        emitters: [
                            'getRealTimeTweets',
                            'joinChannel + joinMsg --> channelInfo',
                            'leaveChannel + leaveMsg',
                            'addMessage + msgObject --> msgRxd [appendChats',
                            'getTwitterFeeds --> twitterFeeds [newTwitterFeeds'
                        ],
                        listeners: [
                            'joinedChannel [updateChannelInfo',
                            'leftChannel [updateChannelInfo',
                            'newMessage [appendChats',
                            'newTwitterMessage [appendTwitterChat',
                            'localTwitterMessage [appendTwitterChat'
                        ]
                    }
                }
            }
        ]
    },
    /*
    ** 
    configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        extend (config, ctx) {
            config.node = {
                fs: 'empty'
            }
        }
    },
    
    serverMiddleware: [
        '~/api/index.js',
        '~/twitter/stream.js'
    ]
}

# Chat rooms with Twitter Feeds related to #Covid19

A simple chat app created using NuxtJS and Socket IO. 

It include Rooms with different Channels where people will be sending messages. 

It also includes Twitter Feeds Generator - this will fetch tweets from Twitter filtered by the given hashtag (in my case -#Covid19) and send it Covid Twitter Channel. 

Library used:
- [NuxtJS](https://nuxtjs.org/)
- [ExpressJs](https://expressjs.com/)
- [Nuxt Socket IO](https://www.npmjs.com/package/nuxt-socket-io)
- [Twitter for NodeJS](https://www.npmjs.com/package/twitter)

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev:server

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate

# Configuration
Simply copy .env.example to a new .env file then add your twitter api credentials

```

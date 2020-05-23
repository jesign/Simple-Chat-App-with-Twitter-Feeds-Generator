<template>
	<v-container data-app>
        <v-btn v-if="selectedChannel == 'twitter' && selectedRoom == 'Covid'" @click="getTwitterFeeds()">Get Covid Feeds</v-btn>
		<v-row>
            <v-col cols="4">
                <v-card>
                    <v-list shaped>
                        <v-subheader>Channels</v-subheader>
                        <v-list-item-group v-model="selectedChannel" color="primary">
                            <v-list-item
                            v-for="(channel, i) in channels"
                            :key="i"
                            :value="channel"
                            >
                            <v-list-item-content>
                                <v-list-item-title v-text="channel"></v-list-item-title>
                            </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                        <v-subheader>Online in Channel</v-subheader>
                        <v-list-item-group color="primary">
                            <v-list-item
                            v-for="(user, i) in channelInfo.users"
                            :key="i"
                            >
                            <v-list-item-icon>
                                <v-icon>mdi-account</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title v-text="user"></v-list-item-title>
                            </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-col>
            <v-col cols="8">
                <v-card class="message-card">
                    <v-card-text>
                        <v-alert dense v-for="(chat, i) in channelInfo.chats" :key="i">
                            {{chat.inputMsg}}
                            <p><small class="d-block">From: {{chat.username}}</small></p>
                        </v-alert>
                    </v-card-text>
                </v-card>
                <v-text-field outlined v-model="newMessage" @keyup.enter="addMessage()"></v-text-field>
            </v-col>
        </v-row>
	</v-container>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
    name: 'room',
    data(){
        return {
            selectedChannel: null,
            channelInfo: {},
            joinMsg: {},
            newMessage: '',
            leaveMsg: {},
            messages:[],
            twitterFeeds:[],
            twitterProgress: 0
        }
    },
    props: ['selectedRoom', 'channels', 'username'],
	components: {
		Logo
	},
    watch: {
        selectedRoom(newValue){
            if(!newValue)
                return;

            this.roomChanged(newValue);
            this.channelInfo = {}
        },
        selectedChannel(newChannel, oldChannel){
            if(oldChannel){
                this.leaveMsg = { room: this.selectedRoom, channel: oldChannel, username: this.username }
                this.leaveChannel().catch()
            }
            
            if(newChannel){
                this.joinMsg = { room: this.selectedRoom, channel: newChannel, username: this.username }
                this.joinChannel()
            }
        }
    },
    computed: {
        msgObject() {
            return {
                inputMsg: this.newMessage,
                username: this.username,
                room: this.selectedRoom,
                channel: this.selectedChannel,
                namespace: this.channelInfo.namespace
            }
        }
    },
	methods : {
		roomChanged(room){
            this.selectedChannel = null
        },
        appendChats(resp) {
            this.channelInfo.chats.push(resp)
            this.newMessage = ''
        },
        appendTwitterChat(response) {
            if ( this.selectedRoom == 'Covid' && this.selectedChannel == 'twitter') {
                this.channelInfo.chats.push(response)
            }
            
            // this.newMessage = ''
        },

        updateChannelInfo(resp) {
            const { room, users, channel } = resp
        
            if (room === this.selectedRoom && channel === this.selectedChannel) {
                Object.assign(this.channelInfo, { users })
            }
        },
        newTwitterFeeds(response){
            // console.log(response)
            // if ( this.selectedRoom == 'Covid' && this.selectedChannel == 'twitter') {
            //     this.channelInfo.chats.push(response)
            // }
        }
	},
	mounted(){
        this.socket = this.$nuxtSocket({ channel: '/channels' })
        this.getRealTimeTweets()
	}
}
</script>
<style>
    .message-card .v-card__text{
        overflow:scroll;
        height: 500px;
    }
</style>
<template>
	<v-container fluid data-app>
		<v-row>
            <v-col>
                <v-text-field :disabled="usernameEntered" v-model="username" outlined placeholder="Enter Username" @keyup.enter="usernameEntered = true"/>
            </v-col>
            <v-col>
                <v-select
                    v-show="usernameEntered"
                    v-model="selectedRoom"
                    :items="rooms"
                    solo
                    label="Filled style"
                ></v-select>
            </v-col>
        </v-row>
        <v-row v-show="usernameEntered">
            <v-col cols="2">
                <v-card>
                    <v-card-text>
                        <v-subheader>Online in room {{selectedRoom}}</v-subheader>
                        <span v-if="!roomInfo.users">No online</span>
                        <p v-for="(user, i) in roomInfo.users">{{user}}</p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="10">
                <room :selected-room="selectedRoom" :channels="roomInfo.channels" :username="username"/>
            </v-col>
        </v-row>
	</v-container>
</template>

<script>
import Room from '~/components/Room.vue'

export default {
    data(){
        return {
            usernameEntered: false,
            username: '',
            selectedRoom: null,
            rooms: [],
            roomInfo: {},
            users: []
        }
    },
	components: {
		Room
    },
    watch:{
        selectedRoom(newRoom, previousRoom){
            if(newRoom){
                this.joinMsg = {room: newRoom, user: this.username}
                this.joinRoom()
            }

            if(previousRoom){
                this.leaveMsg = {room: newRoom, user: this.username}
                this.leaveRoom()
            }
        }
    },
	methods : {
		getTwitterFeeds(){
            this.$store.dispatch("twitter/getCovidFeeds")
        },
        updateUsers(response){
            this.roomInfo.users = response.users
        }

	},
	mounted(){
        this.socket = this.$nuxtSocket({ channel: '/rooms' })
        this.getRooms()        
        this.getTwitterFeeds();
	}
}
</script>
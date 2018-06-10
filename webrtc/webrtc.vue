<template>
  <div class="hello">
    <button @click="start">开始会议</button>
    <button @click="wantIn">加入</button>

  </div>
</template>

<script>
import io from 'socket.io-client'
const socket = io('http://192.168.0.100:9000')

const ice = {
  iceServers: [
    { url: 'stun:stun.l.google.com:19302' }
    //     //  // TURN 一般需要自己去定义
    //     //  {
    //     //   'url': 'turn:192.158.29.39:3478?transport=udp',
    //     //   'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    //     //   'username': '28224511:1379330808'
    //     // },
    //     // {
    //     //   'url': 'turn:192.158.29.39:3478?transport=tcp',
    //     //   'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    //     //   'username': '28224511:1379330808'
    //     // }
  ]
}
import WebRTC from './webrtc.js'

export default {
  methods: {
    async start() {
      if (this.answers) return
      let stream = await navigator.mediaDevices.getUserMedia({
        video: true
      })
      this.answers = []
      this.createVideo(stream)
      socket.on('want-in', _ => {
        let rtc = new WebRTC({ socket, iceConfig: ice })
        this.answers.push(rtc)
        // this.pc = this.caller.pc
        // this.dc = this.caller.dc
        rtc.pc.addStream(stream)
      })
    },

    wantIn() {
      if (this.caller) return
      socket.emit('want-in')
      this.caller = new WebRTC({ socket, caller: true, iceConfig: ice })
      this.dc = this.caller.dc
      this.pc = this.caller.pc
      this.dc.onmessage = data => {
        console.log(data)
      }
      this.onAddVideo()
    },
    onAddVideo() {
      this.pc.onaddstream = function(obj) {
        this.createVideo(obj.stream)
      }
    },
    createVideo(stream) {
      let video = document.createElement('video')
      video.srcObject = stream
      document.body.appendChild(video)
      video.onloadedmetadata = _ => {
        video.play()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

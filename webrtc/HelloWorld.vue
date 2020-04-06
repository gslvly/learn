<template>
  <div class="hello">
    <button @click="start">开始会议</button>
    <button @click="wantIn">加入</button>
    <video class="t2"></video>
    <video class="t1"></video>
  </div>
</template>

<script>
import io from 'socket.io-client'
const socket = io('http://192.168.0.100:9000')

// var ice = {"iceServers": [
//      {"url": "stun:stun.l.google.com:19302"},
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
// ]};

const pc = new RTCPeerConnection()
pc.onaddstream = function(obj) {
  console.log(a++)
  let video = document.querySelector('.t1')

  video.srcObject = obj.stream
  video.onloadedmetadata = function(params) {
    video.play()
  }
}
let a = 1
export default {
  data() {
    return {
      url: ''
    }
  },
  methods: {
    start() {
      const config = { video: true }

      navigator.mediaDevices.getUserMedia(config).then(this.succ)
    },
    succ(stream) {
      // let a = stream.getTracks()
      // console.log(a)
      pc.onicecandidate = event => {
        console.log('candidate1', a++)
        socket.emit('candidate', event.candidate)
      }
      let dc = pc.createDataChannel('channel1') // , { negotiated: true, id: 0 }
      dc.onopen = _ => {
        console.log('dc', a++)
        dc.send('senddata')
      }
      dc.onmessage = e => {
        console.log('onmessage', e.data)
      }

      // pc.onaddstream({stream: stream})
      // Adding a local stream won't trigger the onaddstream callback
      let video = document.querySelector('.t2')
      pc.addStream(stream)
      video.srcObject = stream
      video.onloadedmetadata = function(params) {
        video.play()
      }
      pc
        .createOffer()
        .then(offer => {
          pc.setLocalDescription(new RTCSessionDescription(offer))
          return offer
        })
        .then(offer => {
          console.log('giveoffer', a++)
          socket.emit('offer', offer)
          // send the offer to a server to be forwarded to the friend you're calling.
        })
      socket.on('answer', offer => {
        console.log('getanswer', a++, offer)
        pc.setRemoteDescription(new RTCSessionDescription(offer))
      })
    },
    wantIn() {
      socket.emit('wantIn')
      pc.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('wantInCandidate', event.candidate)
        }
      }
      pc.ondatachannel = function(event) {
        let channel = event.channel
        channel.onmessage = function(data) {
          console.log(data)
        }
        channel.onopen = function open(params) {
          channel.send('i want in')
        }
        // let dc = pc.createDataChannel('channel1', { negotiated: true, id: 0 })
        // dc.onopen = function(params) {

        //   dc.send('hi, i want in')
        // }
        // dc.onmessage = function(event) {
        //   console.log('received: ' + event.data)
        // }
      }

      socket.on('offer', offer => {
        pc
          .setRemoteDescription(new RTCSessionDescription(offer))
          .then(res => {
            return pc.createAnswer()
          })
          .then(answer => {
            pc.setLocalDescription(new RTCSessionDescription(answer))
            socket.emit('answer', answer)
          })
      })
    }
  },
  created() {
    socket.on('candidate', candidate => {
      pc.addIceCandidate(new RTCIceCandidate(candidate))
    })
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

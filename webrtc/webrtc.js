
export default class {
  constructor({ socket, iceConfig, caller = false }) {

    this.pc = new RTCPeerConnection(iceConfig)
    
    this.pc.onicecandidate = event => {
      console.log('打洞')
      if (event.candidate) {
        socket.emit('candidate', event.candidate)
      }
    }

    // 打洞 获取candidate时 保存candidate 
    socket.on('candidate', candidate => {
      this.pc.addIceCandidate(new RTCIceCandidate(candidate))
    })


    if (caller) {
      // 创建description
      this.createOffer().then(offer => {
        socket.emit('offer', offer) // 发送offer
      })

      socket.on('answer', answer => {
        this.pc.setRemoteDescription(new RTCSessionDescription(answer))
      })
      // 打洞


      // 数据通道
      this.dc = this.pc.createDataChannel('channel')


    } else {
      
      // 创建description
      socket.on('offer', async offer => {
        // 必须先设置remoteDescription
        await this.pc.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await this.createAnswer()
        socket.emit('answer', answer)

      })
      //数据通道
      this.pc.ondatachannel = event => {
        this.dc = event.channel
      }

    }



  }

  /**
   * 发出offer
   */
  createOffer() {
    return this
      .pc
      .createOffer()
      .then(offer => {
        this.pc.setLocalDescription(new RTCSessionDescription(offer))
        return offer
      })
  }
  /**
   * 发送answer
   */
  createAnswer() {
    return this
      .pc
      .createAnswer()
      .then(answer => {
        this.pc.setLocalDescription(new RTCSessionDescription(answer))
        return answer
      })
  }

}
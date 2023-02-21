<template >
  <div v-if="loaded" >
    <vue-custom-scrollbar  :settings="scrollbarSettings" style="position:relative;width:calc(100vw - 9em);  border-radius: 8px;height: calc(100vh - 12em)">
    <div style="width: auto;    white-space: nowrap;">
      <div style="display: inline-block;vertical-align: top">
        <div style="margin: 2em;background: #282828;padding:2em;border-radius: 0.5em;width: 40em;">
          <h3>音量</h3>
          <a-row>
            <a-col :span="3">
              <div style="cursor: pointer" v-if="!muted" @click="setMuted">
                <Icon icon="#icon-yinliang" style="font-size: 3em"></Icon>
              </div>
              <div style="cursor: pointer" v-else @click="cancelMuted">
                <Icon icon="#icon-jingyin" style="font-size: 3em"></Icon>
              </div>
            </a-col>
            <a-col :span="21">
              <a-slider @after-change="setVol" v-model:value="vol"></a-slider>
            </a-col>
          </a-row>
          <div>
          </div>
        </div>
        <div style="margin: 2em;background: #282828;padding:2em;border-radius: 0.5em;width: 40em;">
          <h3>屏幕亮度</h3>
          <a-row>
            <a-col :span="3">
              <div>
                <Icon icon="#icon-icon_qingtian" style="font-size: 3em;filter: grayscale(100%)"></Icon>
              </div>
            </a-col>
            <a-col :span="21">
              <a-slider @after-change="setBright" v-model:value="bright"></a-slider>
              <p style="margin-top:1em;font-size: 1.2em;padding-left: 0.3em">
                调整屏幕亮度需要用到高权限接口，可能造成安全软件误报。</p>
            </a-col>
          </a-row>


          <div>

          </div>
        </div>
      </div>

    <div style="display: inline-block;">
      <div style="margin: 2em;background: #282828;padding:2em;border-radius: 0.5em;width: 20em;vertical-align: top">
        <h3>音频输出设备</h3>
            <div v-for="audio in audioList" >
              <div @click="setAudio(audio)" class="audio" :class="{'active':audio.isDefaultForMultimedia}">
                <Icon icon="#icon-yinlianglabashengyin" style="font-size: 1.2em"></Icon> {{audio.name}} <span v-if="audio.deviceId==='default'">当前</span>
              </div>
            </div>
        <div>
        </div>
      </div>
      <audio id="speakerAudio" src='/sound/gua.mp3' autoPlay="autoplay"      >
        您的浏览器暂不支持音频播放
      </audio>
    </div>
      <div style="display: inline-block;vertical-align: top">
      <div style="margin: 2em;background: #282828;padding:2em;border-radius: 0.5em;width: 40em;vertical-align: top;">
        <h3>音频输入设备</h3>
            <div v-for="audio in micList" >
              <div @click="setAudio(audio)" class="audio" :class="{'active':audio.deviceId==='default'}">
                <Icon icon="#icon-maikefeng" style="font-size: 1.2em"></Icon> {{audio.label}} <span v-if="audio.deviceId==='default'">当前</span>
              </div>
            </div>

        </div>
      </div>
    </div>

    <div>
    </div>
    </vue-custom-scrollbar>
  </div>

</template>

<script>
const loudness = require('loudness')
const brightness = require('brightness')
const {listOutputs,setAsDefault} =require('@josephuspaye/win-audio-outputs')
export default {
  name: 'Status',
  data () {
    return {
      muted: false,
      vol: 50,
      bright: 50,
      timer: null,
      loaded:false,
      audioList:[],
      micList:[],
      scrollbarSettings: {
        useBothWheelAxes:true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },
    }
  },
  async mounted () {
    setTimeout(()=>{
      //const [audioList, setAudioList] = useState([]);
      //获取音频列表
      // const getSpeakerList = () => {
      //   navigator.mediaDevices
      //     .enumerateDevices()
      //     .then( (devices) =>{
      //       let list = [];
      //       devices.forEach((device)=> {
      //         if (device.kind === 'audiooutput') {
      //           device.value=device.deviceId
      //           list.push(device);
      //         }else if(device.kind==='audioinput'){
      //           this.micList.push(device)
      //         }
      //       });
      //       this.audioList=list
      //       console.log(list)
      //     })
      //     .catch(function (err) {
      //       console.log(err.name + ': ' + err.message);
      //     });
      // };
      const getSpeakerList = () => {
       listOutputs().then( (devices) =>{
            let list = [];
            console.log(devices)
            devices.forEach((device)=> {
                device.value=device.id
                list.push(device);
              // }else if(device.kind==='audioinput'){
              //   this.micList.push(device)
              // }
            });
            this.audioList=list
            console.log(list)
          })
          .catch(function (err) {
            console.log(err.name + ': ' + err.message);
          });
      };
      getSpeakerList()
    },0)
    this.loaded=true
    await this.getVals()

    this.timer = setInterval(() => {
      this.getVals()
    }, 2000)


  },
  beforeUnmount () {
    clearInterval(this.timer)
  },
  methods: {
    async getSpeakerList () {
      listOutputs().then( (devices) =>{
        let list = [];
        console.log(devices)
        devices.forEach((device)=> {
          device.value=device.id
          list.push(device);
        });
        this.audioList=list
        console.log(list)
      })
        .catch(function (err) {
          console.log(err.name + ': ' + err.message);
        });
    },
    async getVals () {
      this.muted = await loudness.getMuted()
      this.vol = await loudness.getVolume()
      this.bright = (await brightness.get()) * 100
    },
    async setVol () {
      await loudness.setVolume(Number(this.vol))
    },
    async setBright () {
      console.log(this.bright)
      await brightness.set((Number(this.bright) / 100))
      console.log((Number(this.bright) / 100).toFixed(1))
    },
    async setAudio(audio){
      await setAsDefault(audio)
      audio.isDefaultForMultimedia=true
      let audioSpeaker=document.getElementById('speakerAudio')
      await this.getSpeakerList()
      // console.log(audioSpeaker)
      // let re=new RegExp("")
      //
      // let label=audio.label
      // let name=label.substring(0,label.indexOf('(')-1)
      // console.log(name)
      // console.log(audio)
      //  this.shell('setdefaultsounddevice "'+audio.label+'"')
      audioSpeaker.play()
     // navigator.mediaDevices.selectAudioOutput()
    },
    async setMuted () {
      await loudness.setMuted(true)
      this.muted = true
    },
    async cancelMuted () {
      await loudness.setMuted(false)
      this.muted = false
    },
    async shell(cmd,cb){
      let rs=await ipc.invoke('shell', { cmd })
      if(rs){
        cb(rs)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.audio{
  border-radius: 0.2em;
  padding: 0.5em;
  font-size: 1.2em;
  cursor: pointer;
  width: 100%;
  word-break: break-all;
  white-space: pre-wrap;

  &.active{
    background: #565656;
    border-radius: 3px;
    font-weight: bold;
  }
  &:hover{
    background: rgba(86, 84, 84, 0.62);
  }
}
</style>

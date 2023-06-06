window.listenningAudioInput=null
window.recording=false
window.closeRecorder=null
const audio={
  startListen(handler,onSuccess,onError){
    if(window.listenningAudioInput){
      onError('已经监听了')
    }
    window.listenningAudioInput=true
    if(typeof navigator.getUserMedia ==='undefined'){
      return
    }
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (!navigator.getUserMedia) {
      if(onError)
        onError('不具备媒体能力')
    }
    navigator.getUserMedia({ audio: true }, success, error); //调用麦克风捕捉音频信息，成功时触发onSuccess函数，失败时触发onError函数
    function error() {
      if(onError)
      onError('获取失败')
    }
    function success(stream) {
      if(onSuccess){
        onSuccess(stream)
      }
      //创建一个音频环境对像
      const audioContext = window.AudioContext || window.webkitAudioContext;
      let context = new audioContext();

      //将声音输入这个对像
      const audioInput = context.createMediaStreamSource(stream);

      //设置音量节点
      let volume = context.createGain();
      audioInput.connect(volume);

      //创建缓存，用来缓存声音
      var bufferSize = 2048;

      // 创建声音的缓存节点，createJavaScriptNode方法的
      // 第二个和第三个参数指的是输入和输出都是双声道。
      let recorder = context.createScriptProcessor(bufferSize, 1, 1);

      // 录音过程的回调函数，基本上是将左右两声道的声音
      // 分别放入缓存。
      recorder.onaudioprocess = function (e) {
        var buffer = e.inputBuffer.getChannelData(0); //获得缓冲区的输入音频，转换为包含了PCM通道数据的32位浮点数组
        //创建变量并迭代来获取最大的音量值
        var maxVal = 0;
        for (var i = 0; i < buffer.length; i++) {
          if (maxVal < buffer[i]) {
            maxVal = buffer[i];
          }
        }
        //显示音量值
       // console.log('执行回调')
       // mystatus.innerHTML = "您的音量值：" + Math.round(maxVal * 100);
        handler(Math.round(maxVal * 100))
        // if (maxVal > .5) {
        //   //当音量值大于0.5时，显示“声音太响”字样，并断开音频连接
        //   mystatus.innerHTML = "您的声音太响了!!";
        //   // liveSource.disconnect(levelChecker);
        // }
      }

      // 将音量节点连上缓存节点，换言之，音量节点是输入
      // 和输出的中间环节。
      volume.connect(recorder);
      window.recording=true
      // 将缓存节点连上输出的目的地，可以是扩音器，也可以
      // 是音频文件。
      recorder.connect(context.destination);
      window.closeRecorder=()=>{
        console.info('执行销毁')
        volume.disconnect()
        recorder.disconnect()
        audioInput.disconnect()
        audioContext.close()
      }
      return handler
    }
  },
  disconnect(){
    if(window.listenningAudioInput && window.recording){
      window.recording=false
      window.listenningAudioInput=null
      console.info('关闭监听')
      window.closeRecorder()

    }
  },

  getDevices(cb){
    if(typeof navigator.getUserMedia ==='undefined'){
      return
    }
    navigator.mediaDevices.enumerateDevices().then((list) => {

      list.forEach((li)=>{
        if(li.deviceId!=='default' && li.deviceId!=='communications'){
          li.display=true
        }else{
          li.display=false
        }
      })
      let defaultOutput
      let outputs=list.filter(li=>{
        if(li.deviceId==='default' && li.kind==='audiooutput'){
          defaultOutput=li
        }
        return li.kind==='audiooutput'
      })

      let defaultInput
      let inputs=list.filter(li=>{
        if(li.deviceId==='default' && li.kind==='audioinput'){
          defaultInput=li
        }
        return li.kind==='audioinput'
      })

      cb({
        outputs:outputs,
        inputs:inputs,
        defaultOutput,
        defaultInput
      })
    })
  }
}
export default audio

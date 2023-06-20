<template>
  <!-- <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" class="min-capture" style="height: calc(80vh - 12.8em);">
    <div class="max-container px-4">
      <div class="s-bg capture-container rounded-md p-4 mr-4">
        <div class="flex mb-3">
          <div @click="startScreenshot"
           class="cp-w cp-orange-active cp-orange flex pointer flex-col rounded-lg items-center justify-center mr-3"
          >
            <div class="cp-orange-2 mb-3 w-20 flex items-center justify-center  rounded-full h-20">
             <div class="rounded-full orange-full flex items-center justify-center cp-lw">
              <Icon icon="camera" style="font-size: 2em;color:rgba(255, 255, 255, 0.8);"></Icon>
             </div>
            </div>
            <div class="cp-text">截取屏幕</div>
          </div>
          <div @click="startRecording" class="cp-w cp-red-active orange-red-1 pointer flex flex-col rounded-lg items-center justify-center mr-3">
            <div class="w-20 h-20 flex orange-red-2  items-center rounded-full justify-center mb-3">
              <div class="rounded-full orange-red-full flex items-center justify-center cp-lw">
                <Icon icon="record-circle-line" style="font-size: 2em;color:rgba(255, 255, 255, 0.8);"></Icon>
              </div>
            </div>
            <div class="cp-text">开始录制</div>
          </div>
          <div @click="startMonitoring">
            <div  class="cp-w s-item  pointer flex flex-col rounded-lg items-center justify-center " v-if="isMonitor === false">
              <div class="w-20 h-20 flex  items-center rounded-full justify-center mb-3">
                <div class="rounded-full dark-blue-full flex items-center justify-center cp-lw">
                  <AreaChartOutlined style="font-size: 2em;color:rgba(255, 255, 255, 0.8);"></AreaChartOutlined>
                </div>
              </div>
              <div class="cp-text" >开启监控</div>
            </div>
            <div  class="cp-w s-item dark-blue-1 pointer flex flex-col rounded-lg items-center justify-center "  v-else>
              <div class="w-20 h-20 flex dark-blue-2 items-center rounded-full justify-center mb-3">
                <div class="rounded-full dark-blue-full flex items-center justify-center cp-lw">
                  <AreaChartOutlined style="font-size: 2em;color:rgba(255, 255, 255, 0.8);"></AreaChartOutlined>
                </div>
              </div>
              <div class="cp-text">关闭监控</div>
            </div>
          </div>
        </div>
        <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: calc(85vh - 11.8em);">
          <div class="flex flex-col mb-3">
            <div class="flex justify-between mb-3">
              <div class="flex items-center justify-center">
                <Icon icon="setting" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);"></Icon>
                <span class="record-set ml-1">录制设置</span>
              </div>
              <div class="flex items-center pointer justify-center"  @click="openRecordSet">
                <Icon icon="gengduo1" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.6);"></Icon>
              </div>
            </div>
          </div>
          <div class="s-item rounded-md p-4 mb-3">
            <div class="flex items-center mb-5">
              <div class="pointer" @click="closeSound">
                <Icon icon="yinliang" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);" v-if="soundShow"></Icon>
                <Icon icon="jingyin" v-else style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);"></Icon>
              </div>
              <span class="mx-3" style="color:rgba(255, 255, 255, 0.85);">系统声音</span>
              <div style="width:331px;">
                <a-slider v-model:value="systemSound"></a-slider>
              </div>
            </div>
            <div class="flex items-center">
              <div class="pointer" @click="closeMicrophone">
                <Icon icon="mic-on" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);" v-if="microphoneShow"></Icon>
                <Icon icon="mic-off" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);" v-else></Icon>
              </div>
              <span style="margin: 0 19px;color:rgba(255, 255, 255, 0.85);">麦克风</span>
              <div style="width:331px;">
                <a-slider v-model:value="systemMicrophone"></a-slider>
              </div>
            </div>
          </div>
          <div class="flex flex-col">
            <HorizontalCapture :navList="captureType" v-model:selectType="defaultRecordingType" class="mb-4"></HorizontalCapture>
            <template v-if="defaultRecordingType.name === 'recordGame'">
              <div v-if="recordGameData.length === 0">
                <a-empty :image="simpleImage" />
              </div>
              <div class="flex justify-between flex-wrap" v-else>
                <div v-for="(item,index) in recordGameData" class="flex flex-col s-bg rounded-lg mb-4  record-game-item"
                 @click="clickRecordGame(item,index)" :class="{'s-active':defaultIndex === index}"
                >
                  <img :src="item.url" class="w-full rounded-lg h-full object-cover">
                  <span class="px-4 py-3 truncate" style="max-width:207px;">{{ item.name}} </span>
                </div>
              </div>
            </template>
            <template v-if="defaultRecordingType.name === 'recordFullScreen'">
              <div v-if="recordGameData.length === 0">
                <a-empty :image="simpleImage" />
              </div>
              <div class="flex justify-between flex-wrap" v-else>
                <div v-for="(item,index) in  recordFullScreenData"
                 class="flex flex-col s-bg rounded-lg mb-4  record-game-item"
                 @click="clickRecordGame(item,index)" :class="{'s-active':defaultIndex === index}"
                >
                  <img :src="item.url" class="w-full rounded-lg h-full object-cover">
                  <span class="px-4 py-3 truncate" style="max-width:207px;">{{ item.name}} </span>
                </div>
              </div>
            </template>
            <template v-if="defaultRecordingType.name === 'logger'">
              <div v-if="recordLogger.length === 0">
                <a-empty :image="simpleImage" />
              </div>
              <div class="flex justify-between flex-wrap" v-else>
                <div v-for="(item,index) in  recordLogger"
                 class="flex flex-col s-bg rounded-lg mb-4  record-game-item"
                 @click="clickRecordGame(item,index)" :class="{'s-active':defaultIndex === index}"
                >
                  <img :src="item.url" class="w-full rounded-lg h-full object-cover">
                  <span class="px-4 py-3 truncate" style="max-width:207px;">{{ item.name}} </span>
                </div>
              </div>
            </template>
          </div>
        </vue-custom-scrollbar>
      </div>
      <div class="w-full  flex flex-col">
        <div class="s-bg rounded-md mb-3 p-3" v-if="isMonitor === true">
          <div class="flex  justify-between justify-center mb-3">
            <div class="flex items-center ">
               <Icon icon="game" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);"></Icon>
               <span class="ml-2 monitor-text">{{ monitorTitle }}</span>
            </div>
            <div @click="openMonitorSet" class="flex items-center justify-center pointer">
              <Icon icon="gengduo1" style="font-size: 1.5em;"></Icon>
            </div>
          </div>
          <template v-if="selectIndex === 'f'">
            <div class="flex">
               <div class="mr-6 w-full">
                 <div id="fps" ref="fpsChart" class="echarts"></div>
               </div>
               <div class="flex flex-col justify-between w-2/3">
                 <div class="flex justify-between mb-5">
                   <span class="fps-sm">实时</span>
                   <span class="fps-hz">144hz</span>
                 </div>
                 <div class="flex justify-between mb-5">
                   <span class="fps-sm">平均</span>
                   <span class="fps-hz">99hz</span>
                 </div>
                 <div class="flex justify-between mb-2">
                   <span class="fps-sm">1%LOW</span>
                   <span class="fps-hz">87hz</span>
                 </div>
               </div>
            </div>
          </template>
          <template v-if="selectIndex === 'p'">
            <div class="flex justify-between">
              <div class="px-5 flex flex-col s-bg py-8 rounded-lg cpu-w">
                <div class="fps-text flex items-center  justify-center">{{CPUGPUData.useCPU.value}}%</div>
                <div class="flex items-center justify-center">
                  <Icon icon="cpu" style="font-size: 1.75em;color:rgba(255, 255, 255, 0.85);"></Icon>
                  <span class="ml-2 fps-t">CPU</span>
                </div>
              </div>
              <div class="px-5 flex flex-col s-bg py-8 rounded-lg cpu-w">
                <div class="fps-text flex items-center  justify-center">{{CPUGPUData.useGPU.value}}</div>
                <div class="flex items-center justify-center">
                  <Icon icon="cpu" style="font-size: 1.75em;color:rgba(255, 255, 255, 0.85);"></Icon>
                  <span class="ml-2 fps-t">GPU</span>
                </div>
              </div>
              <div class="px-5 flex flex-col s-bg py-8 rounded-lg cpu-w">
                <div class="fps-text flex items-center  justify-center">144</div>
                <div class="flex items-center justify-center">
                  <Icon icon="game" style="font-size: 1.75em;color:rgba(255, 255, 255, 0.85);"></Icon>
                  <span class="ml-2 fps-t">FPS</span>
                </div>
              </div>
            </div>
          </template>
          <template v-if="selectIndex === 's'">
            <div class="s-bg flex flex-col py-8 rounded-lg items-center">
              <div class="fps-text pb-4">144</div>
              <div class="flex items-center justify-center">
                 <Icon icon="game" style="font-size: 1.75em;color:rgba(255, 255, 255, 0.85);"></Icon>
                 <span class="ml-3 fps-t">FPS</span>
              </div>
            </div>
          </template>
        </div>
        <vue-custom-scrollbar class="rounded-md"   @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: calc(100vh - 11.8em);">
          <div class="s-bg rounded-md mb-3 p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center justify-center">
                <Icon icon="video" style="font-size: 1.75em;color:rgba(255, 255, 255, 0.85);"></Icon>
                <span class="ml-3" style="font-size: 16px;color: rgba(255,255,255,0.85);font-weight: 400;">最近截屏和录制</span>
              </div>
              <div class="flex items-center pointer justify-center"  @click="openRecordSet">
                <Icon icon="gengduo1" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.6);"></Icon>
              </div>
            </div>
            <HorizontalCapture :navList="lastCapture" v-model:selectType="defaultLastCap" class="mb-3"></HorizontalCapture>
            <template v-if="defaultLastCap.name === 'screenCap'">
            <div>截屏</div>
            </template>
            <template v-else>
              <div>录制</div>
            </template>
          </div>
        </vue-custom-scrollbar>
      </div>
    </div>
  </vue-custom-scrollbar> -->


  <div class="px-4 max-capture flex" style="height: 100%">
    <div class="s-bg rounded-md cap-left px-4 py-2" style="height: 100%">


      <!--  选择录制源    -->
      <div style="width: 490px;height: 100%" >
        <div v-if="step===1" style="height: 100%">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
              <Icon icon="video" style="font-size: 1.75em;color:rgba(255,255,255,0.85)"></Icon>
              <span class="title-color ml-3">捕获</span>
            </div>
            <div class="flex items-center pointer justify-center" @click="openRecordSet">
              <Icon icon="gengduo1" style="font-size: 1.75em;color:rgba(255,255,255,0.85)"></Icon>
            </div>
          </div>
          <HorizontalCapture @click="refreshSource" :navList="captureType" v-model:selectType="defaultRecordingType"
                             class="mb-4"></HorizontalCapture>
          <div class="text-center" v-if="loading===true">
            捕获源获取中…
          </div>
          <div v-else style="height: 100%">
            <template v-if="defaultRecordingType.name === 'recordGame'">
              <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller"
                                    style="height:100%;">
                <div v-if="recordGameData.length === 0">
                  <a-empty :image="simpleImage"/>
                </div>
                <div class="flex justify-between flex-wrap" v-else>
                  <div v-for="(item,index) in recordGameData"
                       class="flex pointer flex-col s-bg rounded-lg mb-4  record-game-item"
                       @click="clickRecordGame(item,index)" :class="{'s-active':defaultIndex === index}"
                  >
                    <img :src="item.url" class="w-full rounded-lg h-full object-cover">
                    <div class="px-4 py-3">
                      <span class="truncate" style="max-width:150px;">{{ item.name }}  </span>
                    </div>
                  </div>
                </div>
              </vue-custom-scrollbar>
            </template>
            <template v-if="defaultRecordingType.name === 'recordFullScreen'">
              <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller"
                                    style="height:100%;">
                <div v-if="recordGameData.length === 0">
                  <a-empty :image="simpleImage"/>
                </div>
                <div class="flex justify-between flex-wrap" v-else>
                  <div v-for="(item,index) in  deskSource"
                       class="flex flex-col s-bg rounded-lg mb-4 pointer record-game-item"
                       @click="chooseSource(item,index)" :class="{'s-active':defaultIndex === index}"
                  >
                    <img :src="'file://'+item.src" class="w-full rounded-lg h-full object-cover">
                    <div class="px-4 py-3">
                      <span class="truncate" style="max-width:207px;">{{ item.name }} </span>
                    </div>
                  </div>
                </div>
              </vue-custom-scrollbar>
            </template>
            <template v-if="defaultRecordingType.name === 'logger'">
              <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller"
                                    style="height:100%;">
                <div v-if="recordLogger.length === 0">
                  <a-empty :image="simpleImage"/>
                </div>
                <div class="flex justify-between flex-wrap" v-else>
                  <div v-for="(item,index) in  windowSource"
                       class="flex flex-col justify-between s-bg rounded-lg mb-4 pointer record-game-item"
                       @click="chooseSource(item,index)" :class="{'s-active':defaultIndex === index}"
                  >
                    <img :src="'file://'+item.src" class="w-full rounded-lg h-full object-cover">
                    <div class="px-4 py-3 truncate">
                      <span class="" style="max-width:207px;">{{ item.name }} </span>
                    </div>
                  </div>
                </div>
              </vue-custom-scrollbar>
            </template>
          </div>
        </div>
        <div v-if="step===2" style="height: 100%">
          <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%">


          <div class="flex items-center justify-between mb-3">

          </div>
          <div style="height: 5em;position: relative">
            <back-btn @click="step=1" style="margin-top: -30px;margin-left: -30px"></back-btn>
            <div style="position: absolute;left:60px;top:10px;font-size: 16px">已选择：
              <a-avatar v-if="currentSource.type==='window'" :size="24" shape="square"
                        :src="'file://'+currentSource.icon"></a-avatar>
              {{ currentSource.name }}
            </div>
            <div v-if="false" style="z-index: 99899999;position: absolute;left:130px;top: 120px;background: white;color: black">功能正在开发中，当前还不可使用</div>
            <div style="position: absolute;right: 0.5em">
              <div class="flex items-center pointer justify-center" @click="openRecordSet">
                <Icon icon="gengduo1" style="font-size: 1.75em;color:rgba(255,255,255,0.85)"></Icon>
              </div>
            </div>
          </div>
          <div class="flex mb-3">
            <div  class="cp-w cp-orange-1 flex-col rounded-lg pointer mr-3 screenshot" @click="screenshot">
              <div class="cp-orange-2 mb-3 w-20 flex items-center justify-center  rounded-full h-20">
                <div class="rounded-full cp-orange-full flex items-center justify-center cp-lw">
                  <Icon icon="camera" style="font-size: 2em;color:rgba(255, 255, 255, 0.8);"></Icon>
                </div>
              </div>
              <div class="cp-text">截图</div>
            </div>

            <div v-if="!recording"  @click="startRecording" class="cp-w cp-red-active cp-red-1 pointer flex-col rounded-lg mr-3">
              <div class="w-20 h-20 flex cp-red-2  items-center rounded-full justify-center mb-3">
                <div class="rounded-full cp-red-full flex items-center justify-center cp-lw">
                  <Icon icon="record-circle-line" style="font-size: 2em;color:rgba(255, 255, 255, 0.8);"></Icon>
                </div>
              </div>
              <div class="cp-text">开始录制</div>
            </div>
            <div v-else  @click="stopRecording" class="cp-w cp-red-active cp-red-1 pointer flex-col rounded-lg mr-3">
              <div class="w-20 h-20 flex cp-red-2  items-center rounded-full justify-center mb-3">
                <div class="rounded-full cp-red-full flex items-center justify-center cp-lw">
                  <Icon icon="record-circle-line" style="font-size: 2em;color:rgba(255, 255, 255, 0.8);"></Icon>
                </div>
              </div>
              <div class="cp-text">停止录制</div>
            </div>



            <div @click="startMonitoring">
              <div class="cp-w s-item  pointer  flex-col rounded-lg " v-if="isMonitor === false">
                <div class="w-20 h-20 flex  items-center rounded-full justify-center mb-3">
                  <div class="rounded-full dark-blue-full flex items-center justify-center cp-lw">
                    <AreaChartOutlined style="font-size: 2em;color:rgba(255, 255, 255, 0.8);"></AreaChartOutlined>
                  </div>
                </div>
                <div class="cp-text">开启监控</div>
              </div>
              <div class="cp-w s-item dark-blue-1 pointer  flex-col rounded-lg" v-else>
                <div class="w-20 h-20 flex dark-blue-2 items-center rounded-full justify-center mb-3">
                  <div class="rounded-full dark-blue-full flex items-center justify-center cp-lw">
                    <AreaChartOutlined style="font-size: 2em;color:rgba(255, 255, 255, 0.8);"></AreaChartOutlined>
                  </div>
                </div>
                <div class="cp-text">关闭监控</div>
              </div>
            </div>
          </div>
          <div class="s-item rounded-md p-4 mb-3" v-if="isHeight === true">
            <div class="flex items-center mb-5">
              <div class="pointer" @click="closeSound">
                <Icon icon="yinliang" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);" v-if="soundShow"></Icon>
                <Icon icon="jingyin" v-else style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);"></Icon>
              </div>
              <span class="mx-3" style="color:rgba(255, 255, 255, 0.85);">系统声音</span>
              <div style="width:331px;">
                <a-slider v-model:value="systemSound"></a-slider>
              </div>
            </div>
            <div class="flex items-center">
              <div class="pointer" @click="closeMicrophone">
                <Icon icon="mic-on" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);"
                      v-if="microphoneShow"></Icon>
                <Icon icon="mic-off" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);" v-else></Icon>
              </div>
              <span style="margin: 0 19px;color:rgba(255, 255, 255, 0.85);">麦克风</span>
              <div style="width:331px;">
                <a-slider v-model:value="systemMicrophone"></a-slider>
              </div>
            </div>
          </div>
            <div style="text-align: center" v-if="recording">
              <icon icon="record-circle-line" style="color:red" ></icon> 正在录制视频：已录制{{recordedTimeStr}}，
              码率：{{(this.settings.videoBitsPerSecond/1024/1024).toFixed(2)}}Mbps 预估大小：{{(this.settings.videoBitsPerSecond/1024/1024/8*this.recordedSeconds).toFixed(2)}}MB
            </div>
<!--  捕获预览        -->
          <div  v-if="recentFileName && !recording">
            <div v-if="recentType==='video'">
              <div class="mb-2 truncate">最后录屏：
                {{recentFileName}}
              </div>
              <div class="mb-2">
                <a-button @click="openRecent" class="mr-2">打开</a-button>
                <a-button @click="openPos" class="mr-2">浏览</a-button>
                <a-button @click="saveRecent" class="mr-2">另存为</a-button>
                <a-button @click="delRecent" type="danger" class="mr-2">删除</a-button>
              </div>
              <VideoItem :key="recentKey" :options="{controls:true,loop:false}" :url="'file://'+this.getRecentVideoPath()"></VideoItem>

            </div>
            <div v-else>
              <div class="mb-2 truncate">最后捕获：
                {{recentFileName}}
              </div>
              <div class="mb-2">
                <a-button @click="openRecent" class="mr-2">打开</a-button>
                <a-button @click="openPos" class="mr-2">浏览</a-button>
<!--                <a-button @click="editRecent" class="mr-2">编辑</a-button>-->
                <a-button @click="saveRecent" class="mr-2">另存为</a-button>
                <a-button @click="delRecent" type="danger" class="mr-2">删除</a-button>
              </div>
              <a-image style="width: 100%;border-radius: 4px" :src="recentScreenShot"></a-image>
            </div>
            </div>

          </vue-custom-scrollbar>
        </div>
      </div>

    </div>
    <div class="ml-3 rounded-md w-full flex flex-col cap-right">
      <div class="s-bg rounded-md mb-3 p-3" v-if="isMonitor === true">
        <div class="flex  justify-between justify-center mb-3">
          <div class="flex items-center ">
            <Icon icon="game" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);"></Icon>
            <span class="ml-2 monitor-text">{{ monitorTitle }}</span>
          </div>
          <div @click="openMonitorSet" class="flex items-center justify-center pointer">
            <Icon icon="gengduo1" style="font-size: 1.5em;"></Icon>
          </div>
        </div>
        <template v-if="selectIndex === 'f'">
          <div class="flex">
            <div class="mr-6 w-full">
              <div id="fps" ref="fpsChart" class="echarts"></div>
            </div>
            <div class="flex flex-col justify-between w-2/3">
              <div class="flex justify-between mb-5">
                <span class="fps-sm">实时</span>
                <span class="fps-hz">144hz</span>
              </div>
              <div class="flex justify-between mb-5">
                <span class="fps-sm">平均</span>
                <span class="fps-hz">99hz</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="fps-sm">1%LOW</span>
                <span class="fps-hz">87hz</span>
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="selectIndex === 'p'">
          <div class="flex justify-between">
            <div class="px-5 flex flex-col s-item py-8 rounded-lg cpu-w">
              <div class="fps-text flex items-center  justify-center">{{ CPUGPUData.useCPU.value }}%</div>
              <div class="flex items-center justify-center">
                <Icon icon="cpu" style="font-size: 1.75em;color:rgba(255, 255, 255, 0.85);"></Icon>
                <span class="ml-2 fps-t">CPU</span>
              </div>
            </div>
            <div class="px-5 flex flex-col s-item py-8 rounded-lg cpu-w">
              <div class="fps-text flex items-center  justify-center">{{ CPUGPUData.useGPU.value }}</div>
              <div class="flex items-center justify-center">
                <Icon icon="cpu" style="font-size: 1.75em;color:rgba(255, 255, 255, 0.85);"></Icon>
                <span class="ml-2 fps-t">GPU</span>
              </div>
            </div>
            <div class="px-5 flex flex-col s-item py-8 rounded-lg cpu-w">
              <div class="fps-text flex items-center  justify-center">144</div>
              <div class="flex items-center justify-center">
                <Icon icon="game" style="font-size: 1.75em;color:rgba(255, 255, 255, 0.85);"></Icon>
                <span class="ml-2 fps-t">FPS</span>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="s-bg flex flex-col py-8 rounded-lg items-center">
            <div class="fps-text pb-4">144</div>
            <div class="flex items-center justify-center">
              <Icon icon="game" style="font-size: 1.75em;color:rgba(255, 255, 255, 0.85);"></Icon>
              <span class="ml-3 fps-t">FPS</span>
            </div>
          </div>
        </template>
      </div>
      <div class="grow s-bg rounded-md p-3">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center justify-center">
            <Icon icon="video" style="font-size: 1.75em;color:rgba(255, 255, 255, 0.85);"></Icon>
            <span class="ml-3"
                  style="font-size: 16px;color: rgba(255,255,255,0.85);font-weight: 400;">最近截屏和录制</span>
          </div>
          <div class="flex items-center pointer justify-center" @click="openRecordSet">
            <Icon icon="gengduo1" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.6);"></Icon>
          </div>
        </div>
        <HorizontalCapture :navList="lastCapture" v-model:selectType="defaultLastCap" class="mb-3"></HorizontalCapture>

        <div>
          <template v-if="defaultLastCap.name === 'screenCap'">
            <div class="p-2" v-if="!settings.imageSavePath">
              <div class="mb-3 fps-t mb-2 ">需先设置截屏保存位置：</div>
              <div @click="setImageSavePath" class="text-center mb-3 py-3 s-item rounded-lg">设置截屏保存位置</div>
            </div>
            <vue-custom-scrollbar v-else class="rounded-md" @touchstart.stop @touchmove.stop @touchend.stop
                                  :settings="settingsScroller" style="height:65vh;">
              <div class="flex flex-row flex-wrap content-game">
                <div class="game-list-item px-1.5 pb-4  my-game-content my-image"
                     v-for="item in pagedImages">
                  <img style="object-fit: contain" :width="160" :height="90" :src="'file://'+item.path"
                       class=" rounded-md img">
                </div>
              </div>
            </vue-custom-scrollbar>
          </template>
          <template v-else>
            <div class="p-2" v-if="!settings.videoSavePath">
              <div class="mb-3 fps-t">需先设置录屏保存位置：</div>
              <div @click="setVideoSavePath" class="text-center mb-3 py-3 s-item rounded-lg">设置录屏保存位置</div>
            </div>
            <vue-custom-scrollbar v-else class="rounded-md" @touchstart.stop @touchmove.stop @touchend.stop
                                  :settings="settingsScroller" style="height:65vh;">
              <div class="flex flex-row flex-wrap content-game ">
                <div class="game-list-item px-1.5 pb-4 flex-shrink-0 my-game-content "
                     v-for="item in pagedVideos">
                  <div class="relative  w-auto h-full s-item rounded-md overflow-hidden  pointer flex flex-col "
                       style="border-radius: 12px;">
                    <VideoItem :url="item.path"></VideoItem>
                  </div>
                </div>
              </div>
            </vue-custom-scrollbar>
          </template>
        </div>

      </div>
    </div>
  </div>

  <a-drawer width="500" title="设置" :bodyStyle="{ overflow: 'hidden' }" :placement="right"
            v-model:visible="recordSetShow" @close="recordSetShow = false">
    <div class="flex flex-col scroll-container">
      <div class="flex flex-col s-item rounded-md p-4 mb-3">
        <div class="flex items-center mb-3">
          <div class="pointer" @click="closeSound">
            <Icon icon="yinliang" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);" v-if="soundShow"></Icon>
            <Icon icon="jingyin" v-else style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);"></Icon>
          </div>
          <span class="mx-3" style="color:rgba(255, 255, 255, 0.85);">系统声音</span>
          <div style="width:310px;">
            <a-slider v-model:value="systemSound"></a-slider>
          </div>
        </div>
        <div class="flex items-center">
          <div class="pointer" @click="closeMicrophone">
            <Icon icon="mic-on" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);" v-if="microphoneShow"></Icon>
            <Icon icon="mic-off" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);" v-else></Icon>
          </div>
          <span style="margin: 0 19px;color:rgba(255, 255, 255, 0.85);">麦克风</span>
          <div style="width:310px;">
            <a-slider v-model:value="systemMicrophone"></a-slider>
          </div>
        </div>
      </div>
      <span class="mb-3 fps-t">我的截屏保存地址</span>
      <span @click="setImageSavePath" class="text-center mb-3 py-3 s-item rounded-lg">{{
          settings.imageSavePath
        }}</span>
      <span class="mb-3 fps-t">我的录制保存地址</span>
      <span @click="setVideoSavePath" class="text-center mb-3 py-3 s-item rounded-lg">{{
          settings.videoSavePath
        }}</span>
      <span class="mb-3 fps-t">视频码率</span>
      <a-select v-model:value="settings.videoBitsPerSecond">
        <a-select-option :value="1.5e6">
          1.5Mbps
        </a-select-option>
        <a-select-option :value="2.5e6">
          2.5Mbps
        </a-select-option>
        <a-select-option :value="5.0e6">
          5.0Mbps
        </a-select-option>
        <a-select-option :value="8.0e6">
          8.0Mbps
        </a-select-option>
        <a-select-option :value="10.0e6">
          10.0Mbps
        </a-select-option>
      </a-select>
      <span class="mb-3 fps-t">截屏快捷键</span>
      <div class="flex items-center  mb-3">
        <span class="rounded-lg p-2 s-item mr-3 w-2/3">{{ shortcutKey }}</span>
        <span class="mr-3 s-item rounded-lg p-2 drawer-active btn-text pointer">更换按键</span>
        <span class="rounded-lg s-item btn-text drawer-active p-2 pointer">重置</span>
      </div>
      <span class="mb-3 fps-t">录制快捷键</span>
      <div class="flex items-center mb-3">
        <span class="w-2/3 p-2 s-item rounded-lg mr-3">{{ recordKey }}</span>
        <span class="mr-3 s-item p-2 rounded-lg btn-text drawer-active pointer">更换按键</span>
        <span class="rounded-lg p-2 s-item btn-text drawer-active pointer">重置</span>
      </div>
      <span class="mb-3 fps-t">是否启用麦克风录制快捷键</span>
      <div class="flex items-center mb-3">
        <span class="w-2/3 p-2 s-item rounded-lg mr-3">{{ microphoneKey }}</span>
        <span class="mr-3 s-item p-2 rounded-lg btn-text drawer-active pointer">更换按键</span>
        <span class="rounded-lg p-2 s-item btn-text drawer-active pointer">重置</span>
      </div>
    </div>
  </a-drawer>

  <a-drawer width="500" title="设置" :placement="right" v-model:visible="setShow">
    <div class="flex flex-col">
      <div v-for="item in monitorSetData"
           class="h-12 mb-2 flex rounded-lg pointer items-center s-item justify-center"
           @click="selectMonitorItem(item)" :class="{'drawer-item-bg':selectIndex === item.id}"
      >
        {{ item.name }}
      </div>
    </div>
  </a-drawer>

</template>

<script>
import { mapWritableState, mapActions, mapState } from 'pinia'
import { AreaChartOutlined } from '@ant-design/icons-vue'
import HorizontalCapture from '../../components/HorizontalCaptrue.vue'
import { inspectorStore } from '../../store/inspector'
import * as echarts from 'echarts'
import { FPSOption } from '../../components/widgets/supervisory/echartOptions'
import { captureStore } from '../../store/capture'
import BackBtn from '../../components/comp/BackBtn.vue'
import { steamUserStore } from '../../store/steamUser'
import VideoItem from '../../components/game/VideoItem.vue'
import { useToast } from 'vue-toastification'
import JumpNotice from '../../components/game/JumpNotice.vue'
import SaveImage from '../../components/game/SaveImage.vue'
import { message, Modal } from 'ant-design-vue'
import { formatSeconds, timeStamp } from '../../util'
import VueCustomScrollbar from '../../../../src/components/vue-scrollbar.vue'
import filenamify from 'filenamify'
const toast=useToast()
export default {
  name: 'GameCapture',
  components: {
    VueCustomScrollbar,
    VideoItem,
    BackBtn,
    AreaChartOutlined,
    HorizontalCapture
  },

  data () {
    return {
      loading: false,
      //1.选源 2.实操
      step: 1,
      //当前源
      currentSource: {},
      systemSound: 10, // 系统声音
      soundShow: false,
      microphoneShow: false,
      recordSetShow: false,
      isMonitor: false,
      setShow: false,
      isHeight: true,
      systemMicrophone: 20, // 麦克风
      captureType: [
        // {title:'录游戏',name:'recordGame'},
        { title: '捕获窗口', name: 'logger' },
        { title: '捕获全屏', name: 'recordFullScreen' },

      ],
      defaultRecordingType: { title: '录窗口', name: 'logger' },
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      recordGameData: [
        {
          url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
          name: 'Counter-Strike: Global Offensive'
        },
        { url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg', name: 'Dota2' },
        {
          url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
          name: 'Counter-Strike: Global Offensive'
        },
        { url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg', name: 'Dota2' },
        {
          url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
          name: 'Counter-Strike: Global Offensive'
        },
        { url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg', name: 'Dota2' },
        {
          url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
          name: 'Counter-Strike: Global Offensive'
        },
        { url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg', name: 'Dota2' },
      ],
      recordFullScreenData: [
        { url: '/public/img/cpatureone.png', name: '桌面1' },
        { url: '/public/img/cpaturetwo.png', name: '桌面2' },
        { url: '/public/img/cpatureone.png', name: '桌面1' },
        { url: '/public/img/cpaturetwo.png', name: '桌面2' },
        { url: '/public/img/cpatureone.png', name: '桌面1' },
        { url: '/public/img/cpaturetwo.png', name: '桌面2' },
        { url: '/public/img/cpatureone.png', name: '桌面1' },
        { url: '/public/img/cpaturetwo.png', name: '桌面2' },
      ],
      recordLogger: [
        { url: '/public/img/test.png', name: '程序1' },
        { url: '/public/img/test.png', name: '程序2' },
        // {url:'/public/img/test.png',name:'程序3'},
        // {url:'/public/img/test.png',name:'程序4'},
      ],
      defaultIndex: 0,
      simpleImage: '/public/img/test/not-data.png',
      lastCapture: [
        { title: '截屏', name: 'screenCap' },
        { title: '录制', name: 'record' }
      ],
      defaultLastCap: { title: '截屏', name: 'screenCap' },
      monitorTitle: 'FPS',
      monitorSetData: [
        { title: 'FPS', name: '实时、平均、1%LOW帧数监测', id: 'f' },
        { title: '性能', name: 'CPU占用、GPU占用、实时FPS监测', id: 'p' },
        { title: '性能', name: '实时FPS监测', id: 's' }
      ],
      selectIndex: 'f',
      CPUGPUData: {
        useCPU: { value: 0 },
        useGPU: { value: 0 },
        useMemory: { value: 0 },
        FPS: { value: 0 },
        down: 0,
        up: 0
      },
      FPSOption,
      fpsInstance: null,
      fpsList: [0, 10, 0, 20, 0, 0, 0, 30, 0, 0, 0, 0, 60, 0, 0, 0, 80],
      screenShotAddress: 'C:\PROGRAM FILES (X86)\CLIP', // 用于接收截屏获取的地址
      shortcutKey: 'CTRL + WIN + G',
      recordKey: 'CTRL + WIN + V',
      microphoneKey: 'CTRL + WIN + J',
      imagePage: 1,
      pageLimit: 12,
      videoPage: 1,
      recentScreenShot:'',
      recentFileName:'',
      recording:false,


      recentType:'image',
      recorder:null,

      //录制状态显示
      recordedSeconds:0,
      recordingTimer:null,//录制时间定时器
      recentKey:Date.now()//最近播放器的key

    }
  },
  computed: {
    ...mapWritableState(inspectorStore, ['displayData']),
    ...mapWritableState(captureStore, ['sources', 'settings', 'images', 'videos']),
    ...mapState(steamUserStore, ['runningGame']),
    deskSource () {
      return this.sources.filter(s => {
        return s.type === 'screen'
      })
    },
    windowSource () {
      return this.sources.filter(s => {
        return s.type === 'window'
      })
    },
    pagedImages () {
      console.log(this.images, '计算属性变化')
      console.log(this.images.slice((this.imagePage - 1) * this.pageLimit, this.pageLimit), '得到的')
      console.log((this.imagePage - 1) * this.pageLimit, this.pageLimit)
      let sorted=this.images.sort((img1,img2)=>{
       return  img2.stat.ctimeMs-img1.stat.ctimeMs
      })
      return sorted
    },
    pagedVideos () {
      let sorted=this.videos.sort((img1,img2)=>{
        return  img2.stat.ctimeMs-img1.stat.ctimeMs
      })
      return sorted
    },
    recordedTimeStr(){

      return formatSeconds(this.recordedSeconds)
    }
  },
  mounted () {
    window.addEventListener('resize', this.pageResize)
    this.refreshSource(() => {
      let source = this.findWindow()
      if (source) {
        this.currentSource = source
        this.step = 2
      }
    })

    if (this.settings.imageSavePath) {
      this.loadImages()
    }
    if (this.settings.videoSavePath) {
      this.loadVideos()
    }

  },

  watch: {
    'displayData': {
      handler (newVal, oldVal) {
        let { useGPU, useMemory, useCPU, FPS, down, up } = this.displayData || {}
        this.CPUGPUData = {
          useGPU: useGPU,
          useCPU: useCPU,
          useMemory: useMemory,
          FPS: FPS,
          down: down,
          up: up
        }
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions(inspectorStore, ['startInspect', 'stopInspect']),
    ...mapActions(captureStore, ['getSource']),
    /**
     * 重载列表
     */
    reload(){
      if(this.lastCapture==='record'){
        this.loadVideos()
      }else{
        this.loadImages()
      }
    },
    refreshSource (cb) {
      this.sources = []
      this.loading = true
      this.getSource()
      let timer = setInterval(() => {
        if (this.sources.length > 0) {
          this.loading = false
          clearInterval(timer)
          if (cb) {
            cb()
          }
        }
      }, 500)
    },
    async setImageSavePath () {
      let savePath = await tsbApi.dialog.showOpenDialog({
        title: '选择目录', message: '请选择截屏保存位置', properties: [
          'openDirectory', 'createDirectory',
        ]
      })
      if (savePath) {
        this.settings.imageSavePath = savePath[0]
        this.loadImages()
      } else {
      }
    },
    async setVideoSavePath () {
      let savePath = await tsbApi.dialog.showOpenDialog({
        title: '选择目录', message: '请选择视频保存位置', properties: [
          'openDirectory', 'createDirectory',
        ]
      })
      if (savePath) {
        this.settings.videoSavePath = savePath[0]
        this.loadVideos()
      } else {
      }
    },

    async loadImages () {
      this.images = this.genFileList(this.settings.imageSavePath, ['.jpg', '.png', '.bmp', '.jpeg'])
    },
    async loadVideos () {
      this.videos = this.genFileList(this.settings.videoSavePath, ['.mp4', '.avi', '.mpg', 'rmvb'])
    },
    // 从目录开始
    genFileList (path,extMap) {
      let filesList = []
      this.readFile(path, filesList,extMap)
      return filesList
    },
    // 遍历读取文件
    readFile (path, filesList, extMap) {
      let files = fs.readdirSync(path) // 需要用到同步读取
      files.forEach((file) => {
        let states = fs.statSync(path + '/' + file)
        // ❤❤❤ 判断是否是目录，是就继续递归
        if (states.isDirectory()) {
          this.readFile(path + '/' + file, filesList,extMap)
        } else {
          // 不是就将文件push进数组，此处可以正则匹配是否是 .js 先忽略
          if (extMap.indexOf(require('path').extname(file)) > -1) {
            const stat=fs.statSync(path + '/' + file)
            filesList.push({
              stat:stat,
              path:path + '/' + file
            })
          }
        }
      })
    },
    getAllFiles (path, extMap, object, arr) {
      fs.readdir(path, (err, files) => {
        if (err) throw err
        files.forEach(file => {
          //拼接获取绝对路径，fs.stat(绝对路径,回调函数)
          let fPath = require('path').join(path, file)
          fs.stat(fPath, (err, stat) => {
            if (stat.isFile()) {
              //stat 状态中有两个函数一个是stat中有isFile ,isisDirectory等函数进行判断是文件还是文件夹
              if (extMap.indexOf(require('path').extname(fPath)) > -1) {
                object[arr].push({
                  stat:stat,
                  path:fPath })
              }
            } else {
              this.getAllFiles(fPath, extMap, object, arr)
            }
          })
        })
      })
    },
    /**
     * 获取到最近捕获的文件路径
     * @returns {string}
     */
    getRecentPath(){
      return this.recentType==='video'?this.getRecentVideoPath():this.getRecentImagePath()
    },
    getRecentImagePath(){
      return require('path').join(this.settings.imageSavePath,this.recentFileName)
    },
    getRecentVideoPath(){
      return require('path').join(this.settings.videoSavePath,this.recentFileName)
    },
    async saveRecent () {
      let filters={ name: '图片', extensions: ['png'] }
      if(this.recentType==='video'){
        filters={ name: '视频', extensions: ['mp4'] }
      }
      let savePath = await tsbApi.dialog.showSaveDialog({
        title: '选择保存位置',
        defaultPath: this.recentFileName,
        message: '选择保存的位置',
        filters: [filters],
        properties: [
          'createDirectory',
          'showOverwriteConfirmation'
        ]
      })
      if(savePath){
        require('fs').copyFileSync(this.getRecentPath(),savePath)
        if(require('fs').existsSync(this.getRecentPath(),savePath)){
          message.success('保存成功')
        }
      }
    },
    openRecent(){
      require('electron').shell.openPath(this.getRecentPath())
    },
    openPos(){
      require('electron').shell.showItemInFolder(this.getRecentPath())
    },
    delRecent(){
      Modal.confirm({
        content:'删除此内容？',
        centered:true,
        onOk:()=>{
          require('fs').rmSync(this.getRecentPath())
          this.recentFileName=''
          this.recentScreenShot=''
          this.reload()
        }
      })
    },
    /**
     * 查找源
     */
    findWindow () {
      if (!this.runningGame.chineseName) {
        return false
      }
      let source = this.sources.find(s => {
        if (s.name.toLowerCase() === this.runningGame.chineseName.toLowerCase()) {
          return true
        }
      })
      return source
    },
    chooseSource (source) {
      this.step = 2
      this.currentSource = source
    },
    filterName(name){
      return filenamify(name)
    },
    callback(image){
      this.recentScreenShot=image
      let time=timeStamp(Date.now())
      const filename=this.filterName(this.currentSource.name)+'_'+time.year+'年'+time.month+'月'+time.day+'日'+time.hours+'时'+time.minutes+'分'+time.seconds+'秒'+'.png'
      const path=require('path').join(this.settings.imageSavePath,filename)
      const base64 = image.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
      const dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
      fs.writeFile(path, dataBuffer, (err)=>{//用fs写入文件
        if(err){
          console.log(err);
          message.error('文件保存失败',err)
        }else{
          this.recentFileName=filename
          this.loadImages()
          this.showToast(image)
        }
      })

    },
    showToast(src){
      toast(
        {
          component:SaveImage,
          props:{
            image:src
          },
        },{
          icon:false,
          closeOnClick:false,
          closeButton:false,
          pauseOnFocusLoss:false,
          pauseOnHover:false
        }
      )
    },
    // 截图
    screenshot () {
      //ipc.send('captureImage',{source:this.currentSource})
      const handleStream = (stream) => {
        //document.body.style.cursor = oldCursor
        document.body.style.opacity = '1'
        // Create hidden video tag
        let video = document.createElement('video')
        video.autoplay='autoplay'
        video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;'
        // Event connected to stream

        let loaded = false
        video.onplaying = () => {
          if (loaded) {
            return
          }
          loaded = true
          // Set video ORIGINAL height (screenshot)
          video.style.height = video.videoHeight + 'px' // videoHeight
          video.style.width = video.videoWidth + 'px' // videoWidth

          // Create canvas
          let canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          let ctx = canvas.getContext('2d')
          // Draw video on canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          if (this.callback) {
            // Save screenshot to png - base64
            this.callback(canvas.toDataURL('image/png'))
          } else {
            // console.log('Need callback!')
          }

          // Remove hidden video tag
          video.remove()
          try {
            stream.getTracks()[0].stop()
          } catch (e) {
            // nothing
          }
        }
        video.srcObject = stream
        document.body.appendChild(video)
      }

      // mac 和 windows 获取 chromeMediaSourceId 的方式不同
      if (require('os').platform() === 'win32') {
        navigator.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: this.currentSource.id + '',
              minWidth: 1280,
              minHeight: 720,
              maxWidth: 8000,
              maxHeight: 8000,
            },
          },
        }, handleStream, ()=>{

        })
      } else {
        // navigator.getUserMedia({
        //   audio: false,
        //   video: {
        //     mandatory: {
        //       chromeMediaSource: 'desktop',
        //       chromeMediaSourceId: `screen:${curScreen.id}`,
        //       minWidth: 1280,
        //       minHeight: 720,
        //       maxWidth: 8000,
        //       maxHeight: 8000,
        //     },
        //   },
        // }, handleStream, handleError)
      }
    },
    // 开始录制事件
    async startRecording () {
      const videoSource = await navigator.mediaDevices.getUserMedia({
        audio: false, // 强行表示不录制音频，音频额外获取
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId:this.currentSource.id
          }
        }
      });
      // Windows音频流获取

      const audioSource = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            // 无需指定mediaSourceId就可以录音了，录得是系统音频
            chromeMediaSource: 'desktop',
          },
        },

        // 如果想要录制音频，必须同样把视频的选项带上，否则会失败
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
          },
        },
      });

// 接着手工移除点不用的视频源，即可完成音频流的获取
      (audioSource.getVideoTracks() || []).forEach(track => audioSource.removeTrack(track));
      // 合并音频流与视频流

      const combinedSource = new MediaStream([...audioSource.getAudioTracks(), ...videoSource.getVideoTracks()]);

      let types = [
        "video/webm",
        "audio/webm",
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm;codecs=daala",
        "video/webm;codecs=h264",
        "audio/webm;codecs=opus",
        "video/mpeg"
      ];
      for (let i in types) {
        // 可以自行测试需要的编码的MIME Type是否支持
        console.log( "Is " + types[i] + " supported? " + (MediaRecorder.isTypeSupported(types[i]) ? "Yes" : "No :("));

      }


      const recorder = new MediaRecorder(combinedSource, {
        mimeType: 'video/webm;codecs=vp9',
        // 支持手动设置码率，这里设了1.5Mbps的码率，以限制码率较大的情况
        // 由于本身还是动态码率，这个值并不准确
        videoBitsPerSecond: this.settings.videoBitsPerSecond,

      });

      const timeslice = 5000;
      let  fileBits = [];
// 当数据可用时，会回调该函数，有以下四种情况：
// 1. 手动停止MediaRecorder时
// 2. 设置了timeslice，每到一次timeslice时间间隔时
// 3. 媒体流内所有轨道均变成非活跃状态时
// 4. 调用recorder.requestData()转移缓冲区数据时
      recorder.ondataavailable = (event) => {
        fileBits.push(event.data);
      }
      recorder.onstop = () => {
        // 录屏停止并获取录屏文件
        // 触发时机一定在ondataavailable之后
        const videoFile = new Blob(fileBits, { type: 'video/webm;codecs=vp9' });
        var reader = new FileReader()
        reader.onload = ()=>{
          var buffer = new Buffer(reader.result)
          //temp文件夹应已存在
          const time=timeStamp(Date.now())
          const fileName=this.filterName(this.currentSource.name)+'_'+time.year+'年'+time.month+'月'+time.day+'日'+time.hours+'时'+time.minutes+'分'+time.seconds+'秒'+'.mp4'
          const savePath=require('path').join(this.settings.videoSavePath,fileName)
          fs.writeFile(savePath, buffer, {}, (err, res) => {
            if(err){
              console.error(err)
              return
            }
            this.recentType='video'
            this.recentFileName=fileName
            message.success('保存录屏成功')
            this.loadVideos()
          })
        }
        reader.readAsArrayBuffer(videoFile)
      }



      if (timeslice === 0) {

        // 开始录制，并一直存储数据到缓冲区，直到停止

        recorder.start();

      } else {

        // 开始录制，并且每timeslice毫秒，触发一次ondataavailable，输出并清空缓冲区（非常重要）

        recorder.start(timeslice);
        this.recentFileName=''
        this.recording=true
        this.recordedSeconds=0
        this.setRecordingTimer()

        this.recorder=recorder
      }







    },
    /**
     * 设置一个录制定时器
     * @param start 是否是启动，否则自动清理定时器
     */
    setRecordingTimer(start=true){
      if(!start){
        //如果是取消
        if(this.recordingTimer){
          clearInterval(this.recordingTimer)
          return
        }
      }
      this.recordedSeconds=0
      this.recordingTimer=setInterval(()=>{
        this.recordedSeconds++
      },1000)
    },
    stopRecording(){
      this.setRecordingTimer(false)
      this.recorder.stop()
      this.recording=false
      this.recordKey=Date.now()
    },
    // 开始监控事件
    startMonitoring () {
      this.isMonitor = !this.isMonitor
      if (this.isMonitor) {
        this.startInspect()
      } else {
        this.stopInspect()
      }
      if (this.isMonitor === true && this.selectIndex === 'f') {
        this.fpsEcharts()
      } else {
        return
      }
    },
    // 关闭系统声音
    closeSound () {
      this.soundShow = !this.soundShow
      if (!this.soundShow) {
        this.systemSound = 0
      } else {
        this.systemSound = 10
      }
    },
    // 闭麦事件
    closeMicrophone () {
      this.microphoneShow = !this.microphoneShow
      if (!this.microphoneShow) {
        this.systemMicrophone = 0
      } else {
        this.systemMicrophone = 20
      }
    },
    // 打开录制设置入口
    openRecordSet () {
      this.recordSetShow = true
    },
    clickRecordGame (item, index) {
      this.defaultIndex = index
    },
    openMonitorSet () {
      this.setShow = true
    },
    selectMonitorItem (v) {
      this.selectIndex = v.id
      this.monitorTitle = v.title
      this.setShow = false
      this.fpsEcharts()
    },
    // FPS图形表
    fpsEcharts () {
      this.$nextTick(() => {
        this.fpsInstance = echarts.init(this.$refs.fpsChart)
        this.fpsInstance.setOption({
          title: {
            text: ''
          },
          animation: false,
          backgroundColor: 'transparent',
          legend: {
            data: ['normal'],
          },
          grid: { // 让图表占满容器
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px'
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: []
            }
          ],
          yAxis: [
            {
              type: 'value',
              show: false
            },

          ],
          series: [
            {
              smooth: 0.6,
              symbol: 'none',
              name: 'Email',
              type: 'line',
              stack: 'Total',
              emphasis: {
                focus: 'series'
              },
              data: this.fpsList,
              itemStyle: {
                normal: {
                  color: '#1890FF'
                },

              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [  // 渐变颜色
                    {
                      offset: 0,
                      color: '#404D61',
                    },
                    {
                      offset: 1,
                      color: '#404D61',
                    },
                  ],
                  global: false,
                },
              },
            },
          ]
        })
      })
    },
    pageResize () {
      if (window.innerHeight <= 700) {
        this.isHeight = false
      } else {
        this.isHeight = true
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.cap-left {
}

.cp-w {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 140px;
}

.cp-lw {
  width: 64px;
  height: 64px;
}

/*
.sp-w{
  max-width: 213px;
  height: 120px;
}
*/

.f-w {
  width: 265px;
}

.echarts {
  margin-top: 1em;
  height: 110px;
  width: calc(100%);
}

.cpu-w {
  width: 138px;
}

// 橘黄色
.cp-orange-1 {
  background: rgba(250, 173, 20, 0.1);

  .cp-orange-2 {
    background: rgba(250, 173, 20, 0.2);

    .cp-orange-full {
      background: rgba(250, 173, 20, 1);
    }
  }
}

// 橘红色
.cp-red-1 {
  background: rgba(255, 77, 79, 0.1);

  .cp-red-2 {
    background: rgba(255, 77, 79, 0.2);

    .cp-red-full {
      background: rgba(255, 77, 79, 1);
    }
  }
}

// 蓝色
.dark-blue-1 {
  background: rgba(80, 139, 254, 0.1);

  .dark-blue-2 {
    background: rgba(80, 139, 254, 0.2);

    .dark-blue-full {
      background: rgba(80, 139, 254, 1);
    }
  }
}

.dark-blue-full {
  background: rgba(80, 139, 254, 1);
}

// 各种字体样式
.title-color {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 400;
}

.fps-hz {
  font-family: Oswald-SemiBold;
  font-size: 24px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
}

.fps-t {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.fps-text {
  font-family: Oswald-Medium;
  font-size: 36px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.btn-text {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
}

.record-game-item {
  max-width: 234px;
}

.scroll-container {
  height: 80vh;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0 !important;
  }

}

:deep(.nav-item) {
  width: 50%;
}

.drawer-active {
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  &:active {
    filter: brightness(0.8);
    background: rgba(0, 0, 0, 0.2);
  }
}

.game-list-item {
  max-width: 231px;

}

/*
.game-list-item{
  max-width: 231px;
}
.game-list-local{
  max-width: 231px;
  max-height: 120px;
  aspect-ratio: 231/300;
}
*/
@media screen and (max-width: 1071px) {
  .game-list-item {
    width: calc(100% / 1);
  }
  .game-list-local {
    width: calc(100% / 1);
  }
}

@media screen and (min-width: 1072px) and (max-width: 1309px) {
  .game-list-item {
    width: calc(100% / 2);
  }
  .game-list-local {
    width: calc(100% / 2);
  }
}

@media screen and (min-width: 1310px) and (max-width: 1550px) {
  .game-list-item {
    width: calc(100% / 3);
  }
  .game-list-local {
    width: calc(100% / 3);
  }
}

@media screen and (min-width: 1551px) and (max-width: 1790px) {
  .game-list-item {
    width: calc(100% / 5);
  }
  .game-list-local {
    width: calc(100% / 6);
  }
}

@media screen and (min-width: 1740px) and (max-width: 2040px) {
  .game-list-item {
    width: calc(100% / 6);
  }
  .game-list-local {
    width: calc(100% / 7);
  }
}

@media screen and (min-width: 2040px) and (max-width: 2340px) {
  .game-list-item {
    width: calc(100% / 7);
  }
  .game-list-local {
    width: calc(100% / 8);
  }
}

@media screen and (min-width: 2340px) and (max-width: 2640px) {
  .game-list-item {
    width: calc(100% / 8);
  }
  .game-list-local {
    width: calc(100% / 9);
  }
}

@media screen and (min-width: 2640px) and (max-width: 2940px) {
  .game-list-item {
    width: calc(100% / 9);
  }
}

@media screen and (min-width: 2940px) and (max-width: 3240px) {
  .game-list-item {
    width: calc(100% / 10);
  }
}

@media screen and (min-width: 3240px) and (max-width: 3540px) {
  .game-list-item {
    width: calc(100% / 11);
  }
}

@media screen and (min-width: 3540px) and (max-width: 3840px) {
  .game-list-item {
    width: calc(100% / 12);
  }
}

::v-deep .ant-slider-track {
  background: linear-gradient(90deg, rgba(98, 193, 255, 1) 0%, rgba(51, 141, 255, 1) 100%) !important;
}

:deep(.ant-slider-handle) {
  background: rgba(255, 255, 255, 0.85) !important;
  border-color: rgba(151, 151, 151, 1) !important;
}

:deep(.ant-slider-rail) {
  background: rgba(255, 255, 255, 0.4) !important;
}

:deep(.ps__rail-y) {
  display: none !important;
}

.my-image {
  width: 160px;
  height: 90px;
}

.content-game {
  align-items: center;
  justify-content: center;
}

.game-list-item {
  margin: 10px;
}
.screenshot{
  &:hover{
    opacity: 0.8;
  }
}
</style>

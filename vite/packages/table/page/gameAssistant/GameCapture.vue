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

  <div class="px-4 max-capture flex">
    <div class="s-bg rounded-md cap-left px-4 py-2" >


<!--  选择录制源    -->
      <div style="width: 490px">
        <div v-if="step===1" >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
              <Icon icon="video" style="font-size: 1.75em;color:rgba(255,255,255,0.85)"></Icon>
              <span class="title-color ml-3">捕获</span>
            </div>
            <div class="flex items-center pointer justify-center" @click="openRecordSet">
              <Icon icon="gengduo1" style="font-size: 1.75em;color:rgba(255,255,255,0.85)"></Icon>
            </div>
          </div>
          <HorizontalCapture @click="refreshSource" :navList="captureType" v-model:selectType="defaultRecordingType" class="mb-4"></HorizontalCapture>
          <div class="text-center" v-if="loading===true">
            捕获源获取中…
          </div>
         <div v-else>
          <template v-if="defaultRecordingType.name === 'recordGame'">
            <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height:100%;">
              <div v-if="recordGameData.length === 0">
                <a-empty :image="simpleImage" />
              </div>
              <div class="flex justify-between flex-wrap" v-else>
                <div v-for="(item,index) in recordGameData" class="flex pointer flex-col s-bg rounded-lg mb-4  record-game-item"
                     @click="clickRecordGame(item,index)" :class="{'s-active':defaultIndex === index}"
                >
                  <img :src="item.url" class="w-full rounded-lg h-full object-cover">
                  <div class="px-4 py-3">
                    <span class="truncate" style="max-width:150px;">{{ item.name}} </span>
                  </div>
                </div>
              </div>
            </vue-custom-scrollbar>
          </template>
          <template v-if="defaultRecordingType.name === 'recordFullScreen'">
            <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height:100%;">
              <div v-if="recordGameData.length === 0">
                <a-empty :image="simpleImage" />
              </div>
              <div class="flex justify-between flex-wrap" v-else>
                <div v-for="(item,index) in  deskSource"
                     class="flex flex-col s-bg rounded-lg mb-4 pointer record-game-item"
                     @click="chooseSource(item,index)" :class="{'s-active':defaultIndex === index}"
                >
                  <img :src="'file://'+item.src" class="w-full rounded-lg h-full object-cover">
                  <div class="px-4 py-3">
                    <span class="truncate" style="max-width:207px;">{{ item.name}} </span>
                  </div>
                </div>
              </div>
            </vue-custom-scrollbar>
          </template>
          <template v-if="defaultRecordingType.name === 'logger'">
            <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height:100%;">
              <div v-if="recordLogger.length === 0">
                <a-empty :image="simpleImage" />
              </div>
              <div class="flex justify-between flex-wrap" v-else>
                <div v-for="(item,index) in  windowSource"
                     class="flex flex-col justify-between s-bg rounded-lg mb-4 pointer record-game-item"
                     @click="chooseSource(item,index)" :class="{'s-active':defaultIndex === index}"
                >
                  <img :src="'file://'+item.src" class="w-full rounded-lg h-full object-cover">
                  <div class="px-4 py-3 truncate">
                    <span class="" style="max-width:207px;">{{ item.name}} </span>
                  </div>
                </div>
              </div>
            </vue-custom-scrollbar>
          </template></div>
        </div>
        <div v-if="step===2">
          <div class="flex items-center justify-between mb-3">

          </div>
          <div style="height: 5em;position: relative">
            <back-btn @click="step=1" style="margin-top: -30px;margin-left: -30px"></back-btn>
            <div style="position: absolute;left:60px;top:10px;font-size: 16px">已选择：<a-avatar v-if="currentSource.type==='window'" :size="24" shape="square" :src="'file://'+currentSource.icon" ></a-avatar> {{currentSource.name}}</div>
            <div style="position: absolute;right: 0.5em">
              <div class="flex items-center pointer justify-center" @click="openRecordSet">
                <Icon icon="gengduo1" style="font-size: 1.75em;color:rgba(255,255,255,0.85)"></Icon>
              </div>
            </div>
          </div>
          <div class="flex mb-3">
            <div class="cp-w cp-orange-1 flex-col rounded-lg pointer mr-3"  @click="startScreenshot" >
              <div class="cp-orange-2 mb-3 w-20 flex items-center justify-center  rounded-full h-20">
                <div class="rounded-full cp-orange-full flex items-center justify-center cp-lw">
                  <Icon icon="camera" style="font-size: 2em;color:rgba(255, 255, 255, 0.8);"></Icon>
                </div>
              </div>
              <div class="cp-text">截取屏幕</div>
            </div>

            <div @click="startRecording" class="cp-w cp-red-active cp-red-1 pointer flex-col rounded-lg mr-3">
              <div class="w-20 h-20 flex cp-red-2  items-center rounded-full justify-center mb-3">
                <div class="rounded-full cp-red-full flex items-center justify-center cp-lw">
                  <Icon icon="record-circle-line" style="font-size: 2em;color:rgba(255, 255, 255, 0.8);"></Icon>
                </div>
              </div>
              <div class="cp-text">开始录制</div>
            </div>

            <div @click="startMonitoring">
              <div class="cp-w s-item  pointer  flex-col rounded-lg " v-if="isMonitor === false">
                <div class="w-20 h-20 flex  items-center rounded-full justify-center mb-3">
                  <div class="rounded-full dark-blue-full flex items-center justify-center cp-lw">
                    <AreaChartOutlined style="font-size: 2em;color:rgba(255, 255, 255, 0.8);"></AreaChartOutlined>
                  </div>
                </div>
                <div class="cp-text" >开启监控</div>
              </div>
              <div  class="cp-w s-item dark-blue-1 pointer  flex-col rounded-lg"  v-else>
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
                <Icon icon="mic-on" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);" v-if="microphoneShow"></Icon>
                <Icon icon="mic-off" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);" v-else></Icon>
              </div>
              <span style="margin: 0 19px;color:rgba(255, 255, 255, 0.85);">麦克风</span>
              <div style="width:331px;">
                <a-slider v-model:value="systemMicrophone"></a-slider>
              </div>
            </div>
          </div>
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
            <div class="fps-text flex items-center  justify-center">{{CPUGPUData.useCPU.value}}%</div>
            <div class="flex items-center justify-center">
              <Icon icon="cpu" style="font-size: 1.75em;color:rgba(255, 255, 255, 0.85);"></Icon>
              <span class="ml-2 fps-t">CPU</span>
            </div>
          </div>
          <div class="px-5 flex flex-col s-item py-8 rounded-lg cpu-w">
            <div class="fps-text flex items-center  justify-center">{{CPUGPUData.useGPU.value}}</div>
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
            <span class="ml-3" style="font-size: 16px;color: rgba(255,255,255,0.85);font-weight: 400;">最近截屏和录制</span>
          </div>
          <div class="flex items-center pointer justify-center"  @click="openRecordSet">
            <Icon icon="gengduo1" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.6);"></Icon>
          </div>
        </div>
        <HorizontalCapture :navList="lastCapture" v-model:selectType="defaultLastCap" class="mb-3"></HorizontalCapture>
        <template v-if="defaultLastCap.name === 'screenCap'">
          <vue-custom-scrollbar class="rounded-md"   @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height:65vh;">
            <div class="flex flex-row flex-wrap content-game">
              <div class="game-list-item px-1.5 pb-4 flex-shrink-0 my-game-content " v-for="item in recordGameData">
                <div class="relative  w-auto h-full s-item rounded-md  pointer flex flex-col " style="border-radius: 12px;">
                  <img  :src="item.url" class="w-full h-full rounded-md object-cover"  alt="">
                </div>
              </div>
            </div>
          </vue-custom-scrollbar>
        </template>
        <template v-else>
          <vue-custom-scrollbar class="rounded-md"   @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height:65vh;">
            <div class="flex flex-row flex-wrap content-game ">
              <div class="game-list-item px-1.5 pb-4 flex-shrink-0 my-game-content " v-for="item in recordFullScreenData">
                <div class="relative  w-auto h-full s-item rounded-md  pointer flex flex-col " style="border-radius: 12px;">
                  <img  :src="item.url" class="w-full h-full rounded-md object-cover"  alt="">
                </div>
              </div>
            </div>
          </vue-custom-scrollbar>
        </template>
      </div>
    </div>
  </div>

  <a-drawer width="500"  title="设置" :bodyStyle="{ overflow: 'hidden' }" :placement="right" v-model:visible="recordSetShow" @close="recordSetShow = false">
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
      <span class="text-center mb-3 py-3 s-item rounded-lg">{{ screenShotAddress }}</span>
      <span class="mb-3 fps-t">我的录制保存地址</span>
      <span class="text-center mb-3 py-3 s-item rounded-lg">设置保存地址</span>
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

  <a-drawer width="500"  title="设置" :placement="right" v-model:visible="setShow">
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
import {AreaChartOutlined} from '@ant-design/icons-vue'
import HorizontalCapture from '../../components/HorizontalCaptrue.vue'
import { inspectorStore } from '../../store/inspector'
import * as echarts from "echarts";
import { FPSOption } from '../../components/widgets/supervisory/echartOptions'
import { captureStore } from '../../store/capture'
import BackBtn from '../../components/comp/BackBtn.vue'
import { steamUserStore } from '../../store/steamUser'

export default {
  name:'GameCapture',
  components:{
    BackBtn,
    AreaChartOutlined,
    HorizontalCapture
  },

  computed:{
    ...mapWritableState(inspectorStore,['displayData']),
    ...mapWritableState(captureStore, ['sources']),
    ...mapState(steamUserStore,['runningGame']),
    deskSource(){
      return this.sources.filter(s=>{
        return s.type==='screen'
      })
    },
    windowSource(){
      return this.sources.filter(s=>{
        return s.type==='window'
      })
    }
  },

  data(){
    return{
      loading:false,
      //1.选源 2.实操
      step:1,
      //当前源
      currentSource:{},
      systemSound:10, // 系统声音
      soundShow:false,
      microphoneShow:false,
      recordSetShow:false,
      isMonitor:false,
      setShow:false,
      isHeight:true,
      systemMicrophone:20, // 麦克风
      captureType:[
        // {title:'录游戏',name:'recordGame'},
        {title:'录窗口',name:'logger'},
        {title:'录全屏',name:'recordFullScreen'},

      ],
      defaultRecordingType:{title:'录窗口',name:'logger'},
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      recordGameData:[
        {url:'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',name:'Counter-Strike: Global Offensive'},
        {url:'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',name:'Dota2'},
        {url:'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',name:'Counter-Strike: Global Offensive'},
        {url:'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',name:'Dota2'},
        {url:'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',name:'Counter-Strike: Global Offensive'},
        {url:'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',name:'Dota2'},
        {url:'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',name:'Counter-Strike: Global Offensive'},
        {url:'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',name:'Dota2'},
      ],
      recordFullScreenData:[
        {url:'/public/img/cpatureone.png',name:'桌面1'},
        {url:'/public/img/cpaturetwo.png',name:'桌面2'},
        {url:'/public/img/cpatureone.png',name:'桌面1'},
        {url:'/public/img/cpaturetwo.png',name:'桌面2'},
        {url:'/public/img/cpatureone.png',name:'桌面1'},
        {url:'/public/img/cpaturetwo.png',name:'桌面2'},
        {url:'/public/img/cpatureone.png',name:'桌面1'},
        {url:'/public/img/cpaturetwo.png',name:'桌面2'},
      ],
      recordLogger:[
        {url:'/public/img/test.png',name:'程序1'},
        {url:'/public/img/test.png',name:'程序2'},
        // {url:'/public/img/test.png',name:'程序3'},
        // {url:'/public/img/test.png',name:'程序4'},
      ],
      defaultIndex:0,
      simpleImage:'/public/img/test/not-data.png',
      lastCapture:[
        {title:'截屏',name:'screenCap'},
        {title:'录制',name:'record'}
      ],
      defaultLastCap:{title:'截屏',name:'screenCap'},
      monitorTitle:'FPS',
      monitorSetData:[
        {title:'FPS',name:'实时、平均、1%LOW帧数监测',id:'f'},
        {title:'性能',name:'CPU占用、GPU占用、实时FPS监测',id:'p'},
        {title:'性能',name:'实时FPS监测',id:'s'}
      ],
      selectIndex:'f',
      CPUGPUData:{
        useCPU:{value:0},
        useGPU:{value:0},
        useMemory:{value:0},
        FPS:{value:0},
        down:0,
        up:0
      },
      FPSOption,
      fpsInstance:null,
      fpsList:[0,10,0,20,0,0,0,30,0,0,0,0,60,0,0,0,80],
      screenShotAddress:"C:\PROGRAM FILES (X86)\CLIP", // 用于接收截屏获取的地址
      shortcutKey:"CTRL + WIN + G",
      recordKey:"CTRL + WIN + V",
      microphoneKey:"CTRL + WIN + J",
    }
  },

  mounted() {
    window.addEventListener('resize',this.pageResize)
    this.refreshSource(()=>{
      let source=this.findWindow()
      if(source){
        this.currentSource=source
        this.step=2
      }
    })

  },

  watch: {
    "displayData": {
      handler(newVal, oldVal) {
        let { useGPU, useMemory, useCPU, FPS, down, up} = this.displayData || {}
        this.CPUGPUData = {
          useGPU:useGPU,
          useCPU:useCPU,
          useMemory:useMemory,
          FPS:FPS,
          down:down,
          up:up
        }
      },
      deep: true,
    },
  },

  methods:{
    ...mapActions(inspectorStore,['startInspect','stopInspect']),
    ...mapActions(captureStore, ['getSource']),
    refreshSource(cb){
      this.sources=[]
      this.loading=true
      this.getSource()
      let timer=setInterval(()=>{
        if(this.sources.length>0){
          this.loading=false
          clearInterval(timer)
          if(cb){
            cb()
          }
        }
      },500)
    },
    /**
     * 查找源
     */
    findWindow(){
      let source=this.sources.find(s=>{
        if(s.name.toLowerCase()===this.runningGame.chineseName.toLowerCase()){
          return true
        }
      })
      return source
    },
    chooseSource(source){
      this.step=2
      this.currentSource=source
    },
    // 开始截屏事件
    startScreenshot(){},
    // 开始录制事件
    startRecording(){},
    // 开始监控事件
    startMonitoring(){
      this.isMonitor = !this.isMonitor
      if(this.isMonitor){
        this.startInspect()
      }else{
        this.stopInspect()
      }
      if(this.isMonitor === true && this.selectIndex === 'f'){
        this.fpsEcharts()
      }else{
        return
      }
    },
    // 关闭系统声音
    closeSound(){
      this.soundShow = !this.soundShow
      if(!this.soundShow){
        this.systemSound = 0
      }else{
        this.systemSound = 10
      }
    },
    // 闭麦事件
    closeMicrophone(){
      this.microphoneShow = !this.microphoneShow
      if(!this.microphoneShow){
        this.systemMicrophone = 0
      }else{
        this.systemMicrophone = 20
      }
    },
    // 打开录制设置入口
    openRecordSet(){
      this.recordSetShow = true
    },
    clickRecordGame(item,index){
      this.defaultIndex = index
    },
    openMonitorSet(){
      this.setShow = true
    },
    selectMonitorItem(v){
      this.selectIndex = v.id
      this.monitorTitle = v.title
      this.setShow = false
      this.fpsEcharts()
    },
    // FPS图形表
    fpsEcharts(){
      this.$nextTick(()=>{
        this.fpsInstance = echarts.init(this.$refs.fpsChart)
        this.fpsInstance.setOption({
          title: {
           text: ''
          },
          animation:false,
          backgroundColor:'transparent',
          legend: {
           data: ['normal'],
          },
          grid:{ // 让图表占满容器
           top:"0px",
           left:"0px",
           right:"0px",
           bottom:"0px"
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
            show:false
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
            itemStyle : {
              normal : {
                color:'#1890FF'
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
    pageResize(){
      if(window.innerHeight <= 700){
        this.isHeight = false
      }else{
        this.isHeight = true
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.cap-left{
}
.cp-w{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 140px;
}
.cp-lw{
  width: 64px;
  height: 64px;
}
/*
.sp-w{
  max-width: 213px;
  height: 120px;
}
*/

.f-w{
  width: 265px;
}
.echarts {
  margin-top: 1em;
  height: 110px;
  width: calc(100%);
}
.cpu-w{
  width: 138px;
}

// 橘黄色
.cp-orange-1{
  background: rgba(250,173,20,0.1);
  .cp-orange-2{
    background: rgba(250,173,20,0.2);
    .cp-orange-full{
      background: rgba(250,173,20,1);
    }
  }
}
// 橘红色
.cp-red-1{
  background: rgba(255,77,79,0.1);
  .cp-red-2{
    background: rgba(255,77,79,0.2);
    .cp-red-full{
      background: rgba(255,77,79,1);
    }
  }
}
// 蓝色
.dark-blue-1{
  background:rgba(80,139,254, 0.1);
  .dark-blue-2{
    background:rgba(80,139,254, 0.2);
    .dark-blue-full{
      background:rgba(80,139,254, 1);
    }
  }
}
.dark-blue-full{
  background:rgba(80,139,254, 1);
}

// 各种字体样式
.title-color{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  font-weight: 400;
}
.fps-hz{
  font-family: Oswald-SemiBold;
  font-size: 24px;
  color: rgba(255,255,255,0.85);
  font-weight: 600;
}
.fps-t{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  font-weight: 500;
}
.fps-text{
  font-family: Oswald-Medium;
  font-size: 36px;
  color: rgba(255,255,255,0.85);
  font-weight: 500;
}
.btn-text{
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: rgba(255,255,255,0.75);
  font-weight: 500;
}

.record-game-item{
  max-width: 234px;
}
.scroll-container{
  height: 80vh;
  overflow-y: scroll;
  &::-webkit-scrollbar{
    width: 0 !important;
  }

}

:deep(.nav-item){
  width: 50%;
}

.drawer-active{
  &:hover{
    background: rgba(0, 0, 0, 0.2);
  }
  &:active{
    filter: brightness(0.8);
    background: rgba(0, 0, 0, 0.2);
  }
}

.game-list-item{
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
@media screen and (max-width: 1071px){
  .game-list-item{
    width: calc(100% / 1);
  }
  .game-list-local{
    width: calc(100% / 1);
  }
}
@media screen and (min-width: 1072px) and (max-width: 1309px){
  .game-list-item{
    width: calc(100% / 2);
  }
  .game-list-local{
    width: calc(100% / 2);
  }
}

@media screen and (min-width: 1310px) and (max-width: 1550px){
  .game-list-item{
    width: calc(100% / 3);
  }
  .game-list-local{
    width: calc(100% / 3);
  }
}

@media screen and (min-width: 1551px) and (max-width: 1790px){
  .game-list-item{
    width: calc(100% / 5);
  }
  .game-list-local{
    width: calc(100% / 6);
  }
}

@media screen and (min-width: 1740px) and (max-width: 2040px){
  .game-list-item{
    width: calc(100% / 6);
  }
  .game-list-local{
    width: calc(100% / 7);
  }
}
@media screen and (min-width: 2040px) and (max-width: 2340px){
  .game-list-item{
    width: calc(100% / 7);
  }
  .game-list-local{
    width: calc(100% / 8);
  }
}
@media screen and (min-width: 2340px) and (max-width: 2640px){
  .game-list-item{
    width: calc(100% / 8);
  }
  .game-list-local{
    width: calc(100% / 9);
  }
}
@media screen and (min-width: 2640px) and (max-width: 2940px){
  .game-list-item{
    width: calc(100% / 9);
  }
}
@media screen and (min-width: 2940px) and (max-width: 3240px){
  .game-list-item{
    width: calc(100% / 10);
  }
}
@media screen and (min-width: 3240px) and (max-width: 3540px){
  .game-list-item{
    width: calc(100% / 11);
  }
}
@media screen and (min-width: 3540px) and (max-width: 3840px){
  .game-list-item{
    width: calc(100% / 12);
  }
}

::v-deep .ant-slider-track{
  background: linear-gradient(90deg, rgba(98, 193, 255, 1) 0%, rgba(51, 141, 255, 1) 100%) !important;
}

:deep(.ant-slider-handle){
  background: rgba(255, 255, 255, 0.85) !important;
  border-color: rgba(151, 151, 151, 1) !important;
}
:deep(.ant-slider-rail){
  background: rgba(255, 255, 255, 0.4) !important;
}
:deep(.ps__rail-y){
  display: none !important;
}
</style>

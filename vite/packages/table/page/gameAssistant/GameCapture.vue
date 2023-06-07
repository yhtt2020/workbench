<template>
  <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" class="min-capture" style="height: calc(80vh - 12.8em);">
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
                 <!-- <div id="fps" ref="fpsChart" class="echarts"></div> -->
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
  </vue-custom-scrollbar>

  <div class="flex px-4 max-capture">
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
      <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: calc(78vh - 11.8em);">
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
    <div class="w-full ml-3  flex flex-col">
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
      <vue-custom-scrollbar class="rounded-md"   @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: calc(74vh - 11.8em);">
        <div class="s-bg rounded-md p-3">
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
            <vue-custom-scrollbar class="rounded-md"   @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: calc(62vh - 11.8em);">
              <div class="flex flex-wrap items-center justify-center">
                <div v-for="item in recordFullScreenData" class="flex rounded-lg sp-w mr-3 mb-3">
                  <img :src="item.url" class="w-full h-full rounded-lg object-cover" alt="">
                </div>
              </div>
            </vue-custom-scrollbar>
          </template>
          <template v-else>
            <vue-custom-scrollbar class="rounded-md"   @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: calc(62vh - 11.8em);">
              <div class="flex flex-wrap items-center justify-center">
                <div v-for="item in recordFullScreenData" class="flex rounded-lg sp-w mr-3 mb-3">
                  <img :src="item.url" class="w-full h-full rounded-lg object-cover" alt="">
                </div>
              </div>
            </vue-custom-scrollbar>
          </template>
        </div>
      </vue-custom-scrollbar>
    </div>
  </div>

  <a-drawer width="500"  title="设置" :placement="right" v-model:visible="recordSetShow">
    <div class="flex flex-col">
      <span class="mb-6">我的截屏保存地址</span>
      <span class="text-center mb-6 py-3 drawer-item-bg rounded-lg">{{ screenShotAddress }}</span>
      <span class="mb-6">我的录制保存地址</span>
      <span class="text-center mb-6 py-3 drawer-item-bg rounded-lg">设置保存地址</span>
      <span class="mb-6">截屏快捷键</span>
      <div class="flex items-center  mb-6">
        <span class="shortcut-key rounded-lg mr-3">{{ shortcutKey }}</span>
        <span class="mr-3 drawer-item-bg rounded-lg btn-active voice-hover replace-key pointer">更换按键</span>
        <span class="mr-3 rounded-lg drawer-item-bg btn-active voice-hover replace-key pointer">重置</span>
      </div>
      <span class="mb-6">录制快捷键</span>
      <div class="flex items-center mb-6">
        <span class="shortcut-key rounded-lg mr-3">{{ recordKey }}</span>
        <span class="mr-3 drawer-item-bg rounded-lg voice-hover btn-active replace-key pointer">更换按键</span>
        <span class="mr-3 rounded-lg drawer-item-bg voice-hover btn-active replace-key pointer">重置</span>
      </div>
      <span class="mb-6">是否启用麦克风录制快捷键</span>
      <div class="flex items-center mb-6">
        <span class="shortcut-key rounded-lg mr-3">{{ microphoneKey }}</span>
        <span class="mr-3 rounded-lg drawer-item-bg voice-hover btn-active replace-key pointer">更换按键</span>
        <span class="mr-3 rounded-lg drawer-item-bg voice-hover btn-active replace-key pointer">重置</span>
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
import { mapWritableState,mapActions } from 'pinia';
import {AreaChartOutlined} from '@ant-design/icons-vue'
import HorizontalCapture from '../../components/HorizontalCaptrue.vue'
import { inspectorStore } from '../../store/inspector'
import * as echarts from "echarts";
import { FPSOption } from '../../components/widgets/supervisory/echartOptions'

export default {
  name:'GameCapture',
  components:{
    AreaChartOutlined,
    HorizontalCapture
  },

  computed:{
    ...mapWritableState(inspectorStore,['displayData'])
  },
 
  data(){
    return{
      systemSound:10, // 系统声音
      soundShow:false,
      microphoneShow:false,
      recordSetShow:false,
      isMonitor:false,
      setShow:false,
      systemMicrophone:20, // 麦克风
      captureType:[
        {title:'录游戏',name:'recordGame'},
        {title:'录全屏',name:'recordFullScreen'},
        {title:'录程序',name:'logger'}
      ],
      defaultRecordingType:{title:'录游戏',name:'recordGame'},
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
  }
}
</script>

<style lang="scss" scoped>
.max-container{
  display: flex;
}
.capture-container{
  max-width: 512px;
  .cp-w{
    max-width: 150px;
    padding: 13px 35px; 
  }
  .cp-orange-active{
    &:active{
      filter: brightness(0.8);
      background: rgba(250,173,20,0.25);
    }
    &:hover{
      background: rgba(250,173,20,0.25);
    }
  }
  .cp-red-active{
    &:active{
      filter: brightness(0.8);
      background: rgba(255,77,79,0.25);
    }
    &:hover{
      background: rgba(255,77,79,0.25);
    }
  }
  .cp-blue-active{
    &:active{
      filter: brightness(0.8);
      background:rgba(80,139,254, 0.25);
    }
    &:hover{
      background:rgba(80,139,254, 0.25);
    }
  }
  .cp-orange{
    background: rgba(250,173,20,0.1);
    .cp-orange-2{
      background: rgba(250,173,20,0.2);
      .orange-full{
        background: rgba(250,173,20,1);
      }
    }
  }
  .orange-red-1{
    background: rgba(255,77,79,0.1);
    .orange-red-2{
      background: rgba(255,77,79,0.2);
      .orange-red-full{
        background: rgba(255,77,79,1);
      }
    }
  }
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

  .cp-lw{
    width: 64px;
    height: 64px;
  }
  .cp-text{
    font-size: 16px;
    color: rgba(255,255,255,0.85);
    font-weight: 500;
  }
}
.min-capture{
  display: none;
}
.s-active{
  border: 3px solid rgba(80,139,254,1);
}
:deep(.nav-item){
  width: 50%;  
}
.monitor-text{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  font-weight: 400;
}
.fps-text{
  font-family: Oswald-Medium;
  font-size: 36px;
  color: rgba(255,255,255,0.85);
  font-weight: 500;
}
.fps-t{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  font-weight: 500;
}
.cpu-w{
  width: 138px;
}
.f-w{
  width: 265px;
}

.echarts {
  margin-top: 1em;
  height: 110px;
  width: calc(100%);
}

.fps-hz{
  font-family: Oswald-SemiBold;
  font-size: 24px;
  color: rgba(255,255,255,0.85);
  font-weight: 600;
}

.fps-sm{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(255,255,255,0.60);
  font-weight: 400;
}

.sp-w{
  width: 213px;
  height: 120px;
}

.shortcut-key{
  width: 270px;
  padding: 12px 12px;
  border: 1px solid rgba(255,255,255,0.1);
  font-size: 14px;
  color: rgba(255,255,255,0.85);
  font-weight: 400;
}
.replace-key{
  padding: 13px 12px;
}
.voice-hover:hover{
  opacity: 0.5;
}

@media screen and (max-width:840px) {
  .max-container{
    display: flex !important;
    flex-direction: column !important;
  }
  .capture-container{
    margin-bottom: 16px !important; 
    margin-right: 0 !important;
  }
  .min-capture{
    display: block !important;
  }
  .max-capture{
    display: none !important;
  }
  .echarts {
    margin-top: 1em;
    height: 110px;
    width: calc(100%);
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
:deep(.ps__thumb-y){
  display: none !important;
}
.record-game-item{
  max-width: 234px;
}
:deep(.ps__rail-y){
  display: none !important;
}

</style>
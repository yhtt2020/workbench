<template>
 <div class="flex flex-col my-3" style="width:500px;"> 
  <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
   <div class="back-button w-10 h-10 flex items-center rounded-lg pointer active-button justify-center" style="background: var(--secondary-bg);" @click="backButton">
    <LeftOutlined style="font-size: 1.25em;" />
   </div>
   <span class="font-16-400" style="color:var(--primary-text);">选择分组</span>
   <div class="close-channel w-10 h-10 flex items-center rounded-lg pointer active-button justify-center"  style="background: var(--secondary-bg);" @click="closeChannel">
    <CloseOutlined  style="font-size: 1.25em;"/>
   </div>
  </div>

  <div class="px-6 flex flex-col">
   <vue-custom-scrollbar :settings="settingsScroller" style="height:350px;">
    <div class="px-4 py-3 flex items-center font-14-400 mb-4 justify-center rounded-lg" style="background: var(--secondary-bg);color:var(--secondary-text);">
     不选择分类默认会将频道添加在最外层第一个位置；支持拖拽排序。
    </div>
    <div class="flex items-center rounded-lg py-3 pointer mb-4 active-button justify-center" style="border: 1px dashed var(--divider);" @click="addClassItem">
     <PlusOutlined style="font-size: 1.25em;"/>
     <span class="font-16-400 ml-2" style="color:var(--primary-text);">添加新分组</span>
    </div>
    
    <div class="flex flex-col" id="classSortTab">
      <div v-for="(item,index) in list" class="flex pointer  rounded-lg items-center px-5 mb-4"
       style="background:var(--secondary-bg);height: 60px;" :class="{'select-bg':statusIndex === index}"
       @click="listClick(index)" :key="index" 
      >

      <template v-if="isEditing && editIndex === index">
        <div class="flex w-full justify-between items-center">
          <a-input style="width:210px;padding: 0;" id="classInputRef" v-model:value="item.name" :bordered="false"></a-input>
          <div class="flex">
            <ClassIcon icon="fluent:checkmark-16-filled" class="pointer" style="font-size: 1.5em;" @click="save"></ClassIcon>
            <ClassIcon icon="fluent:dismiss-16-filled" class="ml-4 pointer" style="font-size: 1.5em;" @click="exitEdit"></ClassIcon>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="flex w-full justify-between">
          <span class="font-16-400" style="color:var(--primary-text);">{{ item.name }}</span>
          <div class="flex">
           <ClassIcon icon="akar-icons:edit" class="pointer" style="font-size: 1.5em;" @click="edit(index)"></ClassIcon>
           <ClassIcon icon="akar-icons:trash-can" class="ml-4 pointer" style="font-size: 1.5em;" @click="deleted"></ClassIcon>
          </div> 
        </div>
      </template>


         <!-- @mouseenter="handleMouseOver(index)"  @mouseleave="handleMouseOut"
        <template v-if="isHover ">
          && hoverIndex === index
          <div class="flex w-full justify-between items-center" v-if="isEditing">
             && hoverIndex === index
            <a-input style="width:210px;" :bordered="false"></a-input>
            <div class="flex">
              <ClassIcon icon="fluent:checkmark-16-filled" class="pointer" style="font-size: 1.5em;" @click="save"></ClassIcon>
              <ClassIcon icon="fluent:dismiss-16-filled" class="ml-4 pointer" style="font-size: 1.5em;" @click="exitEdit"></ClassIcon>
            </div>
          </div>
         
          <div class="flex w-full justify-between" v-else>
            <span>{{ item.name }}</span>
            <div class="flex">
             <ClassIcon icon="akar-icons:edit" class="pointer" style="font-size: 1.5em;" @click="edit"></ClassIcon>
             <ClassIcon icon="akar-icons:trash-can" class="ml-4 pointer" style="font-size: 1.5em;" @click="deleted"></ClassIcon>
            </div> 
          </div>
          
        </template>
        <template v-else>
          <div>{{ item.name }}</div>
        </template> -->
      </div>
    </div>

   </vue-custom-scrollbar>
  </div>

  <div class="flex items-center px-6 justify-end mt-4">
    <XtButton style="width: 64px;height:40px;margin-right: 12px;" @click="closeChannel">取消</XtButton>
    <XtButton style="width: 64px;height:40px; background: var(--active-bg);color:var(--active-text);">确定</XtButton>
  </div>

 </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs,ref } from 'vue'
import { LeftOutlined,CloseOutlined,PlusOutlined } from '@ant-design/icons-vue'
import { classMock } from '../../data/selectClassMock'
import Sortable from 'sortablejs';
import { Icon as ClassIcon} from '@iconify/vue'
import { nextTick } from 'process';


export default defineComponent({
 props:['no','type','linkOpen'],
 components:{
  LeftOutlined,CloseOutlined,PlusOutlined,
  ClassIcon,
 },
 setup (props,ctx) {

  const data = reactive({
   settingsScroller: {
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
   },
   list:classMock,
   isHover:false, // 判断是否悬浮
   isEditing:false, // 是否这种编辑
   hoverIndex:-1,
   editIndex:-1,
   statusIndex:-1, // 点击选中下标
  })


  // 关闭按钮
  const closeChannel = ()=>{
    ctx.emit('close')
  }

  // 鼠标移入
  // const handleMouseOver = (index) =>{
  //   data.hoverIndex = index
  //   data.isHover = true
  // }

  // 鼠标离开
  // const handleMouseOut = () =>{
  //   data.hoverIndex = -1
  //   data.isHover = false
  // }

  // 点击选中状态
  const listClick = (index) =>{
    data.statusIndex = index
    if(data.isEditing){  
      nextTick(()=>{
      const classRef = document.querySelector('#classInputRef')
       classRef.focus()
       classRef.select()
      })
    }
  }
  
  // 触发编辑
  const edit = (index) =>{
    data.isEditing = true
    data.editIndex = index
    nextTick(()=>{
      const classRef = document.querySelector('#classInputRef')
      classRef.focus()
      classRef.select()
    })
  }

  // 删除列表分类项
  const deleted = () =>{

  }

  // 返回按钮
  const backButton = ()=>{
    ctx.emit('back')
  }

  // 添加新分类
  const addClassItem = () =>{
    
  }
  
  // 保存编辑数据
  const save = () =>{
    data.isEditing = false
  }

  // 退出编辑模式
  const exitEdit = () =>{
    data.isEditing = false
  }

  // 拖拽排序
  const onSortEnd = (evt) =>{
    let newIndex = evt.newIndex , oldIndex = evt.oldIndex
    let newItem = document.querySelector('#classSortTab').children[newIndex]
    let oldItem = document.querySelector('#classSortTab').children[oldIndex]
    document.querySelector('#classSortTab').removeChild(newItem)
    if(newIndex > oldIndex){
      document.querySelector('#classSortTab').insertBefore(newItem,oldItem)
    }else{
      document.querySelector('#classSortTab').insertBefore(newItem,oldItem.nextSibling)
    }
    let cloneTemp = [...data.list]   // 将原数据进行复制
    let temp = cloneTemp[evt.oldIndex]  // 获取旧的下标
    cloneTemp.splice(evt.oldIndex, 1)   // 移除旧的下标
    cloneTemp.splice(evt.newIndex, 0, temp) // 将旧的下标进行替换
    data.list = cloneTemp
  }

  onMounted(()=>{
    const el = document.querySelector('#classSortTab')
    // console.log('获取refs',el)
    new Sortable(el,{
      group: 'sortableGroup',
      onEnd:onSortEnd // 拖拽结束时触发的回调函数
    })
  })

  return {
   ...toRefs(data),closeChannel,backButton,addClassItem,
   edit,deleted,listClick,save,exitEdit,
  //  handleMouseOver,handleMouseOut,
  }
 }
})
</script>

<style lang="scss" scoped>

.font-16-400{
 font-family: PingFangSC-Regular;
 font-size: 16px;
 font-weight: 400;
}

.close-channel{
 position: absolute;
 top:1px;
 right:12px;
}

.active-button{
 &:active{
  filter: brightness(0.8);
  opacity: 0.8;
 }
 &:hover{
  opacity: 0.8;
 }
}

.font-14-400{
 font-family: PingFangSC-Regular;
 font-size: 14px;
 font-weight: 400;
}

.back-button{
 position: absolute;
 top: 1px ;
 left: 12px;
}

.select-bg{
  background: var(--active-secondary-bg) !important;
  border:1px solid var(--active-bg) !important;
}
</style>
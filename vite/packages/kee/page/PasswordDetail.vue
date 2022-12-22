<template>
  <div class="breadcrumb-container">
    <a-breadcrumb-separator class="breadcrumb-left">
      <UnlockFilled class="breadcrumb-lock"/>
      <a-breadcrumb-item class="my-password">我的密码</a-breadcrumb-item>
      <a-breadcrumb-item v-if="passwordItem.originData.parentGroup" class="password-group"><a >{{ passwordItem.originData.parentGroup.name }}</a></a-breadcrumb-item>
    </a-breadcrumb-separator>
    <div class="breadcrumb-right">
       <div class="auto-full" v-if="editShow == false">
        <span>自动填充</span>
       </div>
       <div class="auto-full" v-else>
        <span @click="saveChange">保存修改</span>
       </div>
       <a-dropdown :trigger="['click']" width="180" placement="bottomRight">
        <a class="ant-dropdown-link" @click.prevent>
          <EllipsisOutlined class="breadcrumb-icon"/>
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item key="0" @click="openEdit">
              <template #icon>
                <FormOutlined style="font-size:16px;color: rgba(0, 0, 0, 0.65);"/>
              </template>
               <span class="medit">编辑</span>
            </a-menu-item>
            <a-menu-item key="1" @click="openShare">
              <template #icon>
                <ShareAltOutlined style="font-size:16px;color: rgba(0, 0, 0, 0.65);"/>
              </template>
              <span class="share">分享</span>
            </a-menu-item>
            <!--主应用中打开下拉菜单打开-->
            <a-menu-item key="2">
              <template #icon>
                <ExportOutlined style="font-size:16px;color: rgba(0, 0, 0, 0.65);"/>
              </template>
              <span class="share">主应用中打开</span>
            </a-menu-item>
            <a-menu-item key="3" @click="shareDelete">
               <template #icon>
                  <MinusCircleOutlined style="color:rgba(255, 77, 79, 1);font-size:16px;"/>
               </template>
               <span class="delete">删除</span>
            </a-menu-item>
          </a-menu>
        </template>
       </a-dropdown>
    </div>
  </div>
  <div v-if="!passwordItem.icon" style="padding-top: 30%">
    <a-empty >
      <template #description>
      <span>
        暂无密码
        <a-button type="primary">新建密码</a-button>
      </span>
      </template>
    </a-empty>

  </div>

  <div v-else class="breadcrumb-form">
    <vue-custom-scrollbar :settings="settings" style="position:relative;height:calc(100vh - 120px)"
    >
    <div class="breadcrumb-form-header">
      <div class="breadcrumb-bottom-name">
        <ColorImg :src="passwordItem.icon" :width="16" :height="16" :color="this.getColor"></ColorImg>&nbsp;
        <span class="name" v-if="editShow == false">
          {{passwordItem.title || '未命名'}}
        </span>
        <a-form :model="formState" :rules="formRules" v-if="editShow==true">
          <a-form-item name="passwordAccount" required>
            <a-input v-model:value="formState.passwordAccount" />
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div class="breadcrumb-form-footer">
          <div ref="usernameRef" class="breadcrumb-form-username" @mouseover="isMouse==true&&openUsernameHover()" @mouseleave="isMouse==true&&closeUsernameHover()">
             <div class="left-content">
              <span style="padding-bottom:5px;color:rgba(104, 81, 214, 1);">用户名</span>
              <span v-if="editShow==false">{{passwordItem.username || '无用户名'}}</span>
              <a-form :model="formState" :rules="formRules" v-if="editShow==true">
               <a-form-item name="username" required>
                 <a-input style="padding:0  !important;border: none;" v-model:value="formState.username" />
               </a-form-item>
              </a-form>
             </div>
            <div class="right-content"  v-if="usernameVisible == true">
              <span class="username-copy">复制</span>
            </div>
          </div>
          <div ref="passwordRef" class="breadcrumb-form-password" @mouseover="isMouse==true&&opPasswordHover()" @mouseleave="isMouse==true&&closePasswordHover()">
              <div class="password-input">
                <span style="color:rgba(104, 81, 214, 1);">密码</span>
                <div class="password-show" v-if="editShow==false">
                  <a-input  :type="passwordItem.passwordType" style="border:none;padding:0;width: 65%;background: rgba(80, 139, 254, 0);" v-model:value="passwordItem.password"></a-input>
                  <div style="cursor: pointer;" v-if="passwordVisible==true" @click="passwordShowClick(passwordItem)">
                    <EyeFilled v-if="passwordItem.showCopy == true" style="color:rgba(80, 139, 254, 1); padding-right:11px; cursor: pointer;"/>
                    <EyeInvisibleFilled v-if="passwordItem.showCopy==false"  style="color:rgba(80, 139, 254, 1); padding-right:11px; cursor: pointer;"/>
                    <span style="color:rgba(80, 139, 254, 1);">{{ passwordItem.showCopy==true ? '显示':'隐藏'}}</span>
                  </div>
                  <a-divider v-if="passwordVisible==true" type="vertical" style="height: 20px; background-color:rgba(80, 139, 254, 1)" />
                  <span v-if="passwordVisible==true" style="color:rgba(80, 139, 254, 1); cursor: pointer;">复制</span>
                </div>
                <a-form :model="formState" :rules="formRules" v-if="editShow==true">
                  <a-form-item name="password" required>
                    <a-input type="password" style="padding:0  !important;border: none;" v-model:value="formState.password" />
                  </a-form-item>
                </a-form>
              </div>
          </div>
          <div ref="webSiteRef" class="breadcrumb-bottom-website" @mouseover="isMouse==true&&openWebsiteHover()" @mouseleave="isMouse==true&&closeWebsiteHover()">
             <div class="website-top">
              <a href="#" style="color:rgba(104, 81, 214, 1);">网站</a>
              <a   @click="openUrl(passwordItem.domain)" v-if="editShow==false">{{passwordItem.domain}}</a>
              <a-form :model="formState" :rules="formRules" v-if="editShow==true">
                <a-form-item name="siteValue" required>
                  <a-input  style="padding:0 10px !important;" v-model:value="formState.siteValue" />
                </a-form-item>
              </a-form>
             </div>
             <div>
              <span v-if="websiteShow==true" style="color:rgba(80, 139, 254, 1);cursor: pointer;">打开并填写</span>
              <a-divider v-if="websiteShow==true"  type="vertical" style="height: 20px; background-color:rgba(80, 139, 254, 1)" />
              <span v-if="websiteShow==true" style="color:rgba(80, 139, 254, 1);cursor: pointer;">复制</span>
             </div>
          </div>
<!--          <div class="breadcrumb-bottom-website" style="padding-top:0;">-->
<!--              <div class="website-top">-->
<!--                <a href="#" style="color:rgba(104, 81, 214, 1);">网站</a>-->
<!--                <a href="#">{{passwordItem.site_2}}</a>-->
<!--              </div>-->
<!--          </div>-->
          <div class="breadcrumb-bottom-remark">
            <div class="breadcrumb-bottom-remark-top">
             <span style="color:rgba(104, 81, 214, 1);font-width:400;font-size:14px;">
               备注
              </span>

            </div>
            <span style="font-size:14px;font-width:400;color:rgba(0, 0, 0, 0.65);">
              <div style="    max-height: 150px;
    overflow: hidden;
    box-shadow: 0 0 8px #aeaeae91;
    border-radius: 8px;
    background: #f1f1f1;
    margin-bottom: 10px;
    padding:10px;
    margin-top: 10px;" v-html="passwordItem.originData.fields.get('Notes') || '暂无备注'">
              </div></span>
            <p><router-link :to="{name:'remark',params:{uuid:passwordItem.originData.uuid.id}}">
              <ExportOutlined style="font-size:16px;color:rgba(80, 139, 254, 1);"/>
              <span style="font-size:12px; font-width:400;padding-left: 4px;">查看全部</span>
            </router-link></p>
          </div>
    </div>
    </vue-custom-scrollbar>
  </div>

  <a-modal width="408px"  :centered="true" v-model:visible="shareVisible" title="分享">
    <div class="share-container">
        <div class="share-header">
           <span>
            <svg t="1668734179161" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="978" xmlns:xlink="http://www.w3.org/1999/xlink" width="128" height="128">
              <path d="M639.9 351.9C639.9 192.9 511.1 64 352 64S64.2 192.8 64.2 351.9c0 158.9 128.8 287.9 287.9 287.9 158.9-0.1 287.8-128.9 287.8-287.9z m-367.4 16.4c-50.4 0-91.3-40.9-91.3-91.3s40.9-91.3 91.3-91.3 91.3 40.9 91.3 91.3-40.9 91.3-91.3 91.3z" p-id="979" fill="#FFFFFF"></path><path d="M930 732.3L663.8 455l-43 71.6h0.7l253.4 266.3-1.8 27.6-45.9 1.8-237.7-250.4c-39.1 46-85.6 70.5-85.6 70.5l5.5 112 53.3 58.8H706L704.2 949l126.7 11s12.9-12.9 91.9-90c78.9-77.1 7.2-137.7 7.2-137.7z" p-id="980" fill="#FFFFFF"></path>
            </svg>
           </span>
           <div class="share-password-right">
                <p>伏娜枝的语雀帐号</p>
                <p>Isabelle_Fisher</p>
           </div>
        </div>
        <div class="share-content">
          <div class="share-content-item">
            <span class="share-content-title">链接有效期</span>
            <a-select v-model:value="linkValidity" style="width: 160px">
              <a-select-option v-for="item in linkValidityList" :value="item.id" :key="item.id">
                {{item.text}}
              </a-select-option>
              <!--  @focus="focus"  @change="handleChange" -->
            </a-select>
          </div>
          <div class="share-content-item">
            <span class="share-content-title">分享给</span>
            <a-select v-model:value="anyLinkValue" style="width: 160px" >
              <!-- @change="shareSelectChange"
               @focus="focus"  @change="handleChange" -->
              <a-select-option v-for="item in  anyLinkValueList" :value="item.id" :key="item.id">
                {{item.text}}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <a-checkbox v-model:checked="isAllowed" class="share-checkbox">
          <span>仅允许查看 1 次</span>
        </a-checkbox>
        <template v-if="anyLinkValue == 1">
          <span style="margin-bottom:7px;">选择团队</span>
          <a-select v-model:value="teamValue"  mode="tags" style="width: 100%" placeholder="请选择团队">
            <a-select-option value="A_team">A团队</a-select-option>
            <a-select-option value="B_team">B团队</a-select-option>
            <a-select-option value="C_team">C团队</a-select-option>
            <a-select-option value="D_team">D团队</a-select-option>
          </a-select>
          <span style="margin-top:4px;">仅团队内成员可以查看密码</span>
        </template>
        <template v-if="anyLinkValue == 2">
          <span>手机号</span>
          <span style="margin-bottom:4px;color:rgba(00,00,00,0.45);">对方需要验证手机号后才能查看密码</span>
          <a-input-group compact>
            <a-input class="mobile-input" v-model:value="mobileValue" placeholder="请输入手机号" style="width: calc(100% - 120px);" />
            <a-button class="mobile-button" style="width: 29.07%;padding:0 !important;" @click="addTag($event)">
              <PlusOutlined />
              <span style="padding-left:4px;  margin-left: 0 !important;">添加手机号</span>
            </a-button>
          </a-input-group>
          <a-tag closable style="width:29%;margin: 0;padding: 0px 7px; margin-top:4px;"
          v-for="item in  mobileTag" :key="item" @close="romoveTag(item)" >
           {{item}}
          </a-tag>
        </template>
    </div>
    <template #footer>
      <a-button @click="shareVisible = false">取消</a-button>
      <a-button type="primary">获取分享链接</a-button>
    </template>
  </a-modal>
</template>

<script>
import {
  EllipsisOutlined,UnlockFilled,
  FormOutlined,MinusCircleOutlined,
  ShareAltOutlined,PlusOutlined,
  ExclamationCircleOutlined,ExportOutlined,
  EyeFilled,EyeInvisibleFilled, LoginOutlined
} from '@ant-design/icons-vue'
import { Modal , message } from 'ant-design-vue';
import { createVNode } from 'vue'
import { appStore } from '../store'
import { mapState,mapWritableState } from 'pinia'

import vueCustomScrollbar from "../../../src/components/vue-scrollbar.vue";
import ColorImg from '../components/ColorImg.vue'
import { getBgColorFromEntry } from '../util.js'
export default {
  name: 'PasswordDetail',
  components:{
    EllipsisOutlined,UnlockFilled,
    FormOutlined,MinusCircleOutlined,
    ShareAltOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,ExportOutlined,
    EyeFilled,EyeInvisibleFilled,
    ColorImg,
    vueCustomScrollbar,
  },
  computed: {
   ...mapWritableState(appStore, ['passwordItem']),
    getColor(){
     return getBgColorFromEntry(this.passwordItem.originData)
    },
  },
  data(){
    return{
      settings: {
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false,
      },
      // 控制网站是否鼠标悬浮
      websiteVisible:false,
      // 控制用户是否鼠标悬浮
      usernameVisible:false,
      // 控制密码是否鼠标悬浮
      passwordVisible:false,
      // 控制网站是否鼠标悬浮
      websiteShow:false,
      // 分享开关
      shareVisible:false,
      // 链接有效期值
      linkValidity:0,
      linkValidityList:[
        {
          id:0,
          text:'7天'
        },
        {
          id:1,
          text:'1天'
        },
        {
          id:2,
          text:'1小时'
        },
        {
          id:3,
          text:'14天'
        },
        {
          id:5,
          text:'30天'
        }
      ],
      // 分享链接
      anyLinkValue:0,
      anyLinkValueList:[
        {
          id:0,
          text:'任何有此链接的人'
        },
        {
          id:1,
          text:'仅指定团队'
        },
        {
          id:2,
          text:'仅指定人员'
        }
      ],
      // 默认不勾选
      isAllowed:false,
      teamValue:['A_team'],
      // store:appStore(),
      // 是否删除
      deleteVisible:false,
      // 密码编辑内容
      formState:{
         username:'',
         password:'',
         passwordAccount:'',
         websiteValue:'',
         siteValue:''
      },
      // 密码编辑内容验证
      formRules:{
        username:[
            {
              required: true,message: '请输入账号名称',
            }
        ],
        password:[
          {
            required: true,message: '请输入正确密码',
          }
        ],
        passwordAccount:[
           {
            required: true,message: '请输入密码昵称',
           }
        ],
        websiteValue:[
          {
             required: true,message: '请填写网址',
          }
        ]
      },
      mobileValue:'',
      // 手机号标记
      mobileTag:['15072058436'],
      addDisabled:false,
      editShow:false,
      // 取消鼠标事件
      isMouse:true,
      // 密码是否显示和隐藏
      passwordShow:false,
      // 改变密码类型
      passwordType:'password'
    }
  },
  mounted(){
  },
  updated(){
    this.formState.passwordAccount = this.passwordItem.title
    this.formState.username = this.passwordItem.username
    this.formState.websiteValue = this.passwordItem.site_2
    this.formState.password = this.passwordItem.password
    this.formState.siteValue = this.passwordItem.site_1
  },
  methods:{
    openUrl(url){
      ipc.send('addTab',{url})
    },
    // 打开分享
    openShare(){
       // 使用一个值控制弹窗
       this.shareVisible = true
    },
    // 删除事件
    shareDelete(){
      Modal.confirm({
        title:"确定要删除当前密码吗，后续您可以在回收站中进行恢复和彻底删除操作?",
        icon: createVNode(ExclamationCircleOutlined),
        okText:"确定",
        cancelText:"取消",
        onOk(){

        },
        onCancel(){

        }
      });
    },

    // 添加创建tag
    addTag(e){
      // 校验手机号
      const reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
      if(this.mobileValue != '' && reg.test(this.mobileValue)){
        this.mobileTag.push(this.mobileValue)
        this.mobileValue = ''
      }else{
        e.preventDefault()
        message.error({
           duration:2,
           content:'手机号不能为空,请输入正确的手机号'
        })
      }
    },
    // 移除手机号
    removeTag(e){
       this.mobileTag.forEach((item,i,arr)=>{
          if(item == e){
            arr.splice(i, 1);
          }
       })
    },
    // 打开编辑模式
    openEdit(){
       this.editShow = true
       this.isMouse = false
    },
    // 保存修改
    saveChange(){
      this.editShow = false
      this.isMouse = true
    },
    /*鼠标悬浮事件开始*/
    // 用户名称
    openUsernameHover(){
        this.usernameVisible = true
        this.$refs.usernameRef.style = "background:rgba(80, 139, 254, 0.25);"
    },
    // 密码
    opPasswordHover(){
      this.passwordVisible = true
      this.$refs.passwordRef.style = "background:rgba(80, 139, 254, 0.25);"
    },
    // 网站
    openWebsiteHover(){
      this.websiteShow = true
      this.$refs.webSiteRef.style = "background:rgba(80, 139, 254, 0.25);border-radius:6px;"
    },
    /*鼠标悬浮事件结束*/
    /** 鼠标移出事件开始**/
    // 用户名称
    closeUsernameHover(){
       this.usernameVisible = false
       this.$refs.usernameRef.style = "background:rgba(255, 255, 255, 1);"
    },
    // 密码
    closePasswordHover(){
      this.passwordVisible = false
      this.$refs.passwordRef.style = "background:rgba(255, 255, 255, 1);"
    },
    // 网站
    closeWebsiteHover(){
      this.websiteShow = false
      this.$refs.webSiteRef.style = "background:rgba(255, 255, 255, 1);"
    },
    /** 鼠标移出事件结束**/
    // 密码显示和隐藏事件
    passwordShowClick(item){
       if(item.showCopy == false){
         item.showCopy = true
         item.passwordType = "text"
       }else{
         item.showCopy = false
         item.passwordType = "password"
       }
    }
  }
}
</script>
<style>
.ant-dropdown-menu-item:hover, .ant-dropdown-menu-submenu-title:hover{
   background: rgba(80, 139, 254, 0.1) !important;
}
.ant-dropdown-menu{
    padding: 4px !important;
    border-radius: 4px !important;
}
.ant-tag{
   border-style: solid !important;
}

</style>
<style lang="scss" scoped>
.breadcrumb-container{
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  justify-content: space-between;
  .password-group a{
    color: rgba(0, 0, 0, 0.45) !important;
  }
  .password-group .ant-breadcrumb-separator{
    display: none ;
  }
}
.ant-breadcrumb-separator{
   margin: 0;
}
.breadcrumb-left{
   user-select: none;
   display: flex;
   align-items: center;
   .my-password .ant-breadcrumb-separator{
     margin: 0 5px;
   }
}
.breadcrumb-right{
   display: flex;
   align-items: center;
   .auto-full{
     line-height: 18px;
     padding: 3px 11px;
     border: 1px solid rgba(80, 139, 254, 1);
     border-radius: 4px;
     user-select: none;
     cursor: pointer;
     span{
      color: rgba(80, 139, 254, 1);
      font-size: 14px;
      font-weight: 400;
     }
   }
   .breadcrumb-icon{
     font-size: 16px;
     padding-left: 12px;
     cursor: pointer;
     color: rgba(0, 0, 0, 0.45);
   }
}
.breadcrumb-lock{
   margin-right: 12px;
   font-size: 16px !important;
}
.ant-dropdown-menu-item{
   width: 180px;
}
/*添加按钮样式开始*/
.add-btn{
   padding: 0 ;
}
.ant-btn:active{
  background-color: rgba(216, 216, 216, 1);
}
/*添加按钮样式结束*/
/*编辑分享删除样式开始*/
.medit{
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
}
.share{
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
}
.delete{
   color: rgba(255, 77, 79, 1);
   font-weight: 400;
   font-size: 14px;
   line-height: 21px;
}
/*编辑分享删除样式结束*/
/*分享密码样式开始*/
.ant-modal-header{
   text-align: center;
   color: rgba(0, 0, 0, 0.85);
   font-size: 16px;
   font-weight: 600;
   border: none;
}
.ant-modal-body{
   padding: 0 32px;
}
.ant-modal-footer{
   border: none;
}
/*分享密码样式结束*/
/*分享密码内容开始*/
.share-container{
   display: flex;
   flex-direction: column;
   .share-header{
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      span{
         width: 48px;
         height: 48px;
         display: flex;
         align-items: center;
         justify-content: center;
         border-radius: 6px;
         background: linear-gradient(41deg, rgba(45, 74, 253, 0.59) 0%, rgba(20, 99, 250, 1) 100%), rgba(216, 216, 216, 1);
         svg{
           width: 16px;
           height: 16px;
         }
      }
      .share-password-right{
         padding-left: 12px;
         p{
           margin: 0;
           line-height: 17px;
           font-size: 14px;
           font-weight: 400;
           &:nth-of-type(1){
             color: rgba(0, 0, 0, 0.85);
             margin-bottom: 3px;
           }
           &:nth-of-type(2){
              color: rgba(0, 0, 0, 0.45);
           }
         }
      }
   }
   .share-content{
        display: flex;
        justify-content: space-between;
        .share-content-item{
           width: 160px;
           display: flex;
           flex-direction: column;
           margin-bottom: 24px;
           .share-content-title{
             margin-bottom: 7px;
             font-weight: 400;
             font-size: 14px;
             line-height: 21px;
             color: rgba(0, 0, 0, 0.65);
           }
        }
   }
   .share-checkbox{
    margin-bottom: 24px;
   }
}
.ant-tag-close-icon{
   margin-left: 7px !important;
}
.mobile-input:hover{
  border-color: none !important;
}
.mobile-button:hover, .mobile-button:focus{
  border-color: rgba(217, 217, 217, 1) !important;
  color: rgba(0, 0, 0, 0.65) !important;
}
/*分享密码内容结束*/
/*账号内容开始*/
.breadcrumb-form-header{
   padding-bottom: 22px;
}
.breadcrumb-bottom-name{
   display: flex;
   align-items: center;
  .avatar {
    padding-right: 8px;
    padding-bottom: 8px;
    img{
      width: 16px;
      height: 16px;
    }
  }
  .name{
  }
}
.ant-form{
   width: 100%;
}

.breadcrumb-form-username{
  display: flex;
  justify-content: space-between;
  border: 1px solid rgba(230, 230, 230, 1);
  line-height: 16px;
  padding: 7px 16px 9px 12px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  .left-content{
     display: flex;
     flex-direction: column;
     justify-content: space-between;
  }
  .right-content{
     display: flex;
     align-items: center;
     justify-content: center;
    .username-copy{
      color: rgba(80, 139, 254, 1);
      font-size: 14px;
      font-weight: 400;
      line-height: 32px;
      cursor: pointer;
      user-select: none;
   }
  }
}
.breadcrumb-form-password{
  display: flex;
  justify-content: space-between;
  border: 1px solid rgba(230, 230, 230, 1);
  border-top: none;
  line-height: 16px;
  padding: 7px 16px 9px 12px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  margin-bottom: 16px;
  .password-input{
    width: 100%;
    .password-show{
      display: flex;
    }
  }
}
.breadcrumb-bottom-website{
   padding: 8px 16px 8px 12px;
   display: flex;
   align-items: center;
   justify-content: space-between;
   .website-top{
     display: flex;
     flex-direction: column;
   }
}
.breadcrumb-bottom-remark{
  padding: 0 12px;
}
/*账号内容结束*/
.ant-dropdown-placement-bottomLeft{
  min-width: 183px !important;
  top: 698px !important;
  left: 955px !important;
}
</style>

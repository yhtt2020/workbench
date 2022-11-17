<template>
  <div class="breadcrumb-container">
    <a-breadcrumb-separator class="breadcrumb-left">
      <UnlockFilled class="breadcrumb-lock"/>
      <a-breadcrumb-item class="my-password">我的密码</a-breadcrumb-item>
      <a-breadcrumb-item class="password-group"><a href="">分组A</a></a-breadcrumb-item>
    </a-breadcrumb-separator>   
    <div class="breadcrumb-right">
       <div class="auto-full">
        <span>自动填充</span>
       </div>
       <a-dropdown :trigger="['click']" width="180">
        <a class="ant-dropdown-link" @click.prevent>
          <EllipsisOutlined class="breadcrumb-icon"/>
          <DownOutlined />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item key="0">
              编辑
            </a-menu-item>
            <a-menu-item key="1">
              分享
            </a-menu-item>
            <a-menu-item key="3">
               删除
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div> 
  </div>
  <div class="breadcrumb-bottom-container">
      <div class="breadcrumb-bottom-name">
          <!-- <span>
             <i class="iconfont iconyuechi1"></i>
          </span> -->
          <span class="name">禅道账号</span>
      </div>
      <div class="breadcrumb-bottom-card">
         <div class="breadcrumb-bottom-user">
            <a href="" class="user">用户名</a>
            <span>Francisco_Phillips</span>
         </div>
         <div class="breadcrumb-bottom-password">
            <a href="" class="cryptogram">密码</a>
            <span>··········</span>
         </div>
      </div>
      <div class="breadcrumb-bottom-sites">
          <a href="" class="sites-name">网站</a>
          <a href="http://zt.xiangtian.ren/" class="sites">zt.xaingtian.ren</a>
      </div>
      <div class="breadcrumb-bottom-sites">
        <a href="" class="sites-name">网站</a>
        <a href="https://www.yuque.com/" class="sites">www.yuque.com</a>
      </div>
      <div class="breadcrumb-bottom-remark">
           <a href="#" class="remark">备注</a>
           <span class="ana">团队语雀公用帐号，注意不要对外分享该密码</span>
      </div>
  </div>

</template>

<script>
import {
  EllipsisOutlined,UnlockFilled,
} from '@ant-design/icons-vue'
export default {
  name: 'PasswordDetail',
  components:{
    EllipsisOutlined,UnlockFilled,
  }
}
</script>
<style>

</style>
<style lang="scss">
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

/*底部内容开始*/
.breadcrumb-bottom-name {
   margin-bottom: 24px;
   .name{
     padding-left: 13px;
     font-size: 16px;
     font-weight: 500;
     color: rgba(0, 0, 0, 0.85);
   }
}
.breadcrumb-bottom-card{
   border: 1px solid rgba(230, 230, 230, 1);
   border-radius: 6px;
   margin-bottom: 24px;
   .breadcrumb-bottom-user{
     padding: 7px 12px 6px 12px;
     border-bottom: 1px solid rgba(230, 230, 230, 1);
     display: flex;
     flex-direction: column;
     .user{
       color: rgba(104, 81, 214, 1);
       font-size: 12px;
       font-weight: 400;
       line-height: 17px;
     }
     span{
      font-size: 14px;
      line-height: 20px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 400;
     }
   }
   .breadcrumb-bottom-password{
    padding: 7px 12px 6px 12px;
    display: flex;
    flex-direction: column;
    .cryptogram{
      color: rgba(104, 81, 214, 1);
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
    }
    span{
       font-size: 22px;
       color: rgba(0, 0, 0, 0.85);
       font-weight: 400;
       line-height: 22px;
    }
   }
}
.breadcrumb-bottom-sites{
    display: flex;
    flex-direction: column;
    padding: 0 12px;
    margin-bottom: 24px;
    .sites-name{
       color: rgba(104, 81, 214, 1);
       font-size: 12px;
       font-weight: 400;
       line-height: 17px;
    }
    .sites{
       line-height: 20px;
    }
}
.breadcrumb-bottom-remark{
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  margin-bottom: 24px;
  .remark{
     color: rgba(104, 81, 214, 1);
     font-size: 12px;
     font-weight: 400;
     line-height: 17px;
  }
  .ana{
     color: rgba(0, 0, 0, 0.65);
     font-size: 14px;
     font-weight: 400;
     line-height: 20px;
  }
}
/*底部内容结束*/

</style>

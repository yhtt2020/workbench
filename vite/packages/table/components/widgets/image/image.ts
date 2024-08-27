import {defineStore} from "pinia";
// @ts-ignore
export const image = defineStore("image", {
    state(){
      return {
        defaultImg:{
          mode:'link',
          src:'data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=',
          title:'新图片',
          open:{
            type:'link'
          },
          radius:6,
          delay:5,
          objectFit:'cover'
        },
        form: {
          open:{

          },
          linkValue:{}
        },
        imgList:[]
      }
    }
  }
)

export var appData = {
  data:{
    lv:0
  },
  setData(value){
    console.log(appData.data)

    appData.data.lv = value.lv
  },
  getData(){
    return appData.data
  }
}

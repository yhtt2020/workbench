const desk={
  initialize(){
    ipc.on('getDesks',(event,args)=>{
      try{
        let desks=JSON.parse(localStorage.getItem('desks'))
        ipc.send('gotDesks',{desks})
      }catch (e) {
        ipc.send('gotDesks',{desks:[]})
      }
    })
  }
}
module .exports=desk

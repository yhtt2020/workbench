const standReturn={

  success(data){
    return {
      status:1,
      data
    }
  },
  failure(data){
    return {
      status:0,
      data
    }
  }
}

module.exports=standReturn

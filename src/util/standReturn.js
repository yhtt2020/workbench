const standReturn={

  success(data={}){
    return {
      status:1,
      data
    }
  },
  failure(data,info=''){
    return {
      status:0,
      data,
      info
    }
  },
  autoReturn(result){
    console.log(result)
    if (result.code === 1000) {
      return standReturn.success(result.data)
    } else {
      return standReturn.failure(result.data)
    }
  }
}

module.exports=standReturn

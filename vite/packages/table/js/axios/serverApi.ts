// import isXT from "../../ui/hooks/model"
export const getConfig = async () => {
  let token;
  let res
// if (isXT) {
  res  = await window.tsbApi.user.get()
  token =  res.data.token
// }

  return {
    headers: {
      'Authorization': token
    }
  }
}

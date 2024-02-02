import {useEnv} from "../../ui/hooks/useEnv"
export const getConfig = async () => {
  let token;
  let res
if (!useEnv()) {
  res  = await window.tsbApi.user.get()
  token =  res.data.token
}

  return {
    headers: {
      'Authorization': token
    }
  }
}

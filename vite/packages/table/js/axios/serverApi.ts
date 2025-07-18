import cache from "../../components/card/hooks/cache";
export const getConfig = async () => {
  let token = cache.get("ttUserToken");
  if (!token) {
    const res = await tsbApi.user.get();
    token = res?.data?.token;
  }

  return {
    headers: {
      Authorization: token,
    },
  };
};

export const useUninstallCard = (id: string) => {
  tsbApi.ttapp.uninstall(id, (data) => {
    console.log("data :>> ", data);
  });
};


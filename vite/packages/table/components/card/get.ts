import { ref, onMounted, onUnmounted, nextTick } from "vue";

export default function useElementDimensions(elementRef) {
  const dimensions: any = ref({
    width: 0,
    height: 0,
  });

  const updateDimensions = () => {
    dimensions.value = {
      width: elementRef.value.offsetWidth,
      height: elementRef.value.offsetHeight,
    };
  };

  onMounted(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateDimensions);
  });

  return dimensions;
}

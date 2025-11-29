import { defineStore } from "pinia";
import { ref } from "vue";

export const useLocationStore = defineStore("location", () => {
  const selectedProvince = ref(null);
  const selectedCity = ref(null);

  function setLocation(province, city) {
    selectedProvince.value = province;
    selectedCity.value = city;
  }

  return {
    selectedProvince,
    selectedCity,
    setLocation,
  };
});

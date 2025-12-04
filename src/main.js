import { createApp } from "vue";
import { createPinia } from "pinia";
import ConfirmationService from "primevue/confirmationservice";
import router from "./router";
import PrimeVue from "primevue/config";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import { MotionPlugin } from "@vueuse/motion";
import "./style.css";
import App from "./App.vue";

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      100: "#caf0f8",
      200: "#ade8f4",
      300: "#90e0ef",
      400: "#48cae4",
      500: "#00b4d8",
      600: "#0096c7",
      700: "#0077b6",
      800: "#023e8a",
      900: "#03045e",
    },
  },
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      prefix: "p",
      cssLayer: { name: "primevue", order: "theme, base, primevue" },
      darkModeSelector: "false",
    },
  },
  locale: {
    firstDayOfWeek: 1,
    dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    dayNamesShort: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
    dayNamesMin: ["Mi", "Sn", "Sl", "Rb", "Km", "Jm", "Sb"],
    monthNames: [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
    monthNamesShort: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ],
    today: "Hari ini",
    clear: "Hapus",
  },
});
app.use(ConfirmationService);
app.use(MotionPlugin);
app.mount("#app");

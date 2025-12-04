<template>
  <div class="min-h-screen bg-[#003A70] text-white flex flex-col">
    <!-- HEADER -->
    <header class="px-6 py-5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center"
        >
          <span class="font-semibold text-sm">HS</span>
        </div>
        <p class="text-lg font-semibold tracking-wide">HERY SUSILO</p>
      </div>

      <div class="flex items-center gap-2">
        <Button
          variant="text"
          icon="pi pi-bell"
          class="text-white/70 hover:text-white"
        />
        <Button
          variant="text"
          icon="pi pi-refresh"
          class="text-white/70 hover:text-white"
          @click="reloadPage"
        />
      </div>
    </header>

    <!-- CONTENT WRAPPER -->
    <main class="bg-white rounded-t-3xl px-6 py-6 text-gray-800 flex-1">
      <!-- TITLE -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold tracking-tight text-gray-900">
            Jatim Park 3
          </h2>

          <Button
            variant="text"
            icon="pi pi-sliders-h"
            label="Settings"
            class="text-gray-700 hover:text-primary-600"
            @click="showSettings = true"
          />
        </div>

        <!-- GRID MENU -->
        <div class="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-8">
          <div
            v-for="i in allMenuItems"
            :key="i.label"
            @click="setActiveMenu(i.label)"
            :class="[
              'flex flex-col items-center py-4 rounded-xl cursor-pointer transition shadow-sm',
              activeMenus[i.label]
                ? 'bg-primary-50 border border-primary-300 scale-[1.03]'
                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:shadow',
            ]"
          >
            <i
              :class="[
                'pi text-2xl',
                i.icon,
                activeMenus[i.label] ? 'text-primary-700' : 'text-gray-500',
              ]"
            />

            <!-- LABEL MENU -->
            <span
              :class="[
                'text-xs mt-2 font-semibold',
                activeMenus[i.label] ? 'text-primary-800' : 'text-gray-700',
              ]"
            >
              {{ i.label }}
            </span>

            <!-- STATUS MENU -->
            <template v-if="i.label !== 'Printer'">
              <span
                :class="[
                  'text-[10px] mt-1 font-medium',
                  activeMenus[i.label] ? 'text-primary-600' : 'text-gray-600',
                ]"
              >
                {{ activeMenus[i.label] ? "ON" : "OFF" }}
              </span>
            </template>

            <!-- PRINTER STATUS TAG -->
            <template v-else>
              <Tag
                :value="printerStatus"
                :severity="printerColor"
                class="mt-1 text-[10px]"
                rounded
              />
            </template>
          </div>
        </div>

        <!-- CARD OMSET -->
        <div
          class="mt-6 p-5 rounded-xl bg-gray-50 border border-gray-200 shadow-sm flex justify-between items-center gap-5"
        >
          <div>
            <p class="text-gray-600 text-sm">Omset</p>
            <p class="font-bold text-2xl mt-1">Rp 100.000.000</p>
          </div>

          <div class="relative inline-block w-32 md:w-32">
            <video
              ref="monitorVideo"
              playsinline
              muted
              class="w-full aspect-square object-contain rounded-lg cursor-pointer transition"
              @click="openMonitorPreview"
            ></video>

            <div
              class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg cursor-pointer w-full h-full"
              @click="openMonitorPreview"
            >
              <!-- BELUM STREAMING (TOMBOL AWAL) -->
              <p
                v-if="!isStreaming && !loadingStream"
                class="text-center text-xs px-3 text-white"
              >
                Klik untuk melihat layar
              </p>

              <!-- LOADING -->
              <div
                v-if="loadingStream"
                class="flex flex-col items-center gap-2"
              >
                <i class="pi pi-spin pi-spinner text-white text-xl"></i>
                <p class="text-xs text-white">Menghubungkan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DATA LOG -->
      <section class="mt-10">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-900">Data Log</h2>
        </div>

        <DataTable
          :value="logs"
          removableSort
          stripedRows
          showGridlines
          class="rounded-xl overflow-hidden shadow text-sm bg-white"
          tableStyle="min-width: 100%"
        >
          <Column field="tanggal" header="Tanggal & Jam" sortable />
          <Column field="aktivitas" header="Aktivitas" sortable />
          <Column field="status" header="Status" sortable>
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.status"
                :severity="statusSeverity[slotProps.data.status]"
                rounded
              />
            </template>
          </Column>
        </DataTable>
      </section>

      <!-- SETTINGS -->
      <Dialog
        v-model:visible="showSettings"
        modal
        header="Pengaturan Sistem"
        :style="{ width: '900px', maxWidth: '95%' }"
        class="text-sm"
      >
        <div class="flex flex-col gap-6">
          <!-- GRID SETTINGS -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- DELAY -->
            <div class="p-4 bg-white rounded-xl shadow border border-gray-300">
              <div class="flex items-center gap-2 mb-2 text-primary-700">
                <i class="pi pi-clock"></i>
                <p class="font-semibold text-gray-700">Delay Deteksi</p>
              </div>

              <div class="flex items-center gap-2">
                <InputNumber
                  v-model="delay"
                  :min="0"
                  class="flex-1"
                  inputClass="w-full"
                />
                <span class="text-gray-500 text-sm">detik</span>
              </div>

              <Button
                label="Simpan"
                size="small"
                class="w-full mt-3"
                @click="updateDelay"
              />
            </div>

            <!-- MIN FACE SIZE -->
            <div class="p-4 bg-white rounded-xl shadow border border-gray-300">
              <div class="flex items-center gap-2 mb-2 text-primary-700">
                <i class="pi pi-user"></i>
                <p class="font-semibold text-gray-700">Minimum Face Size</p>
              </div>

              <div class="flex items-center gap-2">
                <InputNumber
                  v-model="minFace"
                  :min="20"
                  class="flex-1"
                  inputClass="w-full"
                />
                <span class="text-gray-500 text-sm">px</span>
              </div>

              <Button
                label="Simpan"
                size="small"
                class="w-full mt-3"
                @click="updateMinFace"
              />
            </div>
          </div>

          <!-- VIDEO MANAGEMENT -->
          <div class="p-5 bg-white rounded-2xl shadow border border-gray-300">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-2">
                <i class="pi pi-video text-primary-700 text-xl"></i>
                <p class="font-semibold">Manajemen Video</p>
              </div>

              <Button
                label="Hapus Semua"
                size="small"
                severity="danger"
                outlined
                icon="pi pi-trash"
                @click="deleteAllVideos"
              />
            </div>

            <!-- PILIH KATEGORI UPLOAD (PrimeVue Dropdown) -->
            <div class="mb-4">
              <label class="font-medium text-sm text-gray-700"
                >Kategori Video</label
              >

              <Select
                v-model="uploadCategory"
                :options="categoryOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full mt-1"
                placeholder="Pilih kategori"
              />
            </div>

            <!-- UPLOAD BOX -->
            <div
              class="rounded-xl border border-gray-300 border-dashed p-6 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
              @click="uploadRef.click()"
            >
              <i class="pi pi-upload text-3xl text-gray-500"></i>
              <p class="mt-2 text-sm font-medium text-gray-700">
                Klik untuk memilih video
              </p>
              <p class="text-xs text-gray-500">MP4 / AVI / MOV / MKV</p>
            </div>

            <input
              type="file"
              ref="uploadRef"
              multiple
              class="hidden"
              @change="onFileSelected"
            />

            <!-- PREVIEW UPLOAD -->
            <div v-if="previewUpload.length" class="mt-5">
              <div class="flex items-center justify-between mb-2">
                <p class="font-semibold">Preview Sebelum Upload</p>
                <Button label="Upload" size="small" @click="uploadVideos" />
              </div>

              <div
                class="grid grid-cols-1 sm:grid-cols-2 gap-4 place-items-center"
              >
                <div
                  v-for="vid in previewUpload"
                  :key="vid.url"
                  class="bg-white border rounded-xl shadow-sm p-3"
                >
                  <p class="text-xs font-medium truncate">{{ vid.name }}</p>

                  <video
                    :src="vid.url"
                    controls
                    class="rounded-lg w-full aspect-video mt-2 bg-black"
                  ></video>
                </div>
              </div>
            </div>

            <!-- VIDEO LIST -->
            <div class="mt-8">
              <p class="font-semibold mb-3">Daftar Video</p>

              <template v-for="(items, category) in videoList" :key="category">
                <h3 class="text-sm font-bold text-gray-700 mt-4 mb-2 uppercase">
                  {{ category }}
                </h3>

                <div
                  v-if="items.length"
                  class="grid grid-cols-1 sm:grid-cols-2 gap-4 place-items-center"
                >
                  <div
                    v-for="vid in items"
                    :key="vid"
                    class="bg-gray-50 rounded-xl flex gap-3"
                  >
                    <Checkbox
                      v-model="selectedToDelete[category]"
                      :value="vid"
                      :inputId="'vid-' + category + '-' + vid"
                    />

                    <label
                      :for="'vid-' + category + '-' + vid"
                      class="flex-1 cursor-pointer"
                    >
                      <p class="text-xs font-medium truncate">{{ vid }}</p>

                      <div
                        class="mt-2 bg-black rounded-lg overflow-hidden w-full max-w-full"
                      >
                        <video
                          :src="API_URL + '/videos/' + category + '/' + vid"
                          controls
                          class="w-full aspect-video object-contain object-center"
                        ></video>
                      </div>
                    </label>
                  </div>
                </div>

                <p v-else class="text-gray-500 text-sm text-center py-2">
                  Tidak ada video dalam kategori ini.
                </p>
              </template>

              <Button
                v-if="hasSelected"
                label="Hapus Video Terpilih"
                severity="danger"
                class="w-full mt-4"
                icon="pi pi-trash"
                size="small"
                @click="deleteSelectedVideos"
              />
            </div>

            <Button
              label="Refresh Daftar Video"
              class="w-full mt-4"
              icon="pi pi-refresh"
              size="small"
              outlined
              @click="loadVideos"
            />
          </div>
        </div>
      </Dialog>

      <!-- FULLSCREEN VIDEO -->
      <Dialog
        v-model:visible="showFullscreen"
        modal
        :closable="true"
        :style="{ width: '100vw', height: '100vh', maxWidth: '100%' }"
        contentStyle="padding:0; height:100vh;"
      >
        <video
          ref="fullscreenVideo"
          autoplay
          playsinline
          controls
          class="w-full h-full object-contain bg-black"
        ></video>
      </Dialog>
    </main>
  </div>

  <ConfirmDialog />
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from "vue";
import axios from "axios";
import mqtt from "mqtt";
import { useConfirm } from "primevue/useconfirm";

const API_URL = import.meta.env.VITE_API_URL;
const SIGNALING_URL = import.meta.env.VITE_SIGNALING_URL;

const hasStream = ref(false);

const showSettings = ref(false);
const monitorVideo = ref(null);

const lampOn = ref(false);
const isStreaming = ref(false);
const allowReconnect = ref(true);
const loadingStream = ref(false);

const printerStatus = ref("Unknown");
const printerErrors = ref([]);

const uploadCategory = ref("ajakan");

// Setting states
const delay = ref(5);
const minFace = ref(120);

const uploadRef = ref(null);
const videoList = ref({
  ajakan: [],
  promosi: [],
});
const selectedToDelete = ref({
  ajakan: [],
  promosi: [],
});
const categoryOptions = [
  { label: "Ajakan", value: "ajakan" },
  { label: "Promosi", value: "promosi" },
];
const hasSelected = computed(
  () =>
    selectedToDelete.value.ajakan.length > 0 ||
    selectedToDelete.value.promosi.length > 0
);
const previewUpload = ref([]);

const showFullscreen = ref(false);
const fullscreenVideo = ref(null);

const confirm = useConfirm();

async function fetchPrinterStatus() {
  try {
    const res = await axios.get(API_URL + "/printer/status");
    if (res.data.status === "success") {
      printerStatus.value = res.data.data.status;
      printerErrors.value = res.data.data.errors;
    } else {
      printerStatus.value = "Error";
      printerErrors.value = ["Tidak dapat membaca printer"];
    }
  } catch (e) {
    printerStatus.value = "Offline";
    printerErrors.value = ["Tidak dapat terhubung"];
  }
}

const printerColor = computed(() => {
  const s = printerStatus.value.toLowerCase();

  if (s.includes("idle") || s.includes("ready")) return "success";
  if (s.includes("printing")) return "info";
  if (s.includes("warmup")) return "warn";
  if (s.includes("error")) return "danger";
  if (s.includes("offline")) return "danger";

  return "secondary";
});

function reloadPage() {
  window.location.reload();
}

function cleanupWebRTC() {
  console.log("[WEB] Cleaning up WebRTC...");

  allowReconnect.value = false; // matikan auto reconnect

  // Hentikan stream
  if (monitorVideo.value?.srcObject) {
    monitorVideo.value.srcObject.getTracks().forEach((t) => t.stop());
    monitorVideo.value.srcObject = null;
  }

  if (fullscreenVideo.value?.srcObject) {
    fullscreenVideo.value.srcObject.getTracks().forEach((t) => t.stop());
    fullscreenVideo.value.srcObject = null;
  }

  // Tutup PeerConnection
  if (window.activePC) {
    try {
      window.activePC.close();
    } catch (e) {}
    window.activePC = null;
  }

  // Tutup signaling WebSocket
  if (window.activeSignal) {
    try {
      window.activeSignal.close();
    } catch (e) {}
    window.activeSignal = null;
  }

  // reset state
  isStreaming.value = false;
  hasStream.value = false;

  console.log("[WEB] WebRTC Stopped.");
}

const setActiveMenu = (label) => {
  const newState = !activeMenus.value[label];
  const actionText = newState ? "mengaktifkan" : "menonaktifkan";

  confirm.require({
    message: `Yakin ingin ${actionText} ${label}?`,
    header: "Konfirmasi",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "Yakin",
    rejectLabel: "Batal",
    acceptClass: "p-button-primary",
    rejectClass: "p-button-secondary",

    accept: () => {
      // Ubah state
      activeMenus.value[label] = newState;

      // Kirim MQTT sesuai label
      if (label === "Lampu") {
        const status = newState ? "lampu on" : "lampu off";
        lampOn.value = newState;
        client.publish("ptb/kontrol", status);
      } else if (label === "USB") {
        const status = newState ? "usb on" : "usb off";
        client.publish("ptb/kontrol", status);
      } else if (label === "Printer") {
        const status = newState ? "printer on" : "printer off";
        client.publish("ptb/kontrol", status);
      }
    },

    reject: () => {
      // Tidak mengubah apa pun jika dibatalkan
    },
  });
};

const client = mqtt.connect(import.meta.env.VITE_MQTT_URL, {
  protocolVersion: 5,
  username: import.meta.env.VITE_MQTT_USERNAME,
  password: import.meta.env.VITE_MQTT_PASSWORD,
  properties: {
    sessionExpiryInterval: 15,
  },
});

client.on("message", (topic, message) => {
  console.log("MQTT received:", topic, message.toString());
});

client.on("connect", () => {
  console.log("MQTT Connected");

  // subscribe jika Anda ingin mendapat feedback
  client.subscribe("ptb/kontrol");
});

async function openMonitorPreview() {
  // Jika belum streaming → mulai WebRTC
  if (!isStreaming.value) {
    loadingStream.value = true; // Tampilkan spinner
    allowReconnect.value = true;

    isStreaming.value = true;
    hasStream.value = false;

    await initWebRTC();
    return; // fullscreen akan dibuka setelah track diterima
  }

  // Jika sudah streaming → langsung buka fullscreen
  showFullscreen.value = true;
  fullscreenVideo.value.srcObject = monitorVideo.value.srcObject;
}

async function initWebRTC() {
  let clientId = localStorage.getItem("screen_client_id");
  if (!clientId) {
    clientId = Math.random().toString(36).substring(2);
    localStorage.setItem("screen_client_id", clientId);
  }

  console.log("[WEB] Initializing WebRTC...");

  // === CLOSE old WebSocket if exists ===
  if (window.activeSignal) {
    try {
      window.activeSignal.close();
    } catch (e) {}
  }

  const signaling = new WebSocket(SIGNALING_URL);
  signaling.binaryType = "blob";
  window.activeSignal = signaling;

  signaling.onopen = () => {
    console.log("[WEB] Connected to signaling server");
    signaling.send(JSON.stringify({ type: "ready", client_id: clientId }));
  };

  signaling.onclose = () => {
    console.warn("[WEB] Signaling closed");

    // Jangan reconnect jika streaming dihentikan manual
    if (allowReconnect.value) {
      console.warn("[WEB] Auto-reconnect...");
      setTimeout(initWebRTC, 1500);
    }
  };

  // === NEW PeerConnection ===
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  // === CLOSE OLD PEER ===
  if (window.activePC) {
    try {
      window.activePC.close();
    } catch (e) {}
  }
  window.activePC = pc;

  // High quality
  pc.addEventListener("negotiationneeded", async () => {
    const params = pc.getSenders()[0]?.getParameters() || {};
    if (!params.encodings) params.encodings = [{}];

    params.encodings[0].maxBitrate = 5_000_000;
    params.encodings[0].minBitrate = 2_000_000;
    params.encodings[0].maxFramerate = 30;
    params.encodings[0].scaleResolutionDownBy = 1;

    await pc.getSenders()[0].setParameters(params);
  });

  pc.oniceconnectionstatechange = () =>
    console.log("[WEB] ICE state:", pc.iceConnectionState);

  pc.onconnectionstatechange = () =>
    console.log("[WEB] Conn state:", pc.connectionState);

  pc.ontrack = (event) => {
    console.log("[WEB] TRACK RECEIVED");

    loadingStream.value = false;
    hasStream.value = true;
    monitorVideo.value.srcObject = event.streams[0];

    // Auto buka fullscreen begitu stream masuk
    showFullscreen.value = true;

    // copy stream ke fullscreen video
    nextTick(() => {
      fullscreenVideo.value.srcObject = monitorVideo.value.srcObject;
    });
  };

  // Handle signaling server messages
  signaling.onmessage = async (msg) => {
    let payload = msg.data;
    if (payload instanceof Blob) payload = await payload.text();

    let data;
    try {
      data = JSON.parse(payload);
    } catch {
      console.error("Malformed message:", payload);
      return;
    }

    if (data.type === "offer") {
      await pc.setRemoteDescription({
        type: "offer",
        sdp: data.sdp,
      });

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      signaling.send(
        JSON.stringify({
          type: "answer",
          client_id: clientId,
          sdp: answer.sdp,
          sdpType: answer.type,
        })
      );
    }

    if (data.type === "candidate") {
      await pc.addIceCandidate({
        candidate: data.candidate,
        sdpMid: data.sdpMid,
        sdpMLineIndex: data.sdpMLineIndex,
      });
    }
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      signaling.send(
        JSON.stringify({
          type: "candidate",
          client_id: clientId,
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
        })
      );
    }
  };
}

function onFileSelected(event) {
  const files = event.target.files;
  previewUpload.value = [];

  for (const f of files) {
    previewUpload.value.push({
      name: f.name,
      url: URL.createObjectURL(f),
    });
  }
}

async function loadSettings() {
  const res = await axios.get(API_URL + "/settings/get");
  delay.value = res.data.delay;
  minFace.value = res.data.min_face;
}

// LOAD VIDEO LIST
async function loadVideos() {
  const res = await axios.get(API_URL + "/video/list");
  videoList.value = res.data;

  // Reset checkbox state
  selectedToDelete.value = {
    ajakan: [],
    promosi: [],
  };
}

// UPDATE DELAY
async function updateDelay() {
  await axios.post(API_URL + "/settings/set-delay?seconds=" + delay.value);
  await loadSettings();
  alert("Delay berhasil diupdate!");
}

// UPDATE MIN FACE SIZE
async function updateMinFace() {
  await axios.post(
    API_URL + "/settings/set-min-face-size?size=" + minFace.value
  );
  await loadSettings();
  alert("Minimal face size berhasil diupdate!");
}

// UPLOAD VIDEO MULTIPLE
async function uploadVideos() {
  const files = uploadRef.value.files;
  if (!files.length) return alert("Pilih file terlebih dahulu!");

  const form = new FormData();
  for (const f of files) form.append("files", f);

  await axios.post(
    API_URL + "/video/upload?category=" + uploadCategory.value,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  alert("Upload berhasil!");
  previewUpload.value = [];
  uploadRef.value.value = "";

  loadVideos();
}

// DELETE VIDEO
async function deleteSelectedVideos() {
  const lists = selectedToDelete.value;

  for (const category of ["ajakan", "promosi"]) {
    for (const vid of lists[category]) {
      await axios.post(
        API_URL +
          `/video/delete?category=${category}&filename=${encodeURIComponent(
            vid
          )}`
      );
    }
  }

  alert("Video terpilih berhasil dihapus!");
  loadVideos();
}

async function deleteAllVideos() {
  if (!confirm("Yakin hapus semua video?")) return;

  for (const category of ["ajakan", "promosi"]) {
    for (const vid of videoList.value[category]) {
      await axios.post(
        API_URL +
          `/video/delete?category=${category}&filename=${encodeURIComponent(
            vid
          )}`
      );
    }
  }

  alert("Semua video berhasil dihapus!");
  loadVideos();
}

const logs = ref([
  {
    tanggal: "2025-01-02 08:30",
    aktivitas: "Sistem menyala",
    status: "Normal",
  },
  {
    tanggal: "2025-01-02 09:15",
    aktivitas: "Login pengguna",
    status: "Sukses",
  },
  { tanggal: "2025-01-02 10:02", aktivitas: "Printer error", status: "Error" },
  {
    tanggal: "2025-01-02 11:20",
    aktivitas: "CCTV terhubung",
    status: "Normal",
  },
  {
    tanggal: "2025-01-02 12:44",
    aktivitas: "Perubahan jaringan",
    status: "Warning",
  },
]);

const statusSeverity = {
  Normal: "success",
  Sukses: "info",
  Warning: "warn",
  Error: "danger",
};

const activeMenus = ref({
  Jaringan: false,
  Printer: false,
  Komputer: false,
  Kamera: false,
  Lampu: false,
  USB: false,
});

const allMenuItems = [
  { label: "Jaringan", icon: "pi-wifi" },
  { label: "Printer", icon: "pi-print" },
  { label: "Komputer", icon: "pi-desktop" },
  { label: "Kamera", icon: "pi-camera" },
  { label: "Lampu", icon: "pi-lightbulb" },
  { label: "USB", icon: "pi-eject" },
];

onMounted(async () => {
  await loadSettings();
  loadVideos();

  fetchPrinterStatus();
  setInterval(fetchPrinterStatus, 2000);
});

watch(showFullscreen, (val) => {
  if (val === false) {
    cleanupWebRTC();
  }
});
</script>

<style>
.fullscreen-video-dialog .p-dialog-content {
  padding: 0 !important;
}
</style>

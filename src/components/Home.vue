<template>
  <div class="min-h-screen bg-[#003A70] text-white flex flex-col">
    <!-- HEADER -->
    <header
      class="px-6 py-5 flex items-center justify-between backdrop-blur-md bg-white/5 border-b border-white/10"
    >
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
              activeMenu === i.label
                ? 'bg-primary-50 border border-primary-300 scale-[1.03]'
                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:shadow',
            ]"
          >
            <i
              :class="[
                'pi text-2xl',
                i.icon,
                activeMenu === i.label ? 'text-primary-700' : 'text-gray-500',
              ]"
            />
            <span
              :class="[
                'text-xs mt-2 font-semibold',
                activeMenu === i.label ? 'text-primary-800' : 'text-gray-700',
              ]"
            >
              {{ i.label }}
            </span>
          </div>
        </div>

        <!-- CONTROL LAMPU -->
        <div
          v-if="activeMenu === 'Lampu'"
          class="mt-6 p-6 bg-gray-100 rounded-xl shadow-sm border"
        >
          <h3 class="font-semibold text-lg mb-4">Kontrol Lampu</h3>

          <Button
            :label="lampOn ? 'Matikan Lampu' : 'Hidupkan Lampu'"
            :severity="lampOn ? 'danger' : 'success'"
            icon="pi pi-lightbulb"
            class="w-full py-3 text-base rounded-lg"
            @click="toggleLamp"
          />

          <p class="mt-3 text-sm text-gray-700">
            Status: <strong>{{ lampOn ? "ON" : "OFF" }}</strong>
          </p>
        </div>

        <!-- CARD OMSET -->
        <div
          class="mt-6 p-5 rounded-xl bg-gray-50 border border-gray-200 shadow-sm flex justify-between items-center gap-5"
        >
          <div>
            <p class="text-gray-600 text-sm">Omset</p>
            <p class="font-bold text-2xl mt-1">Rp 100.000.000</p>
          </div>
          <video
            ref="monitorVideo"
            autoplay
            playsinline
            muted
            class="aspect-video h-20 md:h-24 object-contain rounded-lg bg-black cursor-pointer transition"
            :class="{ 'opacity-50': !hasStream }"
            @click="openFullscreen"
          ></video>
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
            <div class="p-4 bg-white rounded-xl shadow border">
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
            <div class="p-4 bg-white rounded-xl shadow border">
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
          <div class="p-5 bg-white rounded-2xl shadow border">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-2">
                <i class="pi pi-video text-primary-700 text-xl"></i>
                <p class="text-lg font-semibold">Manajemen Video</p>
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

            <!-- PREVIEW -->
            <div v-if="previewUpload.length" class="mt-5">
              <div class="flex items-center justify-between mb-2">
                <p class="font-semibold">Preview Sebelum Upload</p>
                <Button label="Upload" size="small" @click="uploadVideos" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  v-for="vid in previewUpload"
                  :key="vid.url"
                  class="bg-white border rounded-xl shadow-sm p-3"
                >
                  <p class="text-xs font-medium truncate">{{ vid.name }}</p>

                  <video
                    :src="'http://localhost:8000/videos/' + vid"
                    controls
                    class="rounded-lg w-full aspect-video mt-2 bg-black"
                  />
                </div>
              </div>
            </div>

            <!-- VIDEO LIST -->
            <div class="mt-8">
              <p class="font-semibold mb-3">Daftar Video</p>

              <div
                v-if="videoList.length"
                class="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div
                  v-for="vid in videoList"
                  :key="vid"
                  class="bg-gray-50 rounded-xl shadow-sm border p-4 flex gap-3"
                >
                  <Checkbox
                    v-model="selectedToDelete"
                    :inputId="'vid-' + vid"
                    :value="vid"
                  />

                  <label :for="'vid-' + vid" class="flex-1 cursor-pointer">
                    <p class="text-xs font-medium truncate">{{ vid }}</p>

                    <div class="mt-2 bg-black rounded-lg overflow-hidden">
                      <video
                        :src="'http://localhost:8000/videos/' + vid"
                        controls
                        class="w-full aspect-video"
                      ></video>
                    </div>
                  </label>
                </div>
              </div>

              <p v-else class="text-gray-500 text-sm text-center py-4">
                Belum ada video yang diupload.
              </p>

              <Button
                v-if="selectedToDelete.length"
                label="Hapus Video Terpilih"
                severity="danger"
                class="w-full mt-4"
                icon="pi pi-trash"
                size="small"
                @click="deleteSelectedVideos"
              />
            </div>
          </div>

          <Button
            label="Refresh Daftar Video"
            class="w-full"
            icon="pi pi-refresh"
            size="small"
            outlined
            @click="loadVideos"
          />
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import mqtt from "mqtt";

const API_URL = import.meta.env.VITE_API_URL;
const SIGNALING_URL = import.meta.env.VITE_SIGNALING_URL;

const hasStream = ref(false);

const showSettings = ref(false);
const monitorVideo = ref(null);

const lampOn = ref(false);

// Setting states
const delay = ref(5);
const minFace = ref(120);

const uploadRef = ref(null);
const videoList = ref([]);
const selectedToDelete = ref([]);
const previewUpload = ref([]);

const showFullscreen = ref(false);
const fullscreenVideo = ref(null);

const client = mqtt.connect(import.meta.env.VITE_MQTT_URL, {
  username: import.meta.env.VITE_MQTT_USERNAME,
  password: import.meta.env.VITE_MQTT_PASSWORD,
});

client.on("connect", () => {
  console.log("MQTT Connected");

  // subscribe jika Anda ingin mendapat feedback
  client.subscribe("ptb/kontrol");
});

function toggleLamp() {
  lampOn.value = !lampOn.value;

  const cmd = lampOn.value ? "lampu on" : "lampu off";

  client.publish("ptb/kontrol", cmd);

  console.log("MQTT send:", cmd);
}

function openFullscreen() {
  if (!monitorVideo.value?.srcObject) return;
  showFullscreen.value = true;

  // Copy stream ke video fullscreen
  setTimeout(() => {
    fullscreenVideo.value.srcObject = monitorVideo.value.srcObject;
  }, 50);
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
    console.warn("[WEB] Signaling closed, retrying...");
    setTimeout(initWebRTC, 1500);
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
    hasStream.value = true;
    console.log("[WEB] TRACK RECEIVED");
    monitorVideo.value.srcObject = event.streams[0];
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
  const res = await axios.get(API_URL + "/get-settings");
  delay.value = res.data.delay;
  minFace.value = res.data.min_face;
}

// LOAD VIDEO LIST
async function loadVideos() {
  const res = await axios.get(API_URL + "/list-video");
  videoList.value = res.data.videos;
}

// UPDATE DELAY
async function updateDelay() {
  await axios.post(API_URL + "/set-delay?seconds=" + delay.value);
  await loadSettings();
  alert("Delay berhasil diupdate!");
}

// UPDATE MIN FACE SIZE
async function updateMinFace() {
  await axios.post(API_URL + "/set-min-face-size?size=" + minFace.value);
  await loadSettings();
  alert("Minimal face size berhasil diupdate!");
}

// UPLOAD VIDEO MULTIPLE
async function uploadVideos() {
  const files = uploadRef.value.files;
  if (!files.length) return alert("Pilih file terlebih dahulu!");

  const form = new FormData();
  for (const f of files) form.append("files", f);

  await axios.post(API_URL + "/upload-video", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  alert("Upload berhasil!");

  previewUpload.value = [];
  uploadRef.value.value = "";

  loadVideos();
}

// DELETE VIDEO
async function deleteSelectedVideos() {
  if (!selectedToDelete.value.length) return;

  for (const vid of selectedToDelete.value) {
    await axios.post(API_URL + "/delete-video?filename=" + vid);
  }

  alert("Video terpilih berhasil dihapus!");
  selectedToDelete.value = [];
  loadVideos();
}

async function deleteAllVideos() {
  if (!confirm("Yakin hapus semua video?")) return;

  for (const vid of videoList.value) {
    await axios.post(API_URL + "/delete-video?filename=" + vid);
  }

  alert("Semua video berhasil dihapus!");
  selectedToDelete.value = [];
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

const activeMenu = ref("Jaringan"); // default menu pertama

const allMenuItems = [
  { label: "Jaringan", icon: "pi-wifi" },
  { label: "Printer", icon: "pi-print" },
  { label: "Komputer", icon: "pi-desktop" },
  { label: "Kamera", icon: "pi-camera" },
  { label: "Lampu", icon: "pi-lightbulb" },
];

function setActiveMenu(label) {
  activeMenu.value = label;
}

onMounted(async () => {
  await loadSettings();
  loadVideos();
  initWebRTC();
});
</script>

<style>
.fullscreen-video-dialog .p-dialog-content {
  padding: 0 !important;
}
</style>

<template>
  <div class="min-h-screen bg-[#003A70] text-white flex flex-col">
    <!-- HEADER -->
    <header class="px-5 py-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
        >
          <span class="font-semibold text-sm">HS</span>
        </div>
        <p class="text-lg font-semibold">HERY SUSILO</p>
      </div>

      <div class="flex items-center gap-1.5">
        <Button
          variant="text"
          icon="pi pi-bell"
          class="text-primary-200 hover:text-primary active:text-primary"
        />
        <Button
          variant="text"
          icon="pi pi-refresh"
          class="text-primary-200 hover:text-primary active:text-primary"
        />
      </div>
    </header>

    <!-- CONTENT -->
    <main class="bg-white rounded-t-3xl p-5 text-black flex-1">
      <!-- TITLE -->
      <section>
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold tracking-tight">Jatim Park 3</h2>
          <Button
            variant="text"
            icon="pi pi-sliders-h"
            label="Settings"
            class="text-gray-700"
            @click="showSettings = true"
          />
        </div>

        <!-- GRID MENU (RESPONSIVE) -->
        <div class="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
          <!-- MENU ITEM SEMUA (TERMASUK JARINGAN) -->
          <div
            v-for="i in allMenuItems"
            :key="i.label"
            @click="setActiveMenu(i.label)"
            :class="[
              'flex flex-col items-center p-4 rounded-xl cursor-pointer transition',
              activeMenu === i.label
                ? 'bg-primary-100 border border-primary-300 shadow scale-105'
                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:scale-[1.02]',
            ]"
          >
            <i
              :class="[
                'pi',
                i.icon,
                'text-2xl',
                activeMenu === i.label ? 'text-primary-700' : 'text-gray-500',
              ]"
            ></i>
            <span
              :class="[
                'text-xs mt-1 font-semibold',
                activeMenu === i.label ? 'text-primary-800' : 'text-gray-700',
              ]"
            >
              {{ i.label }}
            </span>
          </div>
        </div>

        <!-- CARD OMSET -->
        <div
          class="p-5 rounded-xl bg-gray-50 shadow-sm flex justify-between items-center"
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
            class="h-18 md:h-24 object-cover rounded-lg bg-black cursor-pointer"
            style="image-rendering: pixelated; image-rendering: crisp-edges"
            @click="openFullscreen"
          ></video>
        </div>
      </section>

      <!-- DATA LOG TABLE -->
      <section class="mt-8">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-xl font-bold">Data Log</h2>
        </div>

        <DataTable
          :value="logs"
          removableSort
          stripedRows
          showGridlines
          class="rounded-xl overflow-hidden shadow text-sm"
          tableStyle="min-width: 100%"
        >
          <Column field="tanggal" header="Tanggal & Jam" sortable></Column>
          <Column field="aktivitas" header="Aktivitas" sortable></Column>

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

      <!-- SETTINGS MODAL -->
      <Dialog
        v-model:visible="showSettings"
        modal
        header="Pengaturan Sistem"
        :style="{ width: '1000px', maxWidth: '90%' }"
        class="text-sm"
      >
        <div class="flex flex-col gap-6">
          <!-- GRID 2 KOLOM -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- SET DELAY -->
            <div
              class="p-4 bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div class="flex items-center gap-2 mb-2">
                <i class="pi pi-clock text-primary-600"></i>
                <p class="font-semibold text-gray-700">Delay Deteksi</p>
              </div>

              <div class="flex items-center gap-2">
                <InputNumber
                  v-model="delay"
                  :min="0"
                  class="flex-1"
                  inputClass="w-full"
                />
                <span class="text-gray-500 text-sm whitespace-nowrap"
                  >detik</span
                >
              </div>

              <Button
                label="Simpan"
                size="small"
                class="w-full mt-3"
                @click="updateDelay"
              />
            </div>

            <!-- MIN FACE SIZE -->
            <div
              class="p-4 bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div class="flex items-center gap-2 mb-2">
                <i class="pi pi-user text-primary-600"></i>
                <p class="font-semibold text-gray-700">Minimum Face Size</p>
              </div>

              <div class="flex items-center gap-2">
                <InputNumber
                  v-model="minFace"
                  :min="20"
                  class="flex-1"
                  inputClass="w-full"
                />
                <span class="text-gray-500 text-sm whitespace-nowrap">px</span>
              </div>

              <Button
                label="Simpan"
                size="small"
                class="w-full mt-3"
                @click="updateMinFace"
              />
            </div>
          </div>

          <!-- VIDEO MANAGEMENT (UPLOAD + LIST + MULTI DELETE) -->
          <div
            class="p-5 bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <!-- HEADER -->
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-2">
                <i class="pi pi-video text-primary-600 text-xl"></i>
                <p class="text-lg font-semibold text-gray-800">
                  Manajemen Video
                </p>
              </div>

              <Button
                label="Hapus Semua"
                size="small"
                severity="danger"
                outlined
                icon="pi pi-trash"
                class="!py-2 !px-3"
                @click="deleteAllVideos"
              />
            </div>

            <!-- UPLOAD BOX -->
            <div
              class="rounded-xl border border-gray-300 border-dashed p-6 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
              @click="uploadRef.click()"
            >
              <i class="pi pi-upload text-3xl text-gray-500"></i>
              <p class="mt-2 text-sm text-gray-700 font-medium">
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

            <!-- PREVIEW BEFORE UPLOAD -->
            <div v-if="previewUpload.length" class="mt-5">
              <div class="flex items-center justify-between mb-2">
                <p class="text-gray-800 font-semibold">
                  Preview Sebelum Upload
                </p>
                <Button
                  label="Upload"
                  size="small"
                  class="!py-1 !px-4"
                  @click="uploadVideos"
                />
              </div>

              <!-- Grid Preview -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  v-for="vid in previewUpload"
                  :key="vid.url"
                  class="bg-white border border-gray-200 rounded-xl shadow-sm p-3"
                >
                  <p class="text-xs font-medium text-gray-700 truncate mb-2">
                    {{ vid.name }}
                  </p>
                  <video
                    :src="'http://localhost:8000/videos/' + vid"
                    controls
                    class="rounded-lg w-full aspect-video object-contain mt-2 shadow-sm bg-black"
                  />
                </div>
              </div>
            </div>

            <!-- LIST + MULTI DELETE -->
            <div class="mt-8">
              <p class="text-gray-800 font-semibold mb-3">Daftar Video</p>

              <div
                v-if="videoList.length"
                class="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <!-- CARD VIDEO -->
                <div
                  v-for="vid in videoList"
                  :key="vid"
                  class="bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-4 flex gap-3"
                >
                  <!-- PRIMEVUE CHECKBOX -->
                  <div class="flex items-start pt-1">
                    <Checkbox
                      v-model="selectedToDelete"
                      :inputId="'vid-' + vid"
                      :value="vid"
                    />
                  </div>

                  <!-- Content -->
                  <label
                    :for="'vid-' + vid"
                    class="flex-1 flex flex-col cursor-pointer"
                  >
                    <p class="text-xs font-medium text-gray-800 truncate">
                      {{ vid }}
                    </p>

                    <div class="mt-2 bg-black rounded-lg overflow-hidden">
                      <video
                        :src="'http://localhost:8000/videos/' + vid"
                        controls
                        class="w-full aspect-video object-contain"
                      ></video>
                    </div>
                  </label>
                </div>
              </div>

              <!-- EMPTY STATE -->
              <p v-else class="text-gray-500 text-sm text-center py-4">
                Belum ada video yang diupload.
              </p>

              <!-- MULTI DELETE BUTTON -->
              <Button
                v-if="selectedToDelete.length"
                label="Hapus Video Terpilih"
                severity="danger"
                class="w-full mt-5"
                icon="pi pi-trash"
                size="small"
                @click="deleteSelectedVideos"
              />
            </div>
          </div>

          <!-- REFRESH -->
          <Button
            label="Refresh Daftar Video"
            class="w-full mt-1"
            icon="pi pi-refresh"
            size="small"
            outlined
            @click="loadVideos"
          />
        </div>
      </Dialog>

      <!-- FULLSCREEN VIDEO MODAL -->
      <Dialog
        v-model:visible="showFullscreen"
        modal
        :closable="true"
        :style="{ width: '100vw', maxWidth: '100%', height: '100vh' }"
        contentStyle="padding:0; height:100vh;"
        class="fullscreen-video-dialog"
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

const API_URL = import.meta.env.VITE_API_URL;
const SIGNALING_URL = import.meta.env.VITE_SIGNALING_URL;

const showSettings = ref(false);
const monitorVideo = ref(null);

// Setting states
const delay = ref(5);
const minFace = ref(120);

const uploadRef = ref(null);
const videoList = ref([]);
const selectedToDelete = ref([]);
const previewUpload = ref([]);

const showFullscreen = ref(false);
const fullscreenVideo = ref(null);

function openFullscreen() {
  if (!monitorVideo.value?.srcObject) return;
  showFullscreen.value = true;

  // Copy stream ke video fullscreen
  setTimeout(() => {
    fullscreenVideo.value.srcObject = monitorVideo.value.srcObject;
  }, 50);
}

async function initWebRTC() {
  const clientId = Math.random().toString(36).substring(2);
  console.log("[WEB] Initializing WebRTC...");

  const signaling = new WebSocket(SIGNALING_URL);
  signaling.binaryType = "blob";

  signaling.onopen = () => {
    console.log("[WEB] Connected to signaling server");
    signaling.send(JSON.stringify({ type: "ready", client_id: clientId }));
  };

  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  // Force high quality video
  pc.addEventListener("negotiationneeded", async () => {
    const params = pc.getSenders()[0].getParameters();
    if (!params.encodings) params.encodings = [{}];

    // Set high bitrate
    params.encodings[0].maxBitrate = 5_000_000; // 5 Mbps HD
    params.encodings[0].minBitrate = 2_000_000;
    params.encodings[0].maxFramerate = 30;
    params.encodings[0].scaleResolutionDownBy = 1; // do NOT reduce quality

    await pc.getSenders()[0].setParameters(params);
  });

  pc.oniceconnectionstatechange = () =>
    console.log("[WEB] ICE state:", pc.iceConnectionState);

  pc.onconnectionstatechange = () =>
    console.log("[WEB] Conn state:", pc.connectionState);

  pc.ontrack = (event) => {
    console.log("[WEB] TRACK RECEIVED:", event);
    monitorVideo.value.srcObject = event.streams[0];
  };

  signaling.onmessage = async (msg) => {
    console.log("[WEB] Raw message:", msg.data);

    let payload = msg.data;

    if (payload instanceof Blob) {
      console.log("[WEB] Converting Blob → text...");
      payload = await payload.text();
    }

    console.log("[WEB] Parsed text:", payload);

    let data;
    try {
      data = JSON.parse(payload);
    } catch (e) {
      console.error("[WEB] JSON PARSE ERROR:", e, payload);
      return;
    }

    console.log("[WEB] Parsed JSON:", data);

    if (data.type === "offer") {
      console.log("[WEB] OFFER received!");

      await pc.setRemoteDescription({
        type: "offer",
        sdp: data.sdp,
      });

      console.log("[WEB] Remote SDP set");

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      console.log("[WEB] Sending ANSWER...");

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
      console.log("[WEB] Remote CANDIDATE:", data);

      await pc.addIceCandidate({
        candidate: data.candidate,
        sdpMid: data.sdpMid,
        sdpMLineIndex: data.sdpMLineIndex,
      });
    }
  };

  pc.onicecandidate = (event) => {
    console.log("[WEB] Browser ICE Candidate:", event.candidate);

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

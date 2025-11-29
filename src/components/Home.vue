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
          class="text-white hover:text-primary"
        />
        <Button
          variant="text"
          icon="pi pi-refresh"
          class="text-white hover:text-primary"
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
          <img src="/monitor.png" class="h-24 object-cover rounded-lg" />
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
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

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
</script>

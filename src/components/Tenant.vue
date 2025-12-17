<template>
  <div class="min-h-screen bg-[#003A70] flex flex-col">
    <!-- HEADER -->
    <header class="px-6 py-5 flex items-center justify-between text-white">
      <div class="flex items-center gap-3">
        <div
          class="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center"
        >
          <span class="font-semibold text-sm">TM</span>
        </div>
        <p class="text-lg font-semibold tracking-wide">Tenant Management</p>
      </div>

      <Button icon="pi pi-plus" label="Tambah" size="small" @click="openNew" />
    </header>

    <!-- CONTENT -->
    <main class="bg-white rounded-t-3xl px-5 py-6 text-gray-800 flex-1">
      <!-- TITLE -->
      <section class="mb-5">
        <h2 class="text-xl font-bold text-gray-900">Daftar Tenant</h2>
        <p class="text-sm text-gray-500">Kelola tenant dan konfigurasi MQTT</p>
      </section>

      <!-- SEARCH -->
      <div class="mb-4">
        <span class="p-input-icon-left w-full sm:w-72">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="globalFilter"
              placeholder="Cari tenant..."
              class="w-full rounded-full"
            />
          </IconField>
        </span>
      </div>

      <!-- TABLE CARD -->
      <div
        class="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
      >
        <DataTable
          :value="tenants"
          dataKey="_id"
          stripedRows
          removableSort
          responsiveLayout="scroll"
          :paginator="true"
          :rows="8"
          :filters="{ global: { value: globalFilter, matchMode: 'contains' } }"
          :globalFilterFields="['name', 'mqttId', 'serverUrl']"
          class="text-sm"
        >
          <Column field="name" header="Tenant" sortable />
          <Column field="mqttId" header="MQTT ID" sortable />
          <Column field="macAddress" header="MAC Address" sortable>
            <template #body="{ data }">
              <span class="text-xs font-mono">
                {{ data.macAddress || "-" }}
              </span>
            </template>
          </Column>
          <Column field="serverUrl" header="Server" />

          <Column header="Aksi" bodyClass="text-right">
            <template #body="{ data }">
              <div class="flex justify-end gap-1">
                <Button
                  icon="pi pi-pencil"
                  size="small"
                  class="p-button-text"
                  @click="editTenant(data)"
                />
                <Button
                  icon="pi pi-trash"
                  size="small"
                  class="p-button-text p-button-danger"
                  @click="deleteTenant(data._id)"
                />
              </div>
            </template>
          </Column>

          <Column field="createdAt" header="Dibuat" sortable>
            <template #body="{ data }">
              <div class="text-xs text-gray-500 leading-tight">
                {{ formatDate(data.createdAt) }}
              </div>
            </template>
          </Column>

          <Column field="updatedAt" header="Diupdate" sortable>
            <template #body="{ data }">
              <div class="text-xs text-gray-500 leading-tight">
                {{ formatDate(data.updatedAt) }}
              </div>
            </template>
          </Column>

          <!-- EMPTY -->
          <template #empty>
            <div class="py-10 text-center text-gray-500">
              Belum ada tenant terdaftar
            </div>
          </template>
        </DataTable>
      </div>

      <!-- DIALOG -->
      <Dialog
        v-model:visible="dialogVisible"
        modal
        :closable="false"
        :header="isEdit ? 'Edit Tenant' : 'Tambah Tenant'"
        class="w-full max-w-md"
      >
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700">
              Nama Tenant
            </label>
            <InputText
              v-model="form.name"
              class="w-full mt-1"
              placeholder="Contoh: Jatim Park 3"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700"> MQTT ID </label>
            <InputText
              v-model="form.mqttId"
              class="w-full mt-1"
              placeholder="jtp3-0002"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700">
              MAC Address (PC)
            </label>
            <InputText
              v-model="form.macAddress"
              class="w-full mt-1 font-mono"
              placeholder="AA:BB:CC:DD:EE:FF"
            />
            <p class="text-xs text-gray-400 mt-1">
              Digunakan untuk Wake On LAN
            </p>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700">
              Server URL
            </label>
            <InputText
              v-model="form.serverUrl"
              class="w-full mt-1"
              placeholder="https://jtp3.studio8.my.id"
            />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <Button label="Batal" class="p-button-text" @click="hideDialog" />
            <Button
              label="Simpan"
              class="p-button-primary"
              @click="saveTenant"
            />
          </div>
        </template>
      </Dialog>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from "vue";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_TENANTS_URL;

/* STATE */
const tenants = ref([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const selectedId = ref(null);

const form = ref({
  name: "",
  mqttId: "",
  serverUrl: "",
  macAddress: "",
});

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* FETCH */
const fetchTenants = async () => {
  const res = await axios.get(API_URL);
  tenants.value = res.data;
};

/* CRUD */
const openNew = () => {
  resetForm();
  dialogVisible.value = true;
};

const saveTenant = async () => {
  if (
    !form.value.name ||
    !form.value.mqttId ||
    !form.value.serverUrl ||
    !form.value.macAddress
  ) {
    alert("Semua field wajib diisi");
    return;
  }

  if (isEdit.value) {
    await axios.put(`${API_URL}/${selectedId.value}`, form.value);
  } else {
    await axios.post(API_URL, form.value);
  }

  dialogVisible.value = false;
  fetchTenants();
};

const editTenant = (tenant) => {
  isEdit.value = true;
  selectedId.value = tenant._id;
  form.value = { ...tenant };
  dialogVisible.value = true;
};

const deleteTenant = async (id) => {
  if (!confirm("Yakin ingin menghapus tenant ini?")) return;
  await axios.delete(`${API_URL}/${id}`);
  fetchTenants();
};

const hideDialog = () => {
  dialogVisible.value = false;
};

const resetForm = () => {
  isEdit.value = false;
  selectedId.value = null;
  form.value = {
    name: "",
    mqttId: "",
    serverUrl: "",
    macAddress: "",
  };
};

onMounted(fetchTenants);
</script>

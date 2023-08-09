<template>
  <v-tabs density="compact" v-model="tab" class="b-b">
    <v-tab rounded="0" value="monitor">Monitor</v-tab>
    <v-tab rounded="0" value="channels">Channels</v-tab>
    <v-tab rounded="0" value="server">Server</v-tab>
  </v-tabs>
  <v-window v-model="tab">
    <v-window-item value="monitor">
      <MessageMonitor :remote="config.remote" :local="config.local" :channels="config.channels" />
    </v-window-item>
    <v-window-item value="channels">
      <ChannelList @valueChanged="updateChannelSettings" ref="channelsList" />
    </v-window-item>
    <v-window-item value="server">
      <ServerConfig @valueChanged="updateServerSettings" ref="settings" />
    </v-window-item>
  </v-window>

  {{ config }}

  <v-snackbar v-model="snackbar">
    {{ message }}

    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <div style="position:fixed;bottom:0;width:100%" class="d-flex b-t align-center toolbar">
    <v-btn elevation="0" rounded="0" :disabled="!changes" prepend-icon="mdi-content-save" @click="saveSettings()">Save</v-btn>
    <v-btn elevation="0" rounded="0" prepend-icon="mdi-upload" @click="loadSettings()">Load</v-btn>
    <v-btn elevation="0" rounded="0" prepend-icon="mdi-close-box-outline" @click="resetSettings()">Reset</v-btn>
    <small class="ml-2" v-if="changes">Uncommitted changes...</small>
    <v-btn elevation="0" rounded="0" class="ml-auto" @click="closeWindow()">Exit</v-btn>
  </div>
</template>

<script>
import ChannelList from './components/ChannelList.vue'
import MessageMonitor from './components/MessageMonitor.vue'
import ServerConfig from './components/ServerConfig.vue'

export default {
  name: 'App',
  components: {
    ChannelList,
    MessageMonitor,
    ServerConfig
  },
  data: () => ({
    tab: 'monitor',
    snackbar: false,
    message: '',
    changes: false,
    config: {
      channels: [],
      remote: {
        type: 'http',
        address: 'https://rl-ingestion-server.laval.fi/read',
        port: '80',
        pollingInterval: '5000'
      },
      local: {
        address: '',
        port: '',
        basePath: ''
      }
    }
  }),
  async created() {
  },
  methods: {
    closeWindow() {
      window.close()
    },
    updateChannelSettings(channels) {
      console.log(channels);
      this.config.channels = [].concat(channels);
      this.changes = true;
    },
    updateServerSettings(settings) {
      console.log(settings);
      this.config.remote = settings.remote;
      this.config.local = settings.local;
      this.changes = true;
    },
    async saveSettings() {
      window.ipcAPI.saveSettings(JSON.stringify(this.config));
      this.message = 'Settings saved';
      this.snackbar = true;
      this.changes = false;
    },
    async loadSettings() {
      this.config = JSON.parse(await window.ipcAPI.loadSettings());
      this.$refs.channelsList.channels = this.config.channels;
      this.$refs.settings.remote = this.config.remote;
      this.$refs.settings.local = this.config.local;
      this.message = 'Settings loaded';
      this.snackbar = true;
      this.changes = false;
    },
    async resetSettings() {
      // await window.ipcAPI.resetSettings()
      this.message = 'Settings reset';
      this.snackbar = true;
    }
  }
}
</script>

<style>
.b-t {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}
.b-b {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
.toolbar {
  background-color: #1e1e1e;
}
</style>

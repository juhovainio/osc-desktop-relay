<template>
  <!-- <h2 class="text-subtitle-1">Configure channels</h2> -->
  <v-table density="compact">
    <thead>
      <tr>
        <!-- <th class="text-left">Enabled</th> -->
        <th class="text-left">Input channel (server variable)</th>
        <th class="text-left">Output channel (local OSC path)</th>
        <th class="text-left">Interpolate</th>
        <th class="text-left">Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="channel in channels" :key="channel.id">
        <!-- <td><v-checkbox v-model="channel.enabled" class="ma-0"></v-checkbox></td> -->
        <td class="pt-2 pb-2"><v-text-field rounded="0" v-model="channel.input" placeholder="Input" hide-details
            variant="outlined" density="compact"></v-text-field></td>
        <td><v-text-field rounded="0" v-model="channel.channel" placeholder="Channel" hide-details variant="outlined"
            density="compact"></v-text-field></td>
        <td><v-checkbox density="compact"></v-checkbox></td>
        <td>
          <v-btn icon="mdi-minus" @click="removeChannel(channel)" density="compact" elevation="0"></v-btn>
          <v-btn icon="mdi-plus" @click="addChannel()" density="compact" elevation="0"></v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
<script>
import { isProxy, toRaw } from 'vue';

export default {
  name: 'ChannelList',
  emits: ['valueChanged'],
  data: () => ({
    channels: [
      {
        id: 1,
        input: '1',
        channel: '0',
        interpolate: false
      },
      {
        id: 2,
        input: '2',
        channel: '1',
        interpolate: false
      },
      {
        id: 2,
        input: '3',
        channel: '2',
        interpolate: false
      }
    ]
  }),
  watch: {
    channels: {
      handler(oldValue, newValue) {
        if (isProxy(newValue)) {
          console.log("Channels:OUT:Proxy:: ", newValue);
          this.$emit('valueChanged', toRaw(newValue));
        } else {
          console.log("Channels:OUT:Non-proxy:: ", newValue);
          this.$emit('valueChanged', newValue);
        }
      },
      deep: true,
    }
  },
  methods: {
    addChannel() {
      this.channels.push({
        id: this.channels.length + 1,
        input: '',
        channel: ''
      })
    },
    removeChannel(channel) {
      this.channels.splice(this.channels.indexOf(channel), 1)
    }
  }
}
</script>
<style scoped></style>
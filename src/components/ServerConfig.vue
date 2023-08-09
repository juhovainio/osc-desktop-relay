<template>
    <h2 class="text-subtitle-1">Remote server</h2>
    <v-btn-toggle v-model="remote.type" rounded="0" group density="compact">
        <v-btn value="http">
            HTTP polling
        </v-btn>
        <v-btn value="ws">
            WebSocket
        </v-btn>
    </v-btn-toggle>
    <v-text-field rounded="0" v-model="remote.address" placeholder="Server address" hide-details variant="outlined"
        density="compact"></v-text-field>
    <v-text-field rounded="0" v-if="remote.type=='http'" v-model="remote.pollingInterval" placeholder="Polling interval (ms)" hide-details variant="outlined" density="compact"></v-text-field>

    <h2 class="text-subtitle-1 mt-2">Local OSC server</h2>
    <v-text-field rounded="0" placeholder="IP" v-model="local.address" hide-details variant="outlined" density="compact"></v-text-field>
    <v-text-field rounded="0" placeholder="Port" v-model="local.port" hide-details variant="outlined" density="compact"></v-text-field>
    <v-text-field rounded="0" placeholder="Base path" v-model="local.basePath" hide-details variant="outlined" density="compact"></v-text-field>
    <pre>{{ remote }}
    {{ local }}</pre>
</template>
<script>
import { isProxy, toRaw } from 'vue';
export default {
    name: 'ServerConfig',
    emits: ['valueChanged'],
    data: () => ({
        remote: {
            type: 'http',
            address: 'https://rl-ingestion-server.laval.fi/read',
            port: 80,
            pollingInterval: '5000'
        },
        local: {
            address: '0.0.0.0',
            port: '9001',
            basePath: '/lj/osc'
        }
    }),
    watch: {
        remote: {
            handler(oldValue, newValue) {
                if (isProxy(newValue)) {
                    this.$emit('valueChanged', {remote: toRaw(newValue), local: toRaw(this.local)});
                }
            },
            deep: true
        },
        local: {
            handler(oldValue, newValue) {
                if (isProxy(newValue)) {
                    this.$emit('valueChanged', {remote: toRaw(this.remote), local: toRaw(newValue)});
                }
            },
            deep: true
        }
    },
    methods: {

    }
}
</script>
<style scoped></style>
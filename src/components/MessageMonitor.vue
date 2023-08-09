<template>
    <div class="b-b">
        Remote server:
        <span class="text-red" v-if="!remoteConnected" @click="connectRemote()">Disconnected</span>
        <span class="text-green" v-if="remoteConnected">Connected</span> |
        Local server:
        <span class="text-red" v-if="!localConnected">Disconnected</span>
        <span class="text-green" v-if="localConnected">Connected</span> |
        <v-btn @click="connectRemote()" v-if="!remoteConnected">Connect</v-btn>
        <v-btn @click="disconnectRemote()" v-if="remoteConnected">Disconnect</v-btn>
        <v-btn @click="logs = []">Clear</v-btn>
        <v-checkbox-btn v-model="loggingEnabled" density="compact" label="Enable logging"></v-checkbox-btn>
    </div>
    <div class="console">
        <div v-for="row of logs" :key="row">
            {{ row.time }} [{{ row.dir }}] {{ row.msg }}
        </div>
    </div>
</template>
<script>

export default {
    name: 'MessageMonitor',
    props: {
        channels: Array,
        remote: Object,
        local: Object
    },
    data: () => ({
        remoteConnected: false,
        localConnected: false,
        logs: [
            { time: Date.now(), dir: 'IN', msg: 'Message monitor test' },
            { time: Date.now(), dir: 'OUT', msg: 'Message monitor test' }
        ],
        loggingEnabled: true,
        timeout: null
    }),
    watch: {
        remote: {
            handler() {
                this.connectRemote();
            },
            deep: true
        },
        local: {
            handler() {
                
            },
            deep: true
        }
    },
    methods: {
        async connectRemote(){
            const url = `${this.remote.address}`;
            await window.ipcAPI.fetchData(url)
                .then((data) => {
                    if(this.loggingEnabled) this.logs.push({ time: Date.now(), dir: 'IN - Remote', msg: 'Data received' });
                    this.remoteConnected = true;
                    this.channels.forEach(channel => {
                        let channelValue = JSON.parse(data);
                        channel.input.split('.').forEach(segment => {
                            channelValue = channelValue[segment]
                        });
                        if(this.loggingEnabled) this.logs.push({ time: Date.now(), dir: 'OUT - Local', msg: `Sending data to channel ${channel.channel}: ${channelValue}` });
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
            // Check delay and reconnect
            this.timeout = setTimeout(() => {
                this.connectRemote();
            }, this.remote.pollingInterval);
        },
        disconnectRemote(){
            clearTimeout(this.timeout);
            this.remoteConnected = false;
            if(this.loggingEnabled) this.logs.push({ time: Date.now(), dir: 'IN', msg: 'Disconnected from remote' });
        },
        connectLocal(){},
    }
}
</script>
<style scoped>
    .console{
        background-color: #000;
        color: #fff;
        height: 100%;
        width: 100%;
        overflow: auto;
        padding: 1rem;
        font-family: monospace;
    }
</style>
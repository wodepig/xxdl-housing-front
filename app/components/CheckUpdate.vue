<template>
    <UChip :show="updateInfo.newVersion ? true : false"  size="3xl">


        <!-- <n-button :loading="updateInfo.loading" variant="ghost" @click="checkUpdate">
                    <div :class="updateInfo.class"></div>
                    {{ updateInfo.text }}
                </n-button> -->
        <UPopover mode="hover">
            <UButton :color="updateInfo.newVersion ? 'success' : 'neutral'" loading-auto @click="checkUpdate(true)">{{ updateInfo.text }}</UButton>


            <!-- <template #header>
            {{ updateInfo.nowVersion }}
        </template> -->
            <template #content>
                <div class="flex flex-col p-2">
                    <span>{{ updateInfo.desc }}</span>
                    <span>架构: {{ updateInfo.system }}--{{ updateInfo.arch }}</span>

                </div>

            </template>

            <template #footer>

            </template>
        </UPopover>

    </UChip>
    <!-- 更新弹窗 -->
    <UModal v-model:open="showModal" :close="!updateInfo.force" :dismissible="!updateInfo.force"
        :title="`新版本: ${updateInfo.newVersion}`">
        <template #body>
            <div v-show="updateInfo.force" class="text-red-500 font-800">

                强制更新, 不可取消.
            </div>
            <div style="white-space: pre-wrap;">
                {{ updateInfo.notes }}
            </div>
            <!-- <div v-html="updateInfo.notes"/> -->
            <!-- <div v-html="'<p>HTML 内容</p><h2>222</h2>'"/> -->
        </template>
        <template #footer>
            <div class="flex flex-col w-full">
                <div class="flex flex-row-reverse">
                    <div class="flex gap-x-1">
                        <UButton v-if="!updateInfo.force" @click="skipUpdate">跳过</UButton>
                        <UButton loading-auto @click="submitCallback">更新并重启</UButton>

                    </div>

                </div>
                <div v-show="updateLoading" class="flex pt-1">
                    <UProgress v-model="percentage" />
                    <!-- <n-progress type="line" :height="4" :border-radius="3" :percentage="percentage" :show-indicator="false"
                        processing /> -->
                </div>

                <div>

                </div>
            </div>


        </template>
    </UModal>

</template>

<script lang="ts" setup>
import { UButton } from '#components';
import { Update } from '@tauri-apps/plugin-updater'

const percentage = ref(0)
const toast = useToast()
// const updatePojo = ref<Update>();
let updatePojo: Update | null = null;
const notesRef = ref(null)
const updateInfo = ref({
    loading: false,
    class: 'i-lucide:badge-check w-5 h-5',
    text: '检查更新',
    desc: '点击检查更新',
    // 版本更新说明
    notes: '',
    system: '',
    force: false,
    nowVersion: '',
    newVersion: '',
    arch: ''
})
const showModal = ref(false)
const updateLoading = ref(false)
const downAndInstall = async () => {
    // const check = await import('@tauri-apps/plugin-updater');
    // const update = await check.check()
    if (!updatePojo) {
        toast.add({ title: '未发现新版本' })
        return
    }
    const update = updatePojo as Update

    let downloaded = 0;
    let contentLength = 0;
    // update.download()
    await update.downloadAndInstall(async (event) => {
        // await update.download(async(event)=>{
        switch (event.event) {
            case 'Started':
                contentLength = event.data.contentLength as number;
                // console.log(`started downloading ${contentLength} bytes`);
                break;
            case 'Progress':
                downloaded += event.data.chunkLength;
                percentage.value = Math.round((downloaded / contentLength) * 100);
                // console.log(`downloaded ${downloaded} from ${contentLength}`);
                //    console.log(percentage.value);
                break;
            case 'Finished':
                // return
                // console.log('download finished');
                break;
        }

    })
    const { relaunch } = await import('@tauri-apps/plugin-process');
    // await relaunch();
}

const isTauriTarget = () => {
    // @ts-ignore
    return typeof window !== 'undefined' && window.isTauri !== undefined
}

const submitCallback = async () => {
    // 清理缓存
    // useLStorage.removeSeeting()
    try {
        updateLoading.value = true
        await downAndInstall()
    } catch (error) {
        updateLoading.value = false
    }

    // updateInfo.value.force = true
}
onMounted(async () => {
    updatePojo = null
    if (isTauriTarget()) {
        //@ts-ignore
        const { app } = await import('@tauri-apps/api');
        const { platform, arch } = await import('@tauri-apps/plugin-os');
        updateInfo.value.system = platform()
        updateInfo.value.arch = arch()
        updateInfo.value.nowVersion = await app.getVersion()
        // useStore.exeVersion.value = updateInfo.value.nowVersion
        checkUpdate(false)
    }
})
const skipUpdate = () => {
    showModal.value = false

    // message.success('Cancel')
}
const checkUpdate = async (show: boolean = true) => {
    updateInfo.value.loading = true
    if (!isTauriTarget()) {
        return
    }
    const check = await import('@tauri-apps/plugin-updater');
    let update = null
    try {
        const config = useRuntimeConfig()
        update = await check.check({
            timeout: 5000,
            headers: {
                'X-AccessKey': config.public.UPGRADE_ACCESS_KEY as string,  // UpgradeLink的AccessKey
            },
        })
        // console.log('update',update);


    } catch (e: any) {
        update = null
    }

    updateInfo.value.loading = false
    if (update) {
        updatePojo = update as Update
        showModal.value = show
        // 根据新版本设置一些值
        updateInfo.value.newVersion = update.version
        updateInfo.value.notes = update.body as string
        updateInfo.value.force = update.rawJson['upgradeType'] === 3
        updateInfo.value.text = '有新版本'
        updateInfo.value.desc = '点击查看新版说明'
        updateInfo.value.class = 'w-5 h-5 i-lucide:arrow-big-up bg-green-400'
        // 强制更新的话必须展示弹窗
        showModal.value = show || updateInfo.value.force
    } else {
        toast.add({ title: '当前已是最新版本' })
    }
    updateInfo.value.loading = false
}
</script>
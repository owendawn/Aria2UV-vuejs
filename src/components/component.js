import Icon from '../../node_modules/vue-awesome/components/Icon.vue'

import nav from "./nav.vue"
import DownloadMenu from "./download-menu.vue"
import ToDownloadGroup from './to-download-group.vue'
import ToDownloadFiles from './to-download-files.vue'
import ToDownload from './to-download.vue'
import UpdownChart from './updown-chart.vue'


export default {
    install:function (Vue) {
        Vue.component("p-nav",nav);
        Vue.component("p-icon",Icon);
        Vue.component("p-download-menu",DownloadMenu);
        Vue.component("p-to-download-group",ToDownloadGroup);
        Vue.component("p-to-download-files",ToDownloadFiles);
        Vue.component("p-to-download",ToDownload);
        Vue.component("p-updown-chart",UpdownChart);
    }
}

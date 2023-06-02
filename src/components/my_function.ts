import {computed} from "vue";
import moment from "moment";

const get_date = computed(() => (time: string) => {
    let date = moment(Date.now()).diff(time, "m")
    if (date < 60) return (date ? date : 1) + '分钟前'
    else if ((date = moment(Date.now()).diff(time, "h")) < 24) return date + '小时前'
    else if ((date = moment(Date.now()).diff(time, "d")) < 30) return date + '天前'
    else return moment(time).format('YYYY-MM-DD')
})

const bytesToSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    var k = 1024, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(4) + ' ' + sizes[i];
}
const gender = computed(() => (gender: number) => {
    switch (gender) {
        case 0:
            return '未知'
        case 1:
            return '男'
        case 2:
            return '女'
    }
})
const status = computed(() => (status: number) => {
    switch (status) {
        case 0:
            return '待审核'
        case 1:
            return '审核通过'
        case 2:
            return '含有敏感字段'
        case 3:
            return '退回'
    }
})

export {
    get_date,
    bytesToSize,
    gender,
    status,
}
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    server: {
        // host: '127.0.0.1',
        host: true,
        proxy: {
            // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
            '/api': {
                target: 'http://127.0.0.1:8000/api',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/static': {
                target: 'http://127.0.0.1:8000/static',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/static/, ''),
            },
            '/media': {
                target: 'http://127.0.0.1:8000/media',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/media/, ''),
            },
        }
    },
    build: {
        outDir: 'dist/', //指定输出路径
        assetsDir: 'static', // 指定生成静态资源的存放路径
    },
})

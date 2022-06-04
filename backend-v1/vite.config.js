import {defineConfig} from 'vite'
import {createStyleImportPlugin} from 'vite-plugin-style-import'
import react from '@vitejs/plugin-react'
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        // 配置别名，@作为src引入
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    server: {
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://10.0.40.200:8979',
                ws: false,
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '')
            }
        }
    },
    plugins: [
        react(),
        createStyleImportPlugin({
            libs: [
                {
                    libraryName: 'antd',
                    esModule: true,
                    resolveStyle: (name) => {
                        return `antd/lib/${name}/style/index.less`
                    }
                }
            ]
        })
    ],
    css: {
        preprocessorOptions: {
            less: {
                modifyVars: {
                    // 更改主题在这里
                    'primary-color': '#52c41a',
                    'link-color': '#1DA57A',
                    'border-radius-base': '2px'
                },
                javascriptEnabled: true
            }
        }
    }
})

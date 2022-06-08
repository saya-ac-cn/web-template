import {defineConfig} from 'vite'
import vitePluginImp from 'vite-plugin-imp'
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
    vitePluginImp({
      libsList: [
        {
          libName: 'antd',
          style: (name) => {
            return `antd/es/${name}/style`
          }
        }
      ]
    })
  ],
  css: {
    // loaderOptions:{
    //   less: {
    //     javascriptEnabled: true,
    //     modifyVars: {
    //       // 更改主题在这里
    //       'primary-color': '#52c41a'
    //     }
    //   }
    // }
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          // 更改主题在这里
          'primary-color': '#52c41a'
        }
      }
    }
  }
})

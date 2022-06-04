import React from 'react'
import ReactDOM from 'react-dom/client'
import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import App from './App'
import './index.css'

/**
 * 入口js
 */
ReactDOM.createRoot(document.getElementById('root')).render(
    <ConfigProvider locale={zhCN}>
        <App/>
    </ConfigProvider>
)

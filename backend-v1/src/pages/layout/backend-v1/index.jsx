import React, {Component} from 'react';
import './light-theme.less'
//import './dark-theme.less'
import {Route,Link,Routes} from 'react-router-dom'
import menuConfig from '@/config/menu-config'
import memoryUtils from "@/utils/memoryUtils";
import storageUtils from '@/utils/storageUtils'
import {isEmptyObject} from "@/utils/var"
import { Button, Input, Menu, Popover, Avatar, Breadcrumb, Badge, Modal} from 'antd';
import {RightOutlined,LeftOutlined,MenuOutlined, HomeOutlined,NotificationOutlined,MessageOutlined, DatabaseOutlined,StockOutlined,FieldTimeOutlined,SearchOutlined,UserOutlined,AccountBookOutlined,ScheduleOutlined,PushpinOutlined,CarryOutOutlined,MoneyCollectOutlined,SwitcherOutlined} from '@ant-design/icons';
import DashBoard from '../../dashboard'
import Financial from '../../financial'
import withRouter from '@/utils/withRouter'
/*
 * 文件名：index.jsx
 * 作者：saya
 * 创建日期：2020/7/15 - 10:20 下午
 * 描述：后台主页
 */

// 定义组件（ES6）
class LayoutBackend extends Component {

    state = {
        // 默认让左侧的菜单关闭
        leftCollapsed: false,
        // 默认让右侧的菜单展开
        rightCollapsed: true,
        // 当前展开的菜单数组
        openKeys: [],
        // 左侧菜单
        menuNodes:[],
        // 当前已经登录的用户信息
        user: {account:"Shmily",user:{logo:'/src/static/user/2020062697574.png',backgroundUrl:'/src/static/img/background_2.jpg'}},
        searchValue: null
    };

    /***
     * 将字符串转换成组件
     * @param value
     * @returns {*}
     */
    transformComponent = (value) => {
        switch(value) {
            case 'DatabaseOutlined': {
                return <DatabaseOutlined/>
            }
            case 'UserOutlined':{
                return <UserOutlined/>
            }
            case 'AccountBookOutlined':{
                return <AccountBookOutlined/>
            }
            case 'ScheduleOutlined':{
                return <ScheduleOutlined/>
            }
            case 'HomeOutlined':{
                return <HomeOutlined/>
            }
            default: {
                return <MessageOutlined/>
            }
        }
    };

    // 左侧切换面板
    handleLeftTabClick = () => {
        const leftCollapsed = !this.state.leftCollapsed;
        // 更新状态
        this.setState({leftCollapsed})
    };

    // 右侧面板切换
    handleRightTabClick = () => {
        const rightCollapsed = !this.state.rightCollapsed;
        // 更新状态
        this.setState({rightCollapsed})
    }

    /**
     * 初始化头像下拉菜单
     */
    initHeaderMenu = (user) => (
        <div className="backend-layout-header-info-hover">
            <div className='user-img-div'>
                <Avatar size={64} icon={<UserOutlined/>} src={(user.user && user.user.logo) ? user.user.logo : '/src/static/user/2020062697574.png'}/>
                <div className='operator-img'>
                    <span>{user.user.user || '用户'}</span>
                    <Button type="link" to='/backstage/set/info'>更换头像</Button>
                </div>
            </div>
            <div className='system-operator'>
                <Button type="link" href='/backstage/set/info'>设置</Button>
                <Button type="link" onClick={this.logout}>退出</Button>
            </div>
        </div>
    )

    /*
     根据menu的数据数组生成对应的标签数组
     使用reduce() + 递归调用
     */
    getMenuNodes = (menuList) => {
        let _this = this;
        // 得到当前请求的路由路径
        const path = _this.props.location.pathname;
        return menuList.reduce((pre, item) => {
            // 向pre添加<Menu.Item>
            if (!item.children && item.hidden === false) {
                if(item.root){
                    // 处理只有根节点，无子节点的菜单
                    if(path===item.key){
                        // 当前打开的是根节点且无子节点，无须展开
                        _this.setState({
                            openKeys:[]
                        })
                    }
                    pre.push({ label: item.title, key: item.key,icon: _this.transformComponent(item.icon)})
                    // pre.push(
                    //     <Menu.Item key={item.key} icon={_this.transformComponent(item.icon)}><Button type="link" style={{padding:0,color:'rgba(255, 255, 255, 0.7)'}} href={item.key}>{item.title}</Button></Menu.Item>
                    // )
                }else{
                    pre.push({ label: item.title, key: item.key })
                    // pre.push(
                    //     <Menu.Item key={item.key}><Button type="link" href={item.key}>{item.title}</Button></Menu.Item>
                    // )
                }
            } else if (item.children && item.hidden === false) {
                // 查找一个与当前请求路径匹配的子Item
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0);
                // 如果存在, 说明当前item的子列表需要打开
                if (cItem) {
                    _this.setState({
                        openKeys:[item.key]
                    })
                }
                // 向pre添加<SubMenu>
                pre.push(
                    {
                        label: item.title,
                        key: item.key,
                        icon: _this.transformComponent(item.icon),
                        children: _this.getMenuNodes(item.children),
                    }
                );
                // pre.push(
                //     <Menu.SubMenu key={item.key} icon={_this.transformComponent(item.icon)} style={{color:'rgba(255, 255, 255, 0.7)'}} title={<span>{item.title}</span>}>
                //         {_this.getMenuNodes(item.children)}
                //     </Menu.SubMenu>
                // );
            }
            return pre
        }, [])
    };

    /**
     * 一级菜单点击展开事件
     * @param _openKeys
     */
    onOpenChange = (_openKeys) => {
        let _this = this;
        const openKeys = this.state.openKeys;
        const latestOpenKey = _openKeys.find(key => openKeys.indexOf(key) === -1);
        menuConfig.reduce((pre, item) => {
            if (item.hidden === false){
                const cItem = _openKeys.find(cItem => openKeys.indexOf(cItem) === -1);
                // 如果存在, 说明当前item的子列表需要打开
                if (cItem) {
                    // 切换
                    _this.setState({
                        openKeys: latestOpenKey ? [latestOpenKey] : [],
                    });
                }else {
                    // 不切换保持原样
                    _this.setState({ openKeys:_openKeys });
                }
            }
        }, [])
        console.log(_openKeys,this.state.openKeys)
    };

    /*
    退出登陆
     */
    logout = () => {
        // 显示确认框
        Modal.confirm({
            title: '操作确认',
            content:'确定退出吗?',
            onOk: async () => {
                // 请求注销接口
                // await requestLogout();
                // 删除保存的user数据
                storageUtils.removeUser();
                memoryUtils.user = {};
                // 跳转到login
                this.props.history.replace('/login')
            }
        })
    };

    /**
     * 搜索框内容改变事件（用于双向绑定数据）
     * @param event
     */
    searchInputChange = (event) => {
        let _this = this;
        const value = event.target.value
        _this.setState({
            searchValue: value
        })
    };

    /**
     * 执行搜索
     */
    handleSearch = () =>{
        let _this = this;
        let searchValue = _this.state.searchValue || ""
        searchValue = searchValue.trim()
        if (!!searchValue) {
            // 有效内容可以搜索
            // 跳转到笔记列表界面 (需要再回退到当前页面),replace是不需要回退
            this.props.history.push(`/backstage/grow/notes?search=${searchValue}`)
        }
    }

    /**
     * 写笔记
     */
    addNotes = () => {
        // 跳转到笔记列表界面 (需要再回退到当前页面),replace是不需要回退
        this.props.history.push('/backstage/memory/notes/create')
    }

    /*
    * 在第一次render()之前执行一次
    * 为第一个render()准备数据(必须同步的)
    */
    componentDidMount() {
        const user = {account:"Shmily",user:{}};
        //const user = memoryUtils.user || {};
        // 初始化左侧导航
        const menuNodes = this.getMenuNodes(menuConfig);
        this.setState({ user,menuNodes });
        // 顶部用户头像下拉
        this.headerUserInfo = this.initHeaderMenu(user)
    }

    render() {
        // 读取状态
        let {leftCollapsed, rightCollapsed, openKeys, searchValue,menuNodes,user} = this.state;
        // 得到当前请求的路由路径
        let path = this.props.location.pathname;
        if (path.indexOf('/backstage/memory/news') === 0){
            // 当前请求的是news及其下面的路由
            path = '/backstage/message/news'
        }
        // 显示搜索框
        let showSearch = true
        if (path.indexOf('/backstage/memory/notes') === 0){
            // 当前请求的是news及其下面的路由
            path = '/backstage/grow/notes'
            // 如果进入笔记模块，则不显示
            showSearch = false
        }
        return (
            <div className="backend-container-v1 light-theme">
                <div className='background-div' style={{backgroundImage:`url('${ (user.user && user.user.backgroundUrl)?user.user.backgroundUrl:'/src/static/img/background_2.jpg'}')`}}>
                </div>
                <header className="this-header">
                    <div className='header-logo'>
                        <div className='tab-operation'>
                            <Button type="link" size='large' onClick={this.handleLeftTabClick}>
                                <MenuOutlined/>
                            </Button>
                        </div>
                        <div className='project-div' style={{backgroundImage:`url('/src/static/svg/project.svg')`}}>
                        </div>
                        <div className='project-name'>
                            极客印记
                        </div>
                    </div>
                    <div className='header-search'>
                        <div className='header-search-form'>
                            {
                                showSearch ?
                                    <div className='header-search-form-input'>
                                        <Button onClick={this.handleSearch}><SearchOutlined/></Button>
                                        <Input placeholder="搜索笔记"
                                               value={searchValue}
                                               onChange={this.searchInputChange}
                                               onPressEnter={this.handleSearch}/>
                                    </div>
                                    : null
                            }
                        </div>
                        <div className='header-search-menu'>
                            {
                                !(isEmptyObject(user.plan)) ?
                                    <Popover content={user.plan.reduce((pre, item) => {pre.push(<p key={item.id}>{item.describe}</p>);return pre},[])} title="今天计划">
                                        <Badge count={user.plan.length} dot color="#2db7f5">
                                            <NotificationOutlined/>
                                        </Badge>
                                    </Popover> :
                                    <Popover content="暂无计划" title="今天计划">
                                        <Badge count={0} dot>
                                            <NotificationOutlined/>
                                        </Badge>
                                    </Popover>
                            }
                        </div>
                    </div>
                    <div className='header-info'>
                        <Popover trigger="hover" mouseEnterDelay={0.2} mouseLeaveDelay={0.4} content={this.headerUserInfo}  placement="bottomRight">
                            <span className="el-dropdown-link">
                                <img src={(user.user && user.user.logo) ? user.user.logo : '/src/static/user/2020062697574.png'} alt={user.user.user || '用户'}/>
                            </span>
                        </Popover>
                    </div>
                </header>
                <section className="this-content">
                    <div className={`left-menu ${leftCollapsed ? 'left-menu-close' : 'left-menu-open'}`}>
                        <div className='menu-logo'>
                            <div className={`logo-item ${leftCollapsed?"menu-logo-close":""}`} onClick={this.addNotes}>
                                写笔记
                            </div>
                        </div>
                        <div className='menu-list'>
                            <Menu className='menu-list-ul' onOpenChange={(openKeys)=>this.onOpenChange(openKeys)} openKeys={openKeys} defaultOpenKeys={openKeys} mode="inline"
                                  inlineCollapsed={leftCollapsed} items={menuNodes}>
                            </Menu>
                        </div>
                        <div className={`menu-copyright ${leftCollapsed?"menu-copyright-close":null}`}>
                            <Button type="link" title='切换壁纸' href="/backstage/oss/wallpaper"><SwitcherOutlined/></Button>
                            <Button type="link" title='数据统计' href="/backstage/chart"><StockOutlined/></Button>
                            <Button type="link" title='操作日志' href="/backstage/me/logs"><FieldTimeOutlined/></Button>
                        </div>
                    </div>
                    <div className='content-container'>
                        <div className='content-div'>
                            <div className='container-div'>
                                <Routes>
                                    <Route path='/home' element={<DashBoard/>}/>
                                    <Route path='/financial/transaction' element={<Financial/>}/>
                                </Routes>
                            </div>
                        </div>
                        <div className='operation-info'>
                            {
                                !(isEmptyObject(user.log)) ?
                                    <span>{`您上次操作时间:${user.log.date},操作地点:${user.log.city}(${user.log.ip}),操作明细:${user.log.logType.describe}`}</span> :
                                    <span>Hi，这是您第一次使用吧？如有需要帮助的请及时联系运营团队。</span>
                            }
                        </div>
                    </div>
                    <div className={rightCollapsed?'show-quick-div':'hide-quick-div'}>
                        <div className="quick-div-menu">
                            <Button type="link" title='记账' href="/backstage/financial/transaction"><MoneyCollectOutlined/></Button>
                            <Button type="link" title='发布动态' href="/backstage/memory/news/publish"><NotificationOutlined/></Button>
                            <Button type="link" title='日程安排' href="/backstage/memory/plan"><CarryOutOutlined/></Button>
                            <Button type="link" title='便利贴' href="/backstage/memory/memo"><PushpinOutlined/></Button>
                        </div>
                        <div className="quick-div-button">
                            <div className="button-square" title="关闭侧边栏" onClick={this.handleRightTabClick}>
                                <RightOutlined />
                            </div>
                        </div>
                    </div>
                    <div className={rightCollapsed?'hide-open-quick-div':'show-open-quick-div'}>
                        <div className="button-square" title="显示侧边栏" onClick={this.handleRightTabClick}>
                            <LeftOutlined />
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

// 对外暴露
export default withRouter(LayoutBackend);

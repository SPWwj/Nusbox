import { Menu } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { Guid } from "guid-typescript";
const { SubMenu } = Menu;

export default function NavMenu() {

    return (
        <div>  
            <Menu mode="horizontal">
                <Menu.Item key="mail" icon={<MailOutlined />}>
                    Navigation One
                </Menu.Item>
                <Menu.Item key="app" disabled icon={<AppstoreOutlined />}>
                    Navigation Two
                </Menu.Item>
                <SubMenu key="SubMenu" icon={<SettingOutlined />} title="Navigation Three - Submenu">
                    <Menu.ItemGroup title="Item 1">
                        <Menu.Item key="setting:1">Option 1</Menu.Item>
                        <Menu.Item key="setting:2">Option 2</Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup title="Item 2">
                        <Menu.Item key="setting:3">Option 3</Menu.Item>
                        <Menu.Item key="setting:4">Option 4</Menu.Item>
                    </Menu.ItemGroup>
                </SubMenu>
                <Menu.Item key="alipay">
                    <a href={`/scheduler/${Guid.create()}`} >
                        Scheduler
                    </a>
                </Menu.Item>
            </Menu>
        </div>
    )

}
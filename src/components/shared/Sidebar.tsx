import { Drawer } from "antd";
import { useState } from "react";


const Sidebar = ( ) => {
    const [visible, setVisible] = useState(true);
    const showDrawer = () => {
        setVisible(!visible);
    };
    const onClose = () => {
        setVisible(false);
    };
    return (
        <div className="Sidebar">
            <Drawer getContainer={ false}
                style={{top : "auto"}}
                title="Basic Drawer" 
                placement="right" 
                onClose={onClose} 
                visible={visible}
                mask={false}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </div>)
};
export default Sidebar;
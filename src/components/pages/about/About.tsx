import { AccordionComponent, AccordionItemsDirective, AccordionItemDirective } from "@syncfusion/ej2-react-navigations";
import { useState } from "react";
import { Collapse } from 'antd';

const About = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { Panel } = Collapse;
    const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
    function callback(key: any) {
        console.log(key);
    }
    return (
        <>
            <Collapse>
                <Panel header="This is panel header 1" key="1">
                    <p>{text}</p>
                </Panel>
            </Collapse>
        </>
    );
}


export default About;
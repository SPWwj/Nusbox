import { Alert } from 'antd'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
export type InfoProps = {
  variant: string,
  children: string
}
export type InfoHandles = {
  toggleInfo(message : string): void;

}
const Info: React.ForwardRefRenderFunction<InfoHandles, InfoProps> = (props, ref) => {
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState("");

  useImperativeHandle(ref, () => ({
    toggleInfo(message) {
      setMessage(message);
      setShow(true);
    }
  }));
  // On componentDidMount set the timer
  useEffect(() => {
    const timeId = setTimeout(() => {
      // After 3 seconds set the show value to false
      setShow(false)
    }, 3000)

    return () => {
      clearTimeout(timeId)
    }
  }, [show]);

  // If show is false the component will return null and stop here
  if (!show) {
    return null;
  }

  // If show is true this will be returned
  return (
    <Alert message={message} type="warning" showIcon closable></Alert>
    // <div className={`alert alert-${props.variant}`}>
    //   {props.children}
    // </div>
  )
}

// Info.defaultPros = {
//   variant: 'info',
// }

export default forwardRef(Info);
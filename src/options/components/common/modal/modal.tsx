import { useState } from 'react';
import { default as ReactModal } from 'react-modal';

const customStyles = {
  // content: {
  //   top: '0',
  //   left: '0',
  //   right: '0',
  //   bottom: '0',
  //   background: 'rgba(0,0,0,0.5)',
  //   border: 'none',
  //   display: 'flex',
  // },
  overlay: {
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'rgba(0,0,0,0.5)',
  }
};

const Modal = ({ children, content, ...rest }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return <>
    <div onClick={() => setShowModal(!showModal)}>{content}</div>
    <ReactModal
      overlayClassName="top-0 bottom-0 right-0 left-0 absolute"
      className="w-full h-full flex items-center justify-center p-0 border-0 bg-none"
      style={customStyles}
      contentLabel="Example Modal"
      isOpen={showModal}
      {...rest}
    >
      {children}
    </ReactModal>
  </>

}


export default Modal;

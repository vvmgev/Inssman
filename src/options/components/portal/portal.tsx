import React from 'react'
import ReactDOM from 'react-dom'

interface IProps {
    children : React.ReactNode
    classes? : string
    element? : string
    parentId? : string
}

const Portal : React.FC<IProps> = ( { children, classes = '', element = 'div', parentId = 'root' } : IProps ) => {
  const [container] = React.useState(document.createElement(element))
  const parentElement = document.getElementById(parentId) as HTMLDivElement;
  const parentPosition = parentElement.getBoundingClientRect();
  const top = parentPosition.top + parentPosition.height + 10;
  container.classList.add('absolute', 'z-10', ...classes.split(''));
  container.style.top = `${Math.round(top)}px`;
  container.style.left = `${Math.round(parentPosition.left)}px`;
  container.style.width = `${parentElement.clientWidth}px`;


  React.useEffect(() => {
    document.body.appendChild(container)
    return () => {
        document.body.removeChild(container)
    }
  }, [])

  return ReactDOM.createPortal(children, container)
}

export default Portal;
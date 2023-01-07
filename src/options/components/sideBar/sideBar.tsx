import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import CodeSVG  from 'assets/icons/code.svg';
import RedirectSVG  from 'assets/icons/redirect.svg';
import BlockSVG  from 'assets/icons/block.svg';
import QuestionSVG  from 'assets/icons/question.svg';
import PencilSquareSVG  from 'assets/icons/pencilSquare.svg'
import ListSVG  from 'assets/icons/list.svg';

const paths = [
  {
    path: '/create-rule/redirect',
    text: 'Redirect Request',
    icon: <RedirectSVG />
  },
  {
    path: '/create-rule/block',
    text: 'Block Request',
    icon: <BlockSVG />
  },
  {
    path: '/create-rule/query-param',
    text: 'Query Param',
    icon: <QuestionSVG />
  },
  {
    path: '/create-rule/modify-header',
    text: 'Modify Header',
    icon: <CodeSVG />
  },
  {
    path: '/create-rule/modify-response',
    text: 'Modify Response',
    icon: <PencilSquareSVG />
  },
]

const SideBar = () => {
  const location = useLocation();
  return <div className="flex items-center h-full">
    <ul className="py-5 rounded-tr-3xl rounded-br-3xl bg-slate-800 bg-opacity-40 drop-shadow-xl shadow-inner border-r border-t border-b border-slate-700 w-full">
      <li className="px-10 mb-2">
        <Link to='/'>
          <div className={`${location.pathname === '/' ? 'text-sky-500' : ''} flex items-center hover:text-sky-500 gap-2`}><ListSVG /><span>Rules</span></div>  
        </Link>
      </li>
      <li className="px-10 mt-5 mb-2 text-slate-400"><div>Create Rule</div></li>
      {paths.map(({icon, text, path}, index) => (
        <li className="px-10 mb-2" key={index}>
          <Link to={path}>
          <div className={`${location.pathname === path ? 'text-sky-500' : ''} flex items-center hover:text-sky-500 gap-2`}>{icon}<span>{text}</span></div>
          </Link>
        </li>
      ))}
    </ul>
  </div>
}

export default SideBar;
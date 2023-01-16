import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import CodeSVG  from 'assets/icons/code.svg';
import RedirectSVG  from 'assets/icons/redirect.svg';
import BlockSVG  from 'assets/icons/block.svg';
import QuestionSVG  from 'assets/icons/question.svg';
import PencilSquareSVG  from 'assets/icons/pencilSquare.svg'
import ListSVG  from 'assets/icons/list.svg';
import Logo  from 'assets/images/logo.svg';

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
  return <div className="flex flex-col h-full justify-between">
    <div className="h-30 py-3 hover:cursor-pointer px-2 rounded-br-3xl bg-slate-800 bg-opacity-40 drop-shadow-xl shadow-inner border-r border-t border-b border-slate-700 w-full">
      <Logo/>
    </div>
    <ul className="py-5 rounded-tr-3xl rounded-br-3xl bg-slate-800 bg-opacity-40 drop-shadow-xl shadow-inner border-r border-t border-b border-slate-700 w-full">
      <li className="px-10 mb-2">
        <Link to='/'>
          <div className={`${location.pathname === '/' ? 'text-sky-500' : ''} flex items-center hover:text-sky-500 gap-2`}><span className="w-[24px]">{<ListSVG />}</span><span>All Rules</span></div>  
        </Link>
      </li>
      <li className="px-10 mt-5 mb-2 text-slate-400"><div>Create Rule</div></li>
      {paths.map(({icon, text, path}, index) => (
        <li className="px-10 mb-2" key={index}>
          <Link to={path}>
          <div className={`${location.pathname === path ? 'text-sky-500' : ''} flex items-center hover:text-sky-500 gap-2`}>
            <span className="w-[24px]">{icon}</span>
            <span>{text}</span></div>
          </Link>
        </li>
      ))}
    </ul>
    <div></div>
  </div>
}

export default SideBar;
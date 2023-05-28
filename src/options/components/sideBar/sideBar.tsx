import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ListSVG  from 'assets/icons/list.svg';
import Logo  from 'assets/images/logo.svg';
import ColorCover from '../common/colorCover/colorCover';
import { paths } from '../app/paths';
import TemplateList from './templateList';

const SideBar = () => {
  const location = useLocation();
  return <div className="flex flex-col h-full justify-between">
    <ColorCover classes='h-30 py-3 px-2 rounded-bl-none rounded-tl-none rounded-tr-none h-[initial]'>
      <Link className="hover:cursor-pointer" to="/"><Logo /></Link>
    </ColorCover>
    <div className="flex flex-col gap-5">
      <ColorCover classes='px-0 rounded-tl-none rounded-bl-none h-[initial]'>
        <ul>
          <li className="pl-2 mb-2">
            <Link to='/'>
              <div className={`${location.pathname === '/' ? 'text-sky-500' : ''} flex items-center hover:text-sky-500 gap-2`}><span className="w-[24px]">{<ListSVG />}</span><span>All Rules</span></div>
            </Link>
          </li>
          <li className="pl-2 mt-5 mb-2 text-slate-400"><div>Create Rule</div></li>
          {paths.map(({icon, text, path}, index) => (
            <li className="pl-2 mb-2" key={index}>
              <Link to={`/create/${path}`}>
              <div className={`${location.pathname === `/create/${path}` ? 'text-sky-500' : ''} flex items-center hover:text-sky-500 gap-2`}>
                <span className="min-w-[24px]">{icon}</span>
                <span>{text}</span></div>
              </Link>
            </li>
          ))}
        </ul>
      </ColorCover>
      <TemplateList />
    </div>
    <div></div>
  </div>
}

export default SideBar;
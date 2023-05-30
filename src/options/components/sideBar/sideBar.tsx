import React from 'react';
import { Link } from 'react-router-dom';
import Logo  from 'assets/images/logo.svg';
import ColorCover from '../common/colorCover/colorCover';
import TemplateList from './templateList';
import FormList from './formList';

const SideBar = () => {
  return <div className="flex flex-col h-full justify-between">
    <ColorCover classes='h-30 py-3 px-2 rounded-bl-none rounded-tl-none rounded-tr-none h-[initial]'>
      <Link className="hover:cursor-pointer" to="/"><Logo /></Link>
    </ColorCover>
    <div className="flex flex-col gap-3">
      <ColorCover classes='px-0 rounded-tl-none rounded-bl-none h-[initial]'>
        <FormList />
      </ColorCover>
      <ColorCover classes='px-0 rounded-tl-none rounded-bl-none h-[initial]'>
        <TemplateList />
      </ColorCover>
    </div>
    <div></div>
  </div>
}

export default SideBar;
import React from 'react';
import { Link } from 'react-router-dom';
import CodeSVG  from '../../../assets/icons/code.svg';
import RedirectSVG  from '../../../assets/icons/redirect.svg';
import BlockSVG  from '../../../assets/icons/block.svg';
import QuestionSVG  from '../../../assets/icons/question.svg';
import PencilSVG  from '../../../assets/icons/pencil.svg'
import ListSVG  from '../../../assets/icons/list.svg';

const SideBar = () => {
  return <div className="flex items-center h-screen">
    <ul className="py-5 rounded-tr-3xl rounded-br-3xl bg-slate-800 bg-opacity-40 drop-shadow-xl shadow-inner border-r border-t border-b border-slate-700 w-full">
      <li className="px-10 mb-2">
        <Link to='/'>
          <div className="flex items-center hover:text-sky-500 gap-2"><ListSVG /><span>Rules</span></div>  
        </Link>
      </li>
      <li className="px-10 mb-2 text-slate-400"><div>Create</div></li>
      <li className="px-10 mb-2">
        <Link to='create-rule/redirect'>
          <div className="flex items-center hover:text-sky-500 gap-2"><RedirectSVG /><span>Redirect Request</span></div>  
        </Link>
      </li>
      <li className="px-10 mb-2">
        <Link to='create-rule/block'>
          <div className="flex items-center hover:text-sky-500	gap-2"><BlockSVG /><span>Block Request</span></div>  
        </Link>
      </li>
      <li className="px-10 mb-2">
        <Link to='create-rule/query-param'>
          <div className="flex items-center hover:text-sky-500	gap-2"><QuestionSVG /><span>Query Param</span></div>  
        </Link>
      </li>
      <li className="px-10 mb-2">
        <Link to='create-rule/modify-header'>
          <div className="flex items-center hover:text-sky-500	gap-2"><CodeSVG /><span>Modify Header</span></div>  
        </Link>
      </li>
      <li className="px-10 mb-2">
        <Link to='create-rule/modify-response'>
          <div className="flex items-center hover:text-sky-500	gap-2"><PencilSVG /><span>Modify Response</span></div>  
        </Link>
      </li>
    </ul>
  </div>
}

export default SideBar;
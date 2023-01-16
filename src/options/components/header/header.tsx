import React from 'react';
import { Link } from 'react-router-dom';
import GithubSVG from 'assets/icons/github.svg'
import DocumentSVG from 'assets/icons/document.svg'


const Header =  () => {
    return <div className="flex justify-end">
        <div className="flex gap-5 p-5 py-7 h-30
            rounded-bl-3xl bg-slate-800 bg-opacity-40 drop-shadow-xl
            shadow-inner border-r border-l border-b border-slate-700">
            <Link to="/" className="flex gap-3 items-center hover:text-sky-500"><span className="w-[24px]">{<GithubSVG />}</span>Github</Link>
            <Link to="/" className="flex gap-3 items-center hover:text-sky-500"><span className="w-[24px]">{<DocumentSVG />}</span>Docs</Link>
        </div>
    </div>
}
export default Header;
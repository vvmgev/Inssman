import Logo  from 'assets/icons/logo.svg';
import ColorCover from '../common/colorCover/colorCover';
import TemplateList from './templateList';
import FormList from './components/formList/formList';
import Record from './components/record/record';
import { SideBarContext } from 'src/context/sideBarContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

const SideBar = () => {
  const { full } = useContext(SideBarContext);
  return <div className={`flex flex-col gap-1 h-full w-1/6 ${full ? '' : ''}`}>
    <ColorCover classes="rounded-bl-none rounded-tl-none rounded-tr-none">
      <Link className="hover:cursor-pointer" to="/"><Logo /></Link>
    </ColorCover>
    <ColorCover classes="rounded-tl-none rounded-bl-none">
      <FormList />
    </ColorCover>
    <ColorCover classes="rounded-tl-none rounded-bl-none transition ease-in-out ">
      <Record />
    </ColorCover>
    <ColorCover classes="rounded-tl-none rounded-bl-none">
      <TemplateList />
    </ColorCover>
  </div>
}

export default SideBar;

import Image from 'next/image'
import Logo  from '../../../browser-extension/src/assets/images/icons/inssman_big.png';
import GithubSVG  from './github.svg';
import DocumentSVG  from './document.svg';

export default function Home() {
  return (
    <main className="w-full h-[100vh] bg-[linear-gradient(140deg,_rgba(15,_23,_42,_1)_0%,_rgba(15,_23,_42,_1)_39%,_rgba(42,_61,_108,_1)_80%)]
    text-gray-300 text-sm relative">
      <div className="absolute top-0 left-0">
        <div className={`p-2 rounded-3xl rounded-tl-none rounded-bl-none rounded-tr-none bg-slate-800 bg-opacity-40 drop-shadow-xl
            shadow-inner border border-slate-700 overflow-auto`}>
              <Image alt="Inssman" src={Logo} className="w-[300px]"/>
        </div>
      </div>
      <div className="absolute top-0 right-0">
        <div className="bg-slate-800 bg-opacity-40 drop-shadow-xl rounded-3xl rounded-tl-none rounded-br-none rounded-tr-none shadow-inner border border-slate-700 overflow-auto flex gap-5 p-5 w-[initial]">
          <a target="_blank" href="https://github.com/vvmgev/Inssman" className="flex gap-3 items-center hover:text-sky-500">
            <span className="w-[24px] text-white">
              {/* @ts-ignore */}
              <Image alt="Inssman Github" src={GithubSVG} />
            </span>
            Github</a>
          <a target="_blank" href="https://github.com/vvmgev/Inssman#documentation" className="flex gap-3 items-center hover:text-sky-500">
              <span className="w-[24px] text-white">
                <Image alt="Inssman Documentation" className="text-white" src={DocumentSVG} />
              </span>
              Docs
          </a>
        </div>
      </div>

      <div className="absolute top-[50%] left-[50%] text-center text-6xl -translate-x-2/4 -translate-y-2/4">
        <h1>COMING SOON 😍</h1>
      <hr />
    </div>

    </main>
  )
}

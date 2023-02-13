import React from 'react';

const BackgroundAnimation = ({children}) => <div className="bg-[linear-gradient(140deg,_rgba(15,_23,_42,_1)_0%,_rgba(15,_23,_42,_1)_39%,_rgba(42,_61,_108,_1)_80%)]
      h-screen text-gray-300 text-sm
      before:content-[''] before:inline-block before:w-[300px] before:h-[300px] before:absolute
      before:bg-[linear-gradient(rgba(55,_235,_169,_0.4),rgba(91,_55,_235,_0.4))] before:rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]
      before:animate-backgroundBefore before:border-2 before:blur-[50px]
      after:content-[''] after:inline-block after:w-[300px] after:h-[300px] after:absolute
      after:bg-[linear-gradient(rgba(91,_55,_235,_0.4),rgba(55,_235,_169,_0.4))] after:rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]
      after:animate-backgroundAfter after:border-2 after:blur-[50px]">
        {children}
    </div>;

export default BackgroundAnimation;

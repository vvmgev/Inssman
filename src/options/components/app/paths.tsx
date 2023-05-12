import React from 'react';
import CodeSVG  from 'assets/icons/code.svg';
import RedirectSVG  from 'assets/icons/redirect.svg';
import BlockSVG  from 'assets/icons/block.svg';
import QuestionSVG  from 'assets/icons/question.svg';
import PencilSquareSVG  from 'assets/icons/pencilSquare.svg'
import ListBulletSVG  from 'assets/icons/listBullet.svg';
import PaperClipSVG  from 'assets/icons/paperClip.svg';
import WrenchSVG  from 'assets/icons/wrench.svg';

export const paths = [
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
    {
      path: '/create-rule/inject-file',
      text: 'Inject File',
      icon: <WrenchSVG />
    },
    // {
    //   path: '/create-rule/modify-request-body',
    //   text: 'Modify Request Body',
    //   icon: <PaperClipSVG />
    // },
    {
      path: '/http-logger',
      text: 'HTTP Logger',
      icon: <ListBulletSVG />
    },
]
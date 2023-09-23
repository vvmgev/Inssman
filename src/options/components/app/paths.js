import CodeSVG from 'assets/icons/code.svg';
import RedirectSVG from 'assets/icons/redirect.svg';
import BlockSVG from 'assets/icons/block.svg';
import QuestionSVG from 'assets/icons/question.svg';
import PencilSquareSVG from 'assets/icons/pencilSquare.svg';
import ListBulletSVG from 'assets/icons/listBullet.svg';
import PaperClipSVG from 'assets/icons/paperClip.svg';
import WrenchSVG from 'assets/icons/wrench.svg';
import { PageType } from 'src/models/formFieldModel';

export const paths = [
  {
    path: PageType.REDIRECT,
    text: 'Redirect Request',
    icon: <RedirectSVG />,
  },
  {
    path: PageType.BLOCK,
    text: 'Block Request',
    icon: <BlockSVG />,
  },
  {
    path: PageType.QUERY_PARAM,
    text: 'Query Param',
    icon: <QuestionSVG />,
  },
  {
    path: PageType.MODIFY_HEADER,
    text: 'Modify Header',
    icon: <CodeSVG />,
  },
  {
    path: PageType.MODIFY_RESPONSE,
    text: 'Modify Response',
    icon: <PencilSquareSVG />,
  },
  {
    path: PageType.INJECT_FILE,
    text: 'Inject File',
    icon: <WrenchSVG />,
  },
  {
    path: PageType.MODIFY_REQUEST_BODY,
    text: 'Modify Request Body',
    icon: <PaperClipSVG />,
  },
  {
    path: PageType.HTTP_LOGGER,
    text: 'HTTP Logger',
    icon: <ListBulletSVG />,
  },
];

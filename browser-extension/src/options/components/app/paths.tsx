import Icon from "@options/components/common/icon/icon";
import { PageType } from "@models/formFieldModel";

export const paths = [
  {
    path: PageType.REDIRECT,
    text: "Redirect Request",
    icon: <Icon name="redirect" />,
  },
  {
    path: PageType.BLOCK,
    text: "Block Request",
    icon: <Icon name="block" />,
  },
  {
    path: PageType.QUERY_PARAM,
    text: "Query Param",
    icon: <Icon name="question" />,
  },
  {
    path: PageType.MODIFY_HEADER,
    text: "Modify Header",
    icon: <Icon name="code" />,
  },
  {
    path: PageType.MODIFY_RESPONSE,
    text: "Modify Response",
    icon: <Icon name="pencilSquare" />,
  },
  {
    path: PageType.INJECT_FILE,
    text: "Inject File",
    icon: <Icon name="wrench" />,
  },
  {
    path: PageType.MODIFY_REQUEST_BODY,
    text: "Modify Request Body",
    icon: <Icon name="paperClip" />,
  },
  {
    path: PageType.HTTP_LOGGER,
    text: "HTTP Logger",
    icon: <Icon name="listBullet" />,
  },
];

export const popularPaths = [PageType.MODIFY_HEADER];

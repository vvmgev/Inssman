import { PageType } from "@/components/sidebar/paths";
import RedirectImage from "../../../assets/images/rules-image/redirect.png";
import BlockImage from "../../../assets/images/rules-image/block.png";
import ModifyHeaderImage from "../../../assets/images/rules-image/modify-header.png";
import ModifyResponseImage from "../../../assets/images/rules-image/modify-response.png";
import QueryParamImage from "../../../assets/images/rules-image/query-param.png";
import InjectFileImage from "../../../assets/images/rules-image/inject-file.png";
import ModifyRequestBodyImage from "../../../assets/images/rules-image/modify-request-body.png";

export const HTTPRulesTypeInfo = {
  [PageType.REDIRECT]: {
    title: "Redirect To Another Source",
    description: "Redirect request to local machine or any environment like production",
    image: RedirectImage,
  },
  [PageType.BLOCK]: {
    title: "Block All Type Of Requests",
    description: "Block any type of request like XMLHttpRequest/Fetch/HTML/CSS/Script/Fonts ...etc",
    image: BlockImage,
  },
  [PageType.MODIFY_HEADER]: {
    title: "Modify Headers",
    description: "Modify request & response headers by adding headers, removing and overriding",
    image: ModifyResponseImage,
  },
  [PageType.MODIFY_RESPONSE]: {
    title: "Modify Any Request",
    description: "Implement new features without waiting backend or modify existing APIs wihtout changing the source",
    image: ModifyHeaderImage,
  },
  [PageType.QUERY_PARAM]: {
    title: "Modify URL Query Params",
    description: "Modify request query parameters by adding, removing and overriding",
    image: QueryParamImage,
  },
  [PageType.INJECT_FILE]: {
    title: "Inject Files",
    description: "Inject custom HTML/CSS/Script on any webpages",
    image: InjectFileImage,
  },
  [PageType.MODIFY_REQUEST_BODY]: {
    title: "Modify Request Body",
    description: "Modify request body without touching the code",
    image: ModifyRequestBodyImage,
  },
  [PageType.HTTP_LOGGER]: {},
};

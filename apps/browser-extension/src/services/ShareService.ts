import { APP_URL } from "@/options/constant";

class ShareService {
  share = (path): string => {
    const url = this.generateUrl(path);
    return url;
  };
  generateUrl = (path: string): string => {
    return `${APP_URL}${path}`;
  };
}

export default new ShareService();

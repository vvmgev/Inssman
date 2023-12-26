import mixpanel from "mixpanel-browser";
import { init } from "@amplitude/analytics-browser";
import { track } from "@amplitude/analytics-browser";
import { PostMessageAction } from "@models/postMessageActionModel";

class TrackService {
  #userId;
  #token = "1e353dd7663e03056e8f96580e005504";
  #tokenMixPanel = "e7c7c422b9e4a82b6887113213bf6c73";
  constructor() {
    if (process.env.NODE_ENV === "development") return;
    chrome.runtime.sendMessage({ action: PostMessageAction.GetUserId }, ({ userId }) => {
      this.#userId = String(userId);
      init(this.#token, this.#userId);
      mixpanel.init(this.#tokenMixPanel, {
        debug: true,
        track_pageview: true,
        persistence: "localStorage",
        ignore_dnt: true,
      });
      mixpanel.identify(this.#userId);
    });
  }

  trackEvent(name: string) {
    if (process.env.NODE_ENV === "development") return;
    try {
      track(`${name} - ${process.env.BROWSER}`);
      mixpanel.track(name);
    } catch (error) {}
  }
}

export default new TrackService();

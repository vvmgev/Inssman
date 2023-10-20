import { init } from '@amplitude/analytics-browser';
import { track } from '@amplitude/analytics-browser';
import { PostMessageAction } from 'src/models/postMessageActionModel';

class TrackService {
    #userId;
    #token = '1e353dd7663e03056e8f96580e005504';
    constructor() {
        if(process.env.NODE_ENV === 'development') return;
        chrome.runtime.sendMessage({ action: PostMessageAction.GetUserId }, ({ userId }) => {
            this.#userId = String(userId);
            init(this.#token, this.#userId);
        });
    };

    trackEvent(name: string) {
        if(process.env.NODE_ENV === 'development') return;
        try {
            track(`${name} - ${process.env.BROWSER}`);
        } catch (error) {

        }
    };
};

export default new TrackService();

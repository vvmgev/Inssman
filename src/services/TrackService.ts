import { init } from '@amplitude/analytics-browser';
import { track } from '@amplitude/analytics-browser';
import { PostMessageAction } from 'src/models/postMessageActionModel';

class TrackService {
    constructor() {
        if(process.env.NODE_ENV === 'development') return;
        chrome.runtime.sendMessage({ action: PostMessageAction.GetUserId }, ({ userid }) => {
            init('1e353dd7663e03056e8f96580e005504', String(userid));
        });
    };

    trackEvent(name: string) {
        if(process.env.NODE_ENV === 'development') return;
        try {
            track(name);
        } catch (error) {
            
        }
    };
};

export default new TrackService();
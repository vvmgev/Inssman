import { MatchType } from "src/models/formFieldModel";
import { replaceAsteriskToPlus } from "src/options/utils";

class MatcherService {
    
    isUrlsMatch (sourceUrl: string, currentUrl: string, matchType: string): boolean {
        return (matchType === MatchType.CONTAIN && this.isContain(sourceUrl, currentUrl) ) || 
               (matchType === MatchType.EQUAL && this.isEqual(sourceUrl, currentUrl)) ||
               (matchType === MatchType.WILDCARD && this.isWildCard(sourceUrl, currentUrl));
    }

    isContain = (sourceUrl: string, currentUrl: string): boolean => currentUrl.includes(sourceUrl);
    isEqual = (sourceUrl: string, currentUrl: string): boolean => currentUrl === sourceUrl;
    isWildCard = (sourceUrl: string, currentUrl: string): boolean => new RegExp(replaceAsteriskToPlus(sourceUrl)).test(currentUrl);
}

export default new MatcherService();
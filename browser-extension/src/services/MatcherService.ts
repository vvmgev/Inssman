import { MatchType } from "@models/formFieldModel";
import { replaceAsteriskToPlus } from "@utils/regExp";

class MatcherService {
  isUrlsMatch(
    sourceUrl: string,
    currentUrl: string,
    matchType: string
  ): boolean {
    return (
      (matchType === MatchType.CONTAIN &&
        this.isContain(sourceUrl, currentUrl)) ||
      (matchType === MatchType.EQUAL && this.isEqual(sourceUrl, currentUrl)) ||
      (matchType === MatchType.WILDCARD &&
        this.isWildCard(sourceUrl, currentUrl))
    );
  }

  private isContain = (sourceUrl: string, currentUrl: string): boolean =>
    currentUrl.includes(sourceUrl);
  private isEqual = (sourceUrl: string, currentUrl: string): boolean =>
    currentUrl === sourceUrl;
  private isWildCard = (sourceUrl: string, currentUrl: string): boolean =>
    new RegExp(replaceAsteriskToPlus(sourceUrl)).test(currentUrl);
}

export default new MatcherService();

import { MatchType } from 'src/models/formFieldModel';
import { replaceAsteriskToPlus } from 'src/utils';

class MatcherService {
  isUrlsMatch(sourceUrl, currentUrl, matchType) {
    return (matchType === MatchType.CONTAIN && this.#isContain(sourceUrl, currentUrl))
               || (matchType === MatchType.EQUAL && this.#isEqual(sourceUrl, currentUrl))
               || (matchType === MatchType.WILDCARD && this.#isWildCard(sourceUrl, currentUrl));
  }

  #isContain = (sourceUrl, currentUrl) => currentUrl.includes(sourceUrl);
  #isEqual = (sourceUrl, currentUrl) => currentUrl === sourceUrl;
  #isWildCard = (sourceUrl, currentUrl) => new RegExp(replaceAsteriskToPlus(sourceUrl)).test(currentUrl);
}

export default new MatcherService();

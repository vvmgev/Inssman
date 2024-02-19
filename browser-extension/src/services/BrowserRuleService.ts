import Rule = chrome.declarativeNetRequest.Rule;
import UpdateRuleOptions = chrome.declarativeNetRequest.UpdateRuleOptions;
import RulesMatchedDetails = chrome.declarativeNetRequest.RulesMatchedDetails;
import MatchedRulesFilter = chrome.declarativeNetRequest.MatchedRulesFilter;

class BrowserRuleService {
  get(): Promise<Rule[]> {
    return chrome.declarativeNetRequest.getDynamicRules();
  }

  set(addRules: Rule[], removeRuleIds: number[] = []): Promise<void> {
    return this.updateDynamicRules({
      addRules,
      removeRuleIds,
    });
  }

  remove(removeRuleIds: number[]): Promise<void> {
    return this.updateDynamicRules({ removeRuleIds });
  }

  async clear(): Promise<void> {
    const rules = await this.get();
    const removeRuleIds = rules.map(({ id }) => id);
    await this.remove(removeRuleIds);
  }

  async getRules(ids: number[]): Promise<Rule[]> {
    const rules: Rule[] = await this.get();
    return rules.filter(({ id }) => ids.includes(id));
  }

  updateDynamicRules(updateRuleOptions: UpdateRuleOptions): Promise<void> {
    return chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions);
  }

  getMatchedRules(filter?: MatchedRulesFilter): Promise<RulesMatchedDetails> {
    return chrome.declarativeNetRequest.getMatchedRules(filter);
  }
}

export default new BrowserRuleService();

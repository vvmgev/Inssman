import Rule = chrome.declarativeNetRequest.Rule;
import UpdateRuleOptions = chrome.declarativeNetRequest.UpdateRuleOptions;
import RulesMatchedDetails = chrome.declarativeNetRequest.RulesMatchedDetails;
import MatchedRulesFilter = chrome.declarativeNetRequest.MatchedRulesFilter;

class RuleService {
  get(): Promise<Rule[]> {
    return chrome.declarativeNetRequest.getDynamicRules();
  }

  set(rules: Rule[], removeRules: Rule[] = []): Promise<void> {
    return this.updateDynamicRules({
      addRules: rules,
      removeRuleIds: removeRules.map((rule) => rule.id),
    });
  }

  remove(rules: Rule[]): Promise<void> {
    const removeRuleIds: number[] = rules.map((rule) => rule.id);
    return this.updateDynamicRules({ removeRuleIds });
  }

  removeById(id: number): Promise<void> {
    return this.updateDynamicRules({ removeRuleIds: [id] });
  }

  async clear(): Promise<void> {
    await this.remove(await this.get());
  }

  async getRuleById(id: number): Promise<Rule> {
    const rules: Rule[] = await this.get();
    return rules.find((rule) => rule.id === id) as Rule;
  }

  updateDynamicRules(updateRuleOptions: UpdateRuleOptions): Promise<void> {
    return chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions);
  }

  getMatchedRules(filter?: MatchedRulesFilter): Promise<RulesMatchedDetails> {
    return chrome.declarativeNetRequest.getMatchedRules(filter);
  }
}

export default new RuleService();

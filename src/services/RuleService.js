class RuleService {
  #DEFAULT_PRIOPRITY = 1;

  get() {
    return chrome.declarativeNetRequest.getDynamicRules();
  }

  set(rules = [], removeRules = []) {
    return this.updateDynamicRules({ addRules: rules, removeRuleIds: removeRules.map((rule) => rule.id) });
  }

  remove(rules) {
    const removeRuleIds = rules.map((rule) => rule.id);
    return this.updateDynamicRules({ removeRuleIds });
  }

  removeById(id) {
    return this.updateDynamicRules({ removeRuleIds: [id] });
  }

  async clear() {
    await this.remove(await this.get());
  }

  async getRuleById(id) {
    const rules = await this.get();
    return rules.find((rule) => rule.id === id);
  }

  updateDynamicRules(updateRuleOptions) {
    return chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions);
  }

  getMatchedRules(filter) {
    return chrome.declarativeNetRequest.getMatchedRules(filter);
  }
}

export default new RuleService();

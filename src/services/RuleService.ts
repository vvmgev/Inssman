import Rule = chrome.declarativeNetRequest.Rule;
import UpdateRuleOptions = chrome.declarativeNetRequest.UpdateRuleOptions;
class RuleService {
    #DEFAULT_PRIOPRITY = 1;

    get(): Promise<Rule[]> {
        return chrome.declarativeNetRequest.getDynamicRules();
    }

    set(rules: Rule[], removeRules: Rule[] = []): Promise<void> {
        return this.updateDynamicRules({ addRules: rules, removeRuleIds: removeRules.map(rule => rule.id) })
    }

    remove(rules: Rule[]): Promise<void> {
        const removeRuleIds: number[] = rules.map(rule => rule.id);
        return this.updateDynamicRules({removeRuleIds})
    }

    removeById(id: number): Promise<void> {
        return this.updateDynamicRules({removeRuleIds: [id]})
    }

    async getRuleById(id: number): Promise<Rule> {
        const rules: Rule[] = await this.get();
        return rules.find(rule => rule.id === id) as Rule;
    }

    updateDynamicRules(updateRuleOptions: UpdateRuleOptions): Promise<void> {
        return chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions);
    }
}

export default new RuleService();



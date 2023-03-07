import Rule = chrome.declarativeNetRequest.Rule;
import UpdateRuleOptions = chrome.declarativeNetRequest.UpdateRuleOptions;
import UpdateRulesetOptions = chrome.declarativeNetRequest.UpdateRulesetOptions;
class RuleService {
    #DEFAULT_PRIOPRITY = 1;

    constructor() {
        // this.getRules().then(rules => {
        //     console.log('qwqwq rules', rules);
        // });
        // this.reset();
    }

    async add(rules: Rule[], removeRules: Rule[] = []): Promise<void> {
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
        const rules: Rule[] = await this.getRules();
        return rules.find(rule => rule.id === id) as Rule;
    }

    updateDynamicRules(updateRuleOptions: UpdateRuleOptions): Promise<void> {
        return chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions);
    }

    getRules(): Promise<Rule[]> {
        return chrome.declarativeNetRequest.getDynamicRules();
    }

    async reset(): Promise<void> {
        return this.remove(await this.getRules());
    }
}

export default new RuleService();


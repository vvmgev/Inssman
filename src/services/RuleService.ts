import StorageService from './StorageService';
import { FormField, FormType, FormTypeMap } from "../models/formFieldModel";
import Rule = chrome.declarativeNetRequest.Rule;
import UpdateRuleOptions = chrome.declarativeNetRequest.UpdateRuleOptions;
import RequestMethod = chrome.declarativeNetRequest.RequestMethod
import RuleCondition = chrome.declarativeNetRequest.RuleCondition
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import RuleAction = chrome.declarativeNetRequest.RuleAction
import ResourceType = chrome.declarativeNetRequest.ResourceType


class RuleService {
    async add(rules: Rule[], removeRules: Rule[] = []): Promise<void> {
        // const qq : number[] = rules.map(as => as.id);
        // const ww: number[] = (await this.getRules()).map(item => item.id);
        // return this.updateDynamicRules({addRules: rules, removeRuleIds: [...qq, ...ww]})
        return this.updateDynamicRules({ addRules: rules, removeRuleIds: removeRules.map(rule => rule.id) })
    }

    remove(rules: Rule[]): Promise<void> {
        const removeRuleIds: number[] = rules.map(rule => rule.id);
        return this.updateDynamicRules({removeRuleIds})
    }

    async getRuleById(id: number): Promise<Rule | undefined> {
        const rules: Rule[] = await this.getRules();
        return rules.find(rule => rule.id === id);
    }

    updateDynamicRules(updateRuleOptions: UpdateRuleOptions): Promise<void> {
        return chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions);
    }

    getRules(): Promise<Rule[]> {
        return chrome.declarativeNetRequest.getDynamicRules();
    }

    generateAction(formField: FormField): RuleAction {
        return {
            type: FormTypeMap[formField.formType],
            redirect : {
                ...(formField.url && {url: formField.url}),
                ...(formField.extensionPath && {extensionPath: formField.extensionPath}),
                ...(formField.regexSubstitution && {regexSubstitution: formField.regexSubstitution}),
                // "transform" property is not implemented
            }
        }
    }

    generateCondition(formField: FormField): RuleCondition {
        return {
            ...(formField.urlFilter && {urlFilter: formField.urlFilter}),
            ...(formField.regexFilter && {regexFilter: formField.regexFilter}),
            resourceTypes: [ResourceType.MAIN_FRAME, ResourceType.SUB_FRAME]
            // some properties are not implemented
            // see docs
        }
    }

    async generateRule(formField: FormField): Promise<Rule> {
        const rule: any = {
            id: formField.id,
            priority: 1, 
            action: this.generateAction(formField),
            condition: this.generateCondition(formField),
        };

        console.log('rule', rule);
        return rule;
    }

    degenerate(rule: Rule): FormField {
        const formField: FormField = {
            id: rule.id,
            priority: rule.priority,
            formType: rule.action.type as any,
            url: rule.action.redirect?.url as string,
            extensionPath: rule.action.redirect?.extensionPath as string,
            regexSubstitution: rule.action.redirect?.regexSubstitution as string,
            urlFilter: rule.condition?.urlFilter as string,
            regexFilter: rule.condition?.regexFilter as string,
            // @ts-ignore
            resourceTypes: rule.condition?.resourceTypes,

        };

        return formField;
    }
}

export default new RuleService();
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
    #DEFAULT_PRIOPRITY = 1;

    async add(rules: Rule[], removeRules: Rule[] = []): Promise<void> {
        return this.updateDynamicRules({ addRules: rules, removeRuleIds: removeRules.map(rule => rule.id) })
    }

    remove(rules: Rule[]): Promise<void> {
        const removeRuleIds: number[] = rules.map(rule => rule.id);
        return this.updateDynamicRules({removeRuleIds})
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

    generateAction(formField: any): RuleAction {
        const action: RuleAction = {
            type: formField.ruleActionType,
        }
        if(formField.redirectPropertyType) {
            action[formField.redirectPropertyType] = formField.destination;
        }

        if(formField.queryParams || formField.removeParams) {
            action.redirect = {
                transform:{
                  queryTransform: {
                    ...(formField.queryParams && {addOrReplaceParams: formField.queryParams}),
                    ...(formField.removeParams && {removeParams: formField.removeParams}),
                }
              }
            }
        }
        

        return action;
    }

    generateCondition(formField: any): RuleCondition {
        return {
            ...{[formField.filterType]: formField.source},
            resourceTypes: [ResourceType.MAIN_FRAME, ResourceType.SUB_FRAME, ResourceType.XMLHTTPREQUEST]
        }
    }

    async generateRule(formField: FormField): Promise<Rule> {
        const rule: any = {
            id: formField.id,
            priority: formField.priority || this.#DEFAULT_PRIOPRITY,
            action: this.generateAction(formField),
            condition: this.generateCondition(formField),
        };
        return rule;
    }

    async generateRuleNew(formField: FormField): Promise<Rule> {
        const rule: any = {
            id: formField.id,
            priority: formField.priority || this.#DEFAULT_PRIOPRITY,
            action: this.generateAction(formField),
            condition: this.generateCondition(formField),
        };
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
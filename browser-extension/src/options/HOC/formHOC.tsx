import TrackService from "@services/TrackService";
import Toast from "@options/components/common/toast/toast";
import Forms from "@pages/forms/forms";
import config from "../formBuilder/config";
import { FormMode, IForm, IRule, IRuleMetaData, PageName } from "@models/formFieldModel";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PostMessageAction } from "@models/postMessageActionModel";
import { StorageItemType } from "@models/storageModel";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export type FormError = {
  [key: string]: { message: string } | null;
};

const FormHOC = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormError>({});
  const [ruleMetaData, setRuleMetaData] = useState<IRuleMetaData>({} as IRuleMetaData);
  const id = params.id ? Number(params.id) : null;
  const mode = id ? FormMode.UPDATE : FormMode.CREATE;
  const getPageType = (mode: FormMode): string => {
    const pathArr = location.pathname.split("/");
    return mode === FormMode.CREATE ? pathArr[pathArr.length - 1] : pathArr[pathArr.length - 2];
  };
  const pageType = getPageType(mode);
  const fields = config[pageType].fields;

  const inValid = (value, regexp) => regexp.test(value);

  const setError = (fieldName, message) => {
    setErrors({
      ...errors,
      [fieldName]: message,
    });
  };

  const validate = (name, value, fieldValidations) => {
    const error = {};
    fieldValidations?.forEach((validation) => {
      if (error[name]) return;
      error[name] = inValid(value, validation.regexp) ? validation.message : null;
    });
    return error;
  };

  const validateArray = (name, value, validations) => {
    let error = {};
    value.forEach((item, index) => {
      for (const validationKey in validations[name]) {
        const validation = validations[name][validationKey];
        error = {
          [name]: {
            ...error[name],
            [index]: {
              ...error[name]?.[index],
              ...validate(validationKey, item[validationKey], validation),
            },
          },
        };
      }
    });
    return error;
  };

  const validateAll = (ruleMetaData) => {
    let error = {};
    fields.forEach((field) => {
      for (let name in field.validations) {
        const fieldValidations = field.validations[name];
        error = {
          ...error,
          ...(Array.isArray(ruleMetaData[name])
            ? validateArray(name, ruleMetaData[name], field.validations)
            : validate(name, ruleMetaData[name], fieldValidations)),
        };
      }
    });
    return error;
  };

  const onChange = (event, field) => {
    const { name, value } = event.target;
    const { validations = {} } = field;
    const error = Array.isArray(value)
      ? validateArray(name, value, validations)
      : validate(name, value, validations[name]);

    setErrors({
      ...errors,
      ...error,
    });
    setRuleMetaData({
      ...ruleMetaData,
      [name]: value,
    });
  };

  const onDelete = (): void => {
    TrackService.trackEvent(`Rule Delete By ID Event`);
    chrome.runtime.sendMessage(
      {
        action: PostMessageAction.DeleteRule,
        data: { id },
      },
      () => navigate("/")
    );
  };

  const formatter = (ruleMetaData) => {
    fields.forEach((field) => {
      for (let name in field.formatters) {
        const formatter = field.formatters[name];
        if (!field.multipleFields) {
          ruleMetaData[name] = formatter(ruleMetaData[name]);
        }
      }
    });
    return ruleMetaData;
  };

  const hasErrors = (error): boolean => {
    let index = 0;
    const keys = Object.keys(error);
    const findError = (item): boolean => {
      if (typeof item === "object" && item) return hasErrors(error[keys[index]]);
      if (Boolean(item)) return true;
      if (typeof error[keys[++index]] !== "undefined") return findError(error[keys[index]]);
      return false;
    };
    return Boolean(findError(error[keys[index]]));
  };

  const onSave = (rule: IRule) => {
    const cloneRuleMetaData = formatter(structuredClone(ruleMetaData));
    const error = validateAll(cloneRuleMetaData);
    const isError = hasErrors(error);
    if (isError) {
      setErrors({
        ...errors,
        ...error,
      });
      return;
    }

    const form: IForm = {
      rule,
      ruleMetaData: {
        ...cloneRuleMetaData,
        name: cloneRuleMetaData.name || `${PageName[cloneRuleMetaData.pageType]}-${+new Date()}`,
        enabled: typeof ruleMetaData.enabled !== "undefined" ? ruleMetaData.enabled : true,
        type: StorageItemType.RULE,
        lastMatchedTimestamp: ruleMetaData.lastMatchedTimestamp || null,
      },
    };
    if (form.rule) {
      // TODO need make it dynamic from UI
      form.rule.condition.isUrlFilterCaseSensitive = false;
      // requestMethods can be undefined when a rule create from "Inject file" or "Modify Request Body" pages
      form.rule.condition.requestMethods =
        ruleMetaData.requestMethods?.length > 0 ? ruleMetaData.requestMethods : undefined;
      if (id) {
        form.rule.id = id;
      }
    }

    chrome.runtime.sendMessage(
      {
        action: mode === FormMode.CREATE ? PostMessageAction.AddRule : PostMessageAction.UpdateRule,
        data: form,
      },
      (data) => {
        if (data?.error) {
          setError(data.info.fieldName, data.info.message);
          return;
        }
        if (mode === FormMode.CREATE) {
          navigate(`/edit/${data.pageType}/${data.id}`);
        }
        toast(<Toast />);
      }
    );
  };

  const getDefaultData = () => {
    let defaultValues: { [key: string]: string | string[] } = {
      pageType: pageType,
    };
    fields.forEach((field) => {
      if (field.multipleFields) {
        defaultValues = {
          ...defaultValues,
          ...structuredClone(field.defaultValues),
        };
        return;
      }
      defaultValues[field.name] = field.defaultValue;
    });
    return defaultValues;
  };

  useEffect(() => {
    const search = location.search;
    const urlSearchParams = new URLSearchParams(search);
    if (mode === FormMode.CREATE && !location.state?.template) {
      const defaultValues = getDefaultData();
      setRuleMetaData({
        ...ruleMetaData,
        ...defaultValues,
        source: urlSearchParams.get("source") || (defaultValues.source as string),
        name: urlSearchParams.get("name") || (defaultValues.name as string),
      });
    }
    if (mode === FormMode.UPDATE) {
      chrome.runtime.sendMessage(
        {
          action: PostMessageAction.GetRuleById,
          data: { id },
        },
        ({ ruleMetaData }) => setRuleMetaData(ruleMetaData)
      );
      return;
    }
  }, []);

  useEffect(() => {
    if (location.state?.ruleMetaData) {
      setRuleMetaData(location.state.ruleMetaData);
    }
  }, [location.state?.template, location.state?.ruleMetaData?.id]);

  if (mode === FormMode.UPDATE && !Object.keys(ruleMetaData).length) {
    return null;
  }

  return (
    <Forms
      ruleMetaData={ruleMetaData}
      onChange={onChange}
      error={errors}
      onDelete={onDelete}
      onSave={onSave}
      mode={mode}
      pageType={getPageType(mode)}
      template={location.state?.template}
    />
  );
};

export default FormHOC;

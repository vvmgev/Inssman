import BackButton from "@options/components/common/backButton/backButton";
import Button from "@options/components/common/button/button";
import Section from "@options/components/common/section/section";
import Icon from "@options/components/common/icon/icon";
import Input from "@options/components/common/input/input";
import Sources from "@/options/pages/forms/components/sources/sources";
import Toast from "@options/components/common/toast/toast";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { FormMode, IconsMap, PageName } from "@/models/formFieldModel";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { StorageItemType } from "@/models/storageModel";
import { PostMessageAction } from "@/models/postMessageActionModel";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const getPageType = (mode: FormMode): string => {
  const pathArr = location.href.split("/");
  return mode === FormMode.CREATE ? pathArr[pathArr.length - 1] : pathArr[pathArr.length - 2];
};

const FormHOC = (FormComponent) => {
  return (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const methods = useForm({ mode: "onChange" });
    const [error, setError] = useState();
    const id = params.id ? Number(params.id) : null;
    const mode = id ? FormMode.UPDATE : FormMode.CREATE;
    const pageType = getPageType(mode);

    const setFormValues = (ruleMetaData) => {
      Object.entries(ruleMetaData).forEach(([key, value]) => {
        methods.setValue(key, value);
      });
    };

    const onSubmitHandler = (fields) => {
      fields.pageType = fields.pageType ? fields.pageType : pageType;

      const ruleMetaData = {
        ...fields,
        id,
        name: fields.name || `${PageName[pageType]}-${+new Date()}`,
        enabled: typeof fields.enabled !== "undefined" ? fields.enabled : true,
        type: StorageItemType.RULE,
        lastMatchedTimestamp: fields.lastMatchedTimestamp || null,
      };

      chrome.runtime.sendMessage(
        {
          action: mode === FormMode.CREATE ? PostMessageAction.AddRule : PostMessageAction.UpdateRule,
          data: { ruleMetaData },
        },
        (ruleMetaData) => {
          if (ruleMetaData.error) {
            setError(ruleMetaData.info.message);
            return;
          }
          if (mode === FormMode.CREATE) {
            navigate(`/edit/${pageType}/${ruleMetaData.id}`);
          } else {
            getRuleMetaData();
          }
          toast(<Toast />);
        }
      );
    };

    const getRuleMetaData = () => {
      chrome.runtime.sendMessage(
        {
          action: PostMessageAction.GetRuleById,
          data: { id },
        },
        ({ ruleMetaData }) => setFormValues(ruleMetaData)
      );
    };

    useEffect(() => {
      if (mode === FormMode.UPDATE) {
        getRuleMetaData();
      }
    }, []);

    useEffect(() => {
      const { template, ruleMetaData } = location.state || {};
      if (template) {
        setFormValues(ruleMetaData);
      }
    }, [location.state]);

    return (
      <FormProvider {...methods}>
        <Section classes="flex justify-between px-2 py-4 border-0 border-b border-r bg-slate-800 bg-opacity-40">
          <BackButton url="/" text="Rules" />
          <span className="flex flex-col items-center">
            <span className="text-md">{mode === "create" ? "Create New Rule" : "Edit Rule"}</span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <span className="w-4">{IconsMap[pageType]}</span>
              {PageName[pageType]}
            </span>
          </span>
          <div className="flex gap-5">
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() =>
                  chrome.tabs.create({
                    url: `https://github.com/vvmgev/Overrider#${pageType}`,
                  })
                }
                trackName="View Example"
              >
                View Example
              </Button>
            </div>
            {mode === "update" && (
              <Button
                variant="outline"
                trackName="Delete rule edit mode"
                className="hover:border-red-400 hover:text-red-400"
                type="button"
                onClick={alert}
                startIcon={<Icon name="trash" />}
              >
                Delete
              </Button>
            )}
            <div>
              <Button
                startIcon={<Icon name="pencil" />}
                trackName={`${PageName[pageType]} Rule Create Event`}
                onClick={methods.handleSubmit(onSubmitHandler)}
              >
                {mode === "create" ? "Create" : "Edit"}
              </Button>
            </div>
          </div>
        </Section>
        <Section classes="px-2 py-4 border-0 border-b border-r bg-slate-800 bg-opacity-40">
          <div className="text-red-500 text-md">{error}</div>
          <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
            <div className="w-1/4">
              <Controller
                name="name"
                control={methods.control}
                render={({ field, fieldState }) => {
                  return <Input placeholder="Rule Name" {...field} error={fieldState.error?.message} />;
                }}
              />
            </div>
            <Sources />
            <FormComponent {...props} />
            <input type="submit" className="hidden" />
          </form>
        </Section>
      </FormProvider>
    );
  };
};

export default FormHOC;

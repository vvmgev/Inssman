import SourceFields from "@options/components/common/source/sourceFields";
import Destination from "@options/components/common/destination/destination";
import QueryParamFields from "@options/components/common/queryParamFields/queryParamFields";
import ModifyHeaderFields from "../pages/modifyHeader/modifyHeaderFields";
import Select from "@options/components/common/select/select";
import Editor from "@options/components/common/editor/editor";
import InjectFileSources from "@options/components/common/InjectFileSources/InjectFileSources";
import Input from "@options/components/common/input/input";
import FormContextProvider from "@context/formContext";
import config from "./config";
import { EditorLanguage, FormMode, HeaderModificationType, QueryParamAction } from "@models/formFieldModel";
import { Fragment, useMemo, PropsWithChildren, FC } from "react";
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation;

type Props = PropsWithChildren<{
  // FIXME: the type
  ruleMetaData: any;
  onChange: Function;
  error: Record<string, string | null>;
  mode: FormMode;
  pageType: string;
}>;

const FormBuilder: FC<Props> = ({ ruleMetaData, onChange, error, pageType }) => {
  const { fields } = config[pageType];

  const generateField = (field: any) => {
    switch (field.type) {
      case "input":
        return (
          <div className="w-1/5">
            <Input
              name={field.name}
              value={ruleMetaData.name || field.defaultValue}
              onChange={(e) => onChange(e, field)}
              placeholder={field.placeholder}
              error={error?.name}
            />
          </div>
        );
      case "sourceFields":
        return (
          <div className="flex items-center w-full mt-5">
            {/* <SourceFields
              matchType={ruleMetaData.matchType || field.defaultValues.matchType}
              requestMethods={ruleMetaData.requestMethods || field.defaultValues.requestMethods}
              resourceTypes={ruleMetaData.resourceTypes || field.defaultValues.resourceTypes}
              onChange={(e) => onChange(e, field)}
              source={ruleMetaData.source || field.defaultValues.source}
              error={error}
              showFields={ruleMetaData.showFields || field.defaultValues.showFields}
              {...field.props}
            /> */}
          </div>
        );
      case "destination":
        return (
          <div className="flex items-center mt-5">
            <div className="min-w-[100px]">Redirect to</div>
            <div className="w-3/5">
              <Destination
                value={ruleMetaData.destination || field.defaultValue}
                onChange={(e) => onChange(e, field)}
                error={error?.destination}
                matchType={ruleMetaData.matchType}
              />
            </div>
          </div>
        );
      case "queryParamFields":
        return (
          <>
            <div className="w-full">
              <QueryParamFields
                queryParams={ruleMetaData.queryParams || []}
                onChangeParam={(e, index) => onChangeParam(e, index, field)}
                onRemove={(e, index) => onRemoveQueryParam(e, index, field)}
                error={error}
              />
            </div>
            <div
              className="inline-block px-4 py-2 mt-5 border rounded cursor-pointer border-slate-500 text-slate-200"
              onClick={() => onAddQueryParam(field)}
            >
              Add
            </div>
          </>
        );
      case "modifyHeaderFields":
        return (
          <>
            <ModifyHeaderFields
              onChangeHeader={(e, index) => onChangeHeader(e, index, field)}
              headers={ruleMetaData.headers || []}
              onRemoveHeader={(e, index) => onRemoveHeader(e, index, field)}
              error={error}
            />
            <div
              className="inline-block px-4 py-2 mt-5 border rounded cursor-pointer border-slate-500 text-slate-200"
              onClick={() => onAddHeader(field)}
            >
              Add
            </div>
          </>
        );
      case "editorLang":
        return (
          <div className="flex items-center mt-5">
            <span className="mr-5">Response Type</span>
            <div className="w-[150px]">
              <Select
                onChange={(e) => onChange(e, field)}
                value={ruleMetaData.editorLang || field.defaultValue}
                options={editorLangOptions}
                name="editorLang"
              />
            </div>
          </div>
        );
      case "editor":
        return (
          <div className="mt-5">
            <Editor
              value={ruleMetaData.editorValue}
              language={ruleMetaData.editorLang || field.defaultValue}
              onChange={(e) => onChange(e, field)}
            />
          </div>
        );
      case "injectFileSources":
        return <InjectFileSources ruleMetaData={ruleMetaData} onChange={(e) => onChange(e, field)} error={error} />;
      default:
        break;
    }
  };

  const editorLangOptions = useMemo(
    () =>
      Object.entries(EditorLanguage).reduce((previous: any, [value, label]: any) => {
        previous.push({ value: value.toLowerCase(), label });
        return previous;
      }, []),
    []
  );

  const onAddHeader = (field) => {
    onChange(
      {
        target: {
          name: "headers",
          value: [
            ...ruleMetaData.headers,
            {
              header: "",
              operation: HeaderOperation.SET,
              value: "",
              type: HeaderModificationType.REQUEST,
            },
          ],
        },
      },
      field
    );
  };

  const onRemoveHeader = (_, index, field) => {
    onChange(
      {
        target: {
          name: "headers",
          value: ruleMetaData.headers.filter((_, headerIndex) => headerIndex !== index),
        },
      },
      field
    );
  };

  const onChangeHeader = (event, index, fleld) => {
    const newHeaders = [...ruleMetaData.headers];
    newHeaders[index][event.target.name] = event.target.value;
    onChange({ target: { name: "headers", value: newHeaders } }, fleld);
  };

  const onAddQueryParam = (field) => {
    onChange(
      {
        target: {
          name: "queryParams",
          value: [...ruleMetaData.queryParams, { key: "", value: "", action: QueryParamAction.ADD }],
        },
      },
      field
    );
  };

  const onChangeParam = (event, index, field) => {
    const newQueryParams = [...ruleMetaData.queryParams];
    newQueryParams[index][event.target.name] = event.target.value;
    onChange({ target: { name: "queryParams", value: newQueryParams } }, field);
  };

  const onRemoveQueryParam = (_, deletingIndex, field) => {
    onChange(
      {
        target: {
          name: "queryParams",
          value: ruleMetaData.queryParams.filter((_, index) => index !== deletingIndex),
        },
      },
      field
    );
  };

  return (
    <>
      <FormContextProvider pageType={pageType}>
        {fields.map((field) => (
          <Fragment key={field.id}>{generateField(field)}</Fragment>
        ))}
      </FormContextProvider>
    </>
  );
};

export default FormBuilder;

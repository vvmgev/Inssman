import { useCallback, useMemo, PropsWithChildren } from "react";
import { MatchType } from "@models/formFieldModel";
import Input from "@options/components/common/input/input";
import Select from "@options/components/common/select/select";
import Tooltip from "@options/components/common/tooltip/tooltip";
import InfoSVG from "@assets/icons/info.svg";
import AdjustmentVerticalSVG from "@assets/icons/adjustmentVertical.svg";
import RequestMethod = chrome.declarativeNetRequest.RequestMethod;
import ResourceType = chrome.declarativeNetRequest.ResourceType;

type Props = PropsWithChildren<{
  source: string;
  onChange: Function;
  matchType: MatchType;
  error: { [key: string]: string };
  requestMethods: RequestMethod[];
  resourceTypes: ResourceType[];
  showRequestMethods: boolean;
  showResourceTypes: boolean;
  sourceProps: { [key: string]: unknown };
  matchTypeProps: { [key: string]: unknown };
  requestMethodsProps: { [key: string]: unknown };
  resourceTypesProps: { [key: string]: unknown };
  showAllButton: boolean;
  showFields: boolean;
}>;

const SourceFields = ({
  source,
  onChange,
  matchType,
  error,
  requestMethods = [],
  resourceTypes = [],
  showRequestMethods = true,
  showResourceTypes = true,
  sourceProps = {},
  matchTypeProps = {},
  requestMethodsProps = {},
  resourceTypesProps = {},
  showAllButton = false,
  showFields = false,
}: Props) => {
  const matchTypeOptions = useMemo(
    () =>
      Object.entries(MatchType).reduce((previous: any, [value, label]: any) => {
        previous.push({ value: value.toLowerCase(), label });
        return previous;
      }, []),
    []
  );

  const requestMethodOptions = useMemo(
    () =>
      Object.entries(RequestMethod).reduce(
        (previous: any, [value, label]: any) => {
          previous.push({ value: value.toLowerCase(), label });
          return previous;
        },
        []
      ),
    []
  );

  const resourceTypeOptions = useMemo(
    () =>
      Object.entries(ResourceType).reduce(
        (previous: any, [value, label]: any) => {
          previous.push({
            value: value.toLowerCase(),
            label: label.replace("_", " "),
          });
          return previous;
        },
        []
      ),
    []
  );

  const placeholders = useMemo(
    () => ({
      [MatchType.EQUAL]: "e.g http://google.com",
      // [MatchType.REGEXP]: 'e.g ^http(s):\/\/example\.com\/?$',
      [MatchType.WILDCARD]: "e.g. *://google.com/*",
      [MatchType.CONTAIN]: "e.g google",
    }),
    []
  );

  const applyToAllHandler = () => {
    // onChange({target: {name: 'matchType', value: MatchType.WILDCARD}});
    // onChange({target: {name: 'source', value: '*'}});
  };
  const toggleFields = useCallback(
    () => onChange({ target: { name: "showFields", value: !showFields } }),
    [showFields]
  );

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center w-full">
        <div className="min-w-[100px]">If Request</div>
        <div className="min-w-[100px]">
          <Select
            onChange={onChange}
            value={matchType}
            options={matchTypeOptions}
            name="matchType"
            error={error?.matchType}
            {...matchTypeProps}
          />
        </div>
        <div className="ml-5 w-2/4">
          <Input
            value={source}
            name="source"
            onChange={onChange}
            placeholder={placeholders[matchType]}
            error={error?.source}
            {...sourceProps}
          />
        </div>
        {showRequestMethods && showResourceTypes && (
          <div className="ml-1" onClick={toggleFields}>
            <span
              className={`w-[35px] cursor-pointer inline-block ${
                showFields && "text-sky-500"
              } hover:text-sky-500`}
            >
              <AdjustmentVerticalSVG />
            </span>
          </div>
        )}
        {showAllButton && (
          <div className="ml-5 w-1/4" onClick={applyToAllHandler}>
            <div className="border inline-block border-slate-700 rounded py-2 px-4 text-slate-400 cursor-pointer">
              Apply to all URLs
            </div>
          </div>
        )}
      </div>
      <div
        className={`${showFields ? "flex" : "hidden"} w-full ${
          showRequestMethods || showResourceTypes ? "mt-5" : ""
        }`}
      >
        <div className="min-w-[100px]"></div>
        {showRequestMethods && (
          <div className="min-w-[340px] flex items-center gap-1">
            <Select
              onChange={onChange}
              value={requestMethods}
              options={requestMethodOptions}
              name="requestMethods"
              error={error?.requestMethods}
              multiple={true}
              placeholder="Request Method"
              {...requestMethodsProps}
            />
            <Tooltip content="To Apply All Request Methods Leave Empty">
              <span className="w-[35px] cursor-pointer inline-block">
                <InfoSVG />
              </span>
            </Tooltip>
          </div>
        )}
        {showResourceTypes && (
          <div className="ml-5 min-w-[340px] flex items-center gap-1">
            <Select
              onChange={onChange}
              value={resourceTypes}
              options={resourceTypeOptions}
              name="resourceTypes"
              error={error?.resourceTypes}
              multiple={true}
              placeholder="Resource Types"
              {...resourceTypesProps}
            />
            <Tooltip content="To Apply All Resource Types Leave Empty">
              <span className="w-[35px] cursor-pointer inline-block">
                <InfoSVG />
              </span>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default SourceFields;

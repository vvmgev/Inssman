import React, { useMemo } from 'react';
import { MatchType } from '../../../../../models/formFieldModel';
import Input from '../../../common/input/input';
import Select from '../../../common/select/select';

const SourceFields = ({ source, onChangeSource, onChangeMatchType, matchType, sourceProps = {}, matchTypeProps = {} }) => {
  const matchTypeOptions = useMemo(() => Object.entries(MatchType).reduce((previous: any, [value, label]: any) => {
    previous.push({value: value.toLowerCase(), label})
    return previous;
  }, []), []);

  const sourcePlaceholder = useMemo(() => {
    switch(matchType) {
      case MatchType.EQUAL:
        return 'e.g http://google.com';
      case MatchType.REGEXP:
        return 'e.g. /google-([0-9]+)/ig';
      case MatchType.WILDCARD:
        return 'e.g. *://google.com/*';
      case MatchType.CONTAIN:
      default:
        return 'e.g google';
    }
  }, [matchType]);

  return (
    <div className="flex items-center w-full">
      <div className="min-w-[100px]">If Request</div>
      <Select
        onChange={onChangeMatchType}
        value={matchType}
        options={matchTypeOptions}
        name='matchType'
        {...matchTypeProps}
        />
      <div className="ml-5 w-1/3">
        <Input
          value={source}
          name='source'
          onChange={onChangeSource}
          placeholder={sourcePlaceholder}
          {...sourceProps}
          />
      </div>
    </div>
  )
}

export default SourceFields;
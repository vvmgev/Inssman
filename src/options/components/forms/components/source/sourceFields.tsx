import React, { useMemo } from 'react';
import { MatchType } from 'models/formFieldModel';
import Input from 'components/common/input/input';
import Select from 'components/common/select/select';

const SourceFields = ({ source, onChangeSource, onChangeMatchType, onChange, matchType, sourceProps = {}, matchTypeProps = {}, error }) => {
  const matchTypeOptions = useMemo(() => Object.entries(MatchType).reduce((previous: any, [value, label]: any) => {
    previous.push({value: value.toLowerCase(), label})
    return previous;
  }, []), []);

  const placeholders = useMemo(() => ({
    [MatchType.EQUAL]: 'e.g http://google.com',
    [MatchType.REGEXP]: 'e.g. /google-([0-9]+)/ig',
    [MatchType.WILDCARD]: 'e.g. *://google.com/*',
    [MatchType.CONTAIN]: 'e.g http://google.com',
  }), []);

  return (
    <div className="flex items-center w-full">
      <div className="min-w-[100px]">If Request</div>
      <Select
        onChange={onChange}
        value={matchType}
        options={matchTypeOptions}
        name='matchType'
        error={error?.matchType}
        {...matchTypeProps}
        />
      <div className="ml-5 w-2/4">
        <Input
          value={source}
          name='source'
          onChange={onChange}
          placeholder={placeholders[matchType]}
          error={error?.source}
          {...sourceProps}
          />
      </div>
    </div>
  )
}

export default SourceFields;
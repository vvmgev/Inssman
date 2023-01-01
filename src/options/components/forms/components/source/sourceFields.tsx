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
        return 'e.g http://example.com';
      case MatchType.REGEXP:
        return 'e.g. /example-([0-9]+)/ig';
      case MatchType.WILDCARD:
        return 'e.g. *://exmaple.com/*';
      case MatchType.CONTAIN:
      default:
        return 'e.g Example';
    }
  }, [matchType]);

  return (
    <>
      <Select
        onChange={onChangeMatchType}
        value={matchType}
        options={matchTypeOptions}
        name='matchType'
        {...matchTypeProps}
        />
      <Input
        value={source}
        name='source'
        onChange={onChangeSource}
        placeholder={sourcePlaceholder}
        {...sourceProps}
        />
    </>
  )
}

export default SourceFields;
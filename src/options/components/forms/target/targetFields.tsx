import React, { useMemo } from 'react';
import { MatchType } from '../../../../../src/models/formFieldModel';
import Input from '../../common/input/input';
import Select from '../../common/select/select';

const TargetFields = ({ target, onChangeTarget, onChangeMatchType, matchType, targetProps = {}, matchTypeProps = {} }) => {
  const matchTypeOptions = useMemo(() => Object.entries(MatchType).reduce((previous: any, [value, label]: any) => {
    previous.push({value: value.toLowerCase(), label})
    return previous;
  }, []), []);

  const targetPlaceholder = useMemo(() => {
    switch(matchType) {
      case MatchType.EQUAL:
        return 'e.g http://example.com';
      case MatchType.REGEXP:
        return 'e.g. /example-([0-9]+)/ig';
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
        value={target}
        name='target'
        onChange={onChangeTarget}
        placeholder={targetPlaceholder}
        {...targetProps}
        />
    </>
  )
}

export default TargetFields;
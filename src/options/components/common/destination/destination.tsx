import React, { useMemo } from 'react';
import Input from 'components/common/input/input';
import { MatchType } from 'src/models/formFieldModel';

const Destination = ({value, onChange, matchType, error}) => {
    const placeholders = useMemo(() => ({
        [MatchType.EQUAL]: 'e.g http://example.com',
        // [MatchType.REGEXP]: 'e.g http://example.com',
        // [MatchType.WILDCARD]: `e.g http://example.com/${String.fromCharCode(92)}1/${String.fromCharCode(92)}2 (Each backslah with number will be replaced match with *)`,
        [MatchType.CONTAIN]: 'e.g http://example.com',
    }), []);

    return <Input
        value={value}
        name='destination'
        onChange={onChange} 
        placeholder={placeholders[matchType]}
        error={error}
    />
};

export default Destination;
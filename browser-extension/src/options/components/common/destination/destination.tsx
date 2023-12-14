import { useMemo } from "react";
import Input from "components/common/input/input";
import { MatchType } from "src/models/formFieldModel";

const Destination = ({ value, onChange, matchType, error }) => {
  const placeholders = useMemo(
    () => ({
      [MatchType.EQUAL]: "e.g http://example.com",
      // [MatchType.REGEXP]: 'e.g http://example.com',
      [MatchType.WILDCARD]: `e.g http://example.com/$1/$2 (Each * will be replaced with $)`,
      [MatchType.CONTAIN]: "e.g http://example.com",
    }),
    []
  );

  return (
    <Input
      value={value}
      name="destination"
      onChange={onChange}
      placeholder={placeholders[matchType]}
      error={error}
    />
  );
};

export default Destination;

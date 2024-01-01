import { useState } from "react";
import Popup from "reactjs-popup";
import Section from "@options/components/common/section/section";
import Input from "@options/components/common/input/input";

const InputAutocomplete = ({ inputProps, list, id }: any) => {
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const onFocus = () => setInputFocused(true);
  const onBlur = () => setTimeout(() => setInputFocused(false), 400);
  const isMatch = list.find((item) => item.toLowerCase().includes(inputProps.value.toLowerCase()));
  const handleClick = (item) => {
    inputProps.onChange({ target: { name: inputProps.name, value: item } });
    setInputFocused(false);
  };

  return (
    <div className="relative">
      <Popup
        trigger={
          <div>
            <Input {...inputProps} onFocus={onFocus} onBlur={onBlur} />
          </div>
        }
        open={Boolean(inputFocused && inputProps.value.length > 0 && isMatch)}
        position="bottom center"
        contentStyle={{
          background: "transparent",
          border: "none",
          width: "250px",
          boxShadow: "none",
        }}
      >
        <Section classes="rounded-2xl p-0 bg-opacity-70">
          <ul className="max-h-[200px] overflow-y-auto">
            {list.map(
              (item, index) =>
                (inputProps.value === "" || item.toLowerCase().includes(inputProps.value.toLowerCase())) && (
                  <li
                    key={index}
                    onClick={() => handleClick(item)}
                    className="flex items-center border-b cursor-pointer text-slate-300 hover:text-sky-500 last:border-none border-slate-700 border-slate h-9"
                  >
                    <span className="px-4 whitespace-nowrap">{item}</span>
                  </li>
                )
            )}
          </ul>
        </Section>
      </Popup>
    </div>
  );
};
export default InputAutocomplete;

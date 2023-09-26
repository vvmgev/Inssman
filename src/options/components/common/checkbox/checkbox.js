function Checkbox({
  label, onChange, name, ...props
}) {
  const handler = (event) => {
    onChange({
      target: {
        name,
        value: event.target.checked,
      },
    });
  };

  return (
    <div className="flex items-center">
      {label && <label htmlFor="checked-checkbox" className="mr-3">{label}</label>}
      <input onChange={handler} checked id="checked-checkbox" type="checkbox" value="" className="w-4 h-4 text-sky-500 rounded" {...props} />
    </div>
  );
}

export default Checkbox;

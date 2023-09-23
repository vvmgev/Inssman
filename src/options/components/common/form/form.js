import Button from 'components/common/button/button';
import OutlineButton from 'components/common/outlineButton/outlineButton';
import TrashSVG from 'assets/icons/trash.svg';
import PencilSVG from 'assets/icons/pencil.svg';
import { PageName, IconsMap } from 'src/models/formFieldModel';

function Form({
  children, onSubmit, onDelete, error, pageType, mode = 'create',
}) {
  const onSubmitHandler = (event) => {
    event.preventDefault();
    onSubmit();
  };

  const errors = Object.values(error).map((error, index) => {
    if (typeof error === 'string') {
      return <p key={index} className="text-red-500 text-base mb-1">{error}</p>;
    }
    const errors = [];
    for (const index in error) {
      for (const key in error[index]) {
        errors.push(<p key={index + key} className="text-red-500 text-base mb-1">{error[index][key]}</p>);
      }
    }
    return errors;
  });

  return (
    <>
      <div className="flex justify-between mb-3">
        <span className="flex flex-col">
          <span>{mode === 'create' ? 'Create New Rule' : 'Edit Rule'}</span>
          <span className="text-xs gap-1 text-slate-400 flex items-center">
            <span className="w-4">{IconsMap[pageType]}</span>
            {PageName[pageType]}
          </span>
        </span>
        <div className="flex gap-5">
          <div className="flex justify-end">
            <OutlineButton
              onClick={() => chrome.tabs.create({ url: `https://github.com/vvmgev/Overrider#${pageType}` })}
              trackName="View Example"
            >
              View Example
            </OutlineButton>
          </div>
          {mode === 'update' && (
          <OutlineButton
            trackName="Delete rule edit mode"
            classes="hover:border-red-400 hover:text-red-400"
            onClick={onDelete}
            icon={<TrashSVG />}
          >
            Delete
          </OutlineButton>
          )}
          <div>
            <Button
              icon={<PencilSVG />}
              trackName={`${PageName[pageType]} Rule Create Event`}
              onClick={onSubmit}
            >
              {mode === 'create' ? 'Create' : 'Edit'}
            </Button>
          </div>
        </div>
      </div>
      {errors}
      <form onSubmit={onSubmitHandler}>
        {children}
        <input type="submit" className="hidden" />
      </form>
    </>
  );
}

export default Form;

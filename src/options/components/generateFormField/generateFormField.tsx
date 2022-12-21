// import React from 'react';
// import Input from '../common/input/input';
// import Button from '../common/button/button';
// import Select from '../common/select/select';
// import Editor from '../editor/editor';


// export const generateField = (field: any) => {
//   switch (field.type) {
//       case 'text':
      // return <Input
      //     type={field.type}
      //     value={state[field.name]?.value}
      //     name={field.name}
      //     classes={field.classes}
      //     error={state[field.name]?.error}
      //     placeholder={(field.placeholders && field.placeholders[MatchType[state.matchType?.value]]) || field.placeholder}
      //     onChange={onChangeField}/>
//       case 'select':
//       return <Select
//           value={state[field.name] || field.defaultValue}
//           classes={field.classes}
//           name={field.name}
//           options={field.options}
//           onChange={onChangeField}
//       />
//       case 'link':
//       return <Link
//           className={field.classes}
//           to={field.to}
//           state={{
//               formType,
//               value: state.editor?.value,
//               language: state.editor?.language
//           }}
//           >{field.label}</Link>
//       case 'editor':
//           return <Editor
//           onChange={onChangeField}
//           language={state.language?.value || ''}
//           value={state[field.name]?.value || field.defaultValue }
//           />
//       case 'break':
//       return <br/>
//   }
// }
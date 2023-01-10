// import React, { useState, useEffect } from 'react';
// import { useParams } from "react-router-dom";
// import { FormMode, MatchType, MatchTypeMap } from 'models/formFieldModel';
// import { PostMessageAction } from 'models/postMessageActionModel';
// import Input from 'components/common/input/input';
// import { makeExactMatch, replaceAsterisk } from 'options/utils';
// import Form from '../components/form/form';
// import SourceFields from '../components/source/sourceFields';
// import RuleActionType = chrome.declarativeNetRequest.RuleActionType

// const ReplaceForm = () => {
//   const params = useParams();
//   const id = params.id ? Number(params.id) : null;
//   const mode = id ? FormMode.UPDATE : FormMode.CREATE;
//   const [source, setSource] = useState<string>('');
//   const [matchType, setMatchType] = useState<MatchType>(MatchType.CONTAIN);
//   const [name, setName] = useState<string>('');
//   const onChangeSource = event => setSource(event.target.value);
//   const onChangeMatchType = event => setMatchType(event.target.value);
//   const onChangeName = event => setName(event.target.value);
//   const onSubmit = () => {
//     const form: any = {
//       action: mode === FormMode.CREATE ? PostMessageAction.AddRule : PostMessageAction.UpdateRule,
//       data: {
//         rule: {
//           action: {
//             type: RuleActionType.REDIRECT,
//             redirect: {
//               regexSubstitution: source
//               // [destination.match(backslashNumber) ? 'regexSubstitution' : 'url']: addProtocol(destination),

//             }
//           },
//           condition: {
//             [MatchTypeMap[matchType]]: source
//           }
//         },
//         ruleData: {
//           name,
//           matchType,
//           source,
//         },
//       }
//     };
//     if (id) {
//       form.data.rule.id = id;
//     }
//     if (matchType === MatchType.EQUAL) {
//       form.data.rule.condition[MatchTypeMap[matchType]] = makeExactMatch(source);
//     }
//     if (matchType === MatchType.WILDCARD) {
//       form.data.rule.condition[MatchTypeMap[matchType]] = replaceAsterisk(source);
//     }
//     chrome.runtime.sendMessage(form);
//   };

//   useEffect(() => {
//     if(mode === FormMode.UPDATE) {
//       chrome.runtime.sendMessage({
//         action: PostMessageAction.GetRuleById,
//         id,
//       }, (data) => {
//         setSource(data.original.source);
//         setMatchType(data.matchType);
//         setName(data.name)
//       });
//     }
//   }, []);

//   return <>
//           <Form onSubmit={onSubmit} mode={mode}>
//             <Input
//                 value={name}
//                 name='name'
//                 onChange={onChangeName} 
//                 placeholder='Name'
//               />
//             <SourceFields
//               matchType={matchType}
//               onChangeMatchType={onChangeMatchType}
//               source={source}
//               onChangeSource={onChangeSource}
//             />
//             <Input
//               name='Replace'
//               onChange={() => {}} 
//               placeholder='Replace'
//             />
//             <Input
//               name='With'
//               onChange={() => {}} 
//               placeholder='With'
//             />
//            </Form>
//     </>
// };

// export default ReplaceForm;
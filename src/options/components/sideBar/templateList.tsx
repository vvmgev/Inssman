import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { paths } from '../app/paths';
import { templates } from '../app/templates';

const TemplateList = () => {
  const location = useLocation();
  const templateId = location.state?.ruleMetaData?.id;
  return <ul>
    <li className="pl-2 mb-2 text-slate-400"><div>Templates</div></li>
    {paths.map(({icon, path}) => {
      const ruleTemplates = templates[path]
      if(!ruleTemplates) return null;
      return ruleTemplates.map((template) => {
        return <li className="pl-2 mb-2" key={template.id}>
          <Link to={`/template/${path}`} state={{ ruleMetaData: template, template: true}}>
          <div className={`${templateId === template.id ? 'text-sky-500' : ''} flex items-center hover:text-sky-500 gap-2`}>
            <span className="min-w-[24px]">{icon}</span>
            <span>{template.name}</span></div>
          </Link>
        </li> 
      })
    })}
  </ul>
};

export default TemplateList;
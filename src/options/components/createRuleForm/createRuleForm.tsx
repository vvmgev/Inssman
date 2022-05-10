import React, { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { formConfig } from './config';
import { RULETYPE } from '../../../models/formField';
import Input from '../common/input/input';
import Button from '../common/button/button';

    export default () => {
    const [data, setData] = useState({});
    const location: any = useLocation();
    const { type } = location.state
    const config = formConfig[RULETYPE[type]];

    const setState = (event) => {
        setData(data => {
            return {
                ...data,
                [event.target.name]: event.target.value,
            }
        });
    }

    const submitForm = useCallback((e) => {
        e.preventDefault();
        console.log(e.target.elements)
        const data = e.target.elements.reduce((prev, current) => ({...prev, [current.name]: current.value}), {})
        console.log(data)
    }, [])


    const generateField = (field: any) => {

        switch (field.type) {
            case 'text':
            return <Input field={field} value={data[field.name] || ''} onChange={setState}/>
        }
    }

    return <>
        <div className="w-full p-4 text-base rounded-lg rounded-bl-none rounded-br-none border-b-2 bg-gray-100 mb-5 ">Create New Rule</div>
        <div className="p-3">
            <form onSubmit={submitForm}>
                {config.fields.map(field => <div key={field.id}>{generateField(field)}</div>)}
                <Button>Create</Button>
            </form>
        </div>
    </>
}
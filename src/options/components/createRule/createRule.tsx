import React from 'react';
import Button from '../common/button/button';
import { Link } from 'react-router-dom'

interface IPops {
    rule: string[];
    key?: number;
}

const CreateRule = ({ rule : [rule, ruleName] } : IPops) => {
    return <div className="border-2 border-gray-200 text-center rounded-lg p-5 w-80 mb-5 hover:shadow-2xl transition ease-in-out duration-300">
        <div className="mt-2 text-sm">{ruleName}</div>
        <div className="mt-10">
            <Link to="/create-rule" state={{formType: rule}}>
                <Button>Create</Button>
            </Link>
        </div>
    </div>
}

export default CreateRule;
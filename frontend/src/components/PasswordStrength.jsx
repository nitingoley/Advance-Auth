import React from 'react'
import { Check, X } from 'lucide-react'

const PasswordCriteria = ({ password }) => {
    const criteria = [
        { label: "At least 6 characters", met: password.length >= 6 },
        { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
        { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
        { label: "Containsa number", met: /\d/.test(password) },
    ];
    return (
        <div className='mt-2 space-y-1'>
            {criteria.map((item) => (
                <div key={item.label} className='flex items-center text-xs'>{item.met ?
                    (
                        <Check className='size-4 text-blue-500 mr-2' />) : (
                        <X className='size-4 text-gray-500 mr-2' />
                    )}

                    <span className={item.met ? "text-blue-500" : "text-gray-500"}>{item.label}</span>
                </div>
            ))}
        </div>
    );
};


const PasswordStrength = ({ password }) => {
    const getStrength = (pass) => {
		let strength = 0;
		if (pass.length >= 6) strength++;
		if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
		if (pass.match(/\d/)) strength++;
		if (pass.match(/[^a-zA-Z\d]/)) strength++;
		return strength;
    };
    const strength = getStrength(password);

    const getColor = (strength) => {
        if (strength === 0)
            return "bg-red-500";
        if (strength === 1)
            return "bg-yellow-400";
        if (strength === 2)
            return "bg-green-500";
        if (strength === 3)
            return "bg-blue-400";

        return "bg-blue-600";
    }

    const getStrengthText = (strength) => {
        if (strength === 0)
            return "Very Poor";
        if (strength === 1)
            return "Poor";
        if (strength === 2)
            return "Fair";
        if (strength === 3)
            return "Good";
        return "Strong";
    }


    return (
        <div className='mt-2'>
            <div className="flex justify-between items-center">
                <span className='text-xs text-gray-400'>password strength</span>
                <span className='text-xs text-gray-400'>{getStrengthText(strength)}</span>
            </div>

            <div className='flex space-x-1 pt-2'>
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className={`h-1 w-1/4 rounded-full transition-colors duration-300 
                ${index < strength ? getColor(strength) : "bg-gray-600"}
              `}
                    />
                ))}


            </div>
            <PasswordCriteria password={password} />
        </div>
    )
}

export default PasswordStrength

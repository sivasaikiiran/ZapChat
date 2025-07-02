import React, { useId } from 'react'
import { useRef } from 'react'

const Input = React.forwardRef(function Input({
    name,
    type = "text",
    placeholder = "",
    defaultValue = "",
    label = "",
    disabled = "false",
    ...props
}, ref) {

    const id = useId();

    return (
        <div className='flex flex-col p-1 gap-1 font-bold mt-5'>
            {label && <label htmlFor={id}>{label}</label>}
            <input
                ref={ref}
                id={id}
                type={type}
                name={name}
                placeholder={placeholder}
                defaultValue={defaultValue}
                {...props}
                autoComplete='off'
            />
        </div>
    )
})

export default Input

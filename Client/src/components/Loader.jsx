import React from 'react'
import { Discuss } from 'react-loader-spinner'
const Loader = () => {
    return (
        <div className='bg-slate-700 flex justify-center items-center h-screen w-screen'>
            <Discuss
                ariaLabel="loading"
                height={100}
                width={100}
            />
        </div>
    )
}

export default Loader

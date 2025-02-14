'use client'

import { FC, useState } from 'react'
import ToolButton from './ToolButton'

interface Props {
    onSubmit(link: string) : void
}

const LinkForm: FC<Props> = ({onSubmit}) => {
    const [showForm, setShowForm] = useState(false)
    const [link, setLink] = useState('')

    return <div className='relative'>
        <ToolButton onClick={() => setShowForm(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 0 0-7.071-7.071L9.878 7.05L8.464 5.636l1.414-1.414a7 7 0 0 1 9.9 9.9zm-2.829 2.828l-1.414 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 0 0 7.07 7.071l1.415-1.414zm-.707-10.607l1.415 1.415l-7.072 7.07l-1.414-1.414z"/></svg>
        </ToolButton>
        {showForm && 
            <div className='absolute top-0 z-50 ring-1 ring-black p-2 rounded flex items-center shadow-sm bg-white outline-none'>
                <input value={link} onChange={({target}) => setLink(target.value)} onBlur={() => setShowForm(false)} type="text" placeholder='https://url.com' className='outline-none' />
                <button 
                    onClick={()=> {
                        setLink("")
                        setShowForm(false)
                    }}
                    onMouseDown={()=> {
                        onSubmit(link)
                    }}
                    type='button'
                    className='bg-white ml-1'
                >
                        ok
                </button>
            </div>
        }
    </div>
}

export default LinkForm
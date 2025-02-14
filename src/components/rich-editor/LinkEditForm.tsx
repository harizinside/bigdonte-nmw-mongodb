'use client'

import { FC, useEffect, useState } from 'react'
import ToolButton from './ToolButton'

interface Props {
    initialState?: string
    onSubmit(link: string) : void
}

const LinkEditorForm: FC<Props> = ({initialState, onSubmit}) => {
    const [showForm, setShowForm] = useState(false)
    const [link, setLink] = useState('')

    useEffect(() => {
        if(initialState)setLink(initialState)
    }, [initialState])

    return <div>
            <div className='absolute top-10 z-50 ring-1 ring-black p-2 rounded flex items-center shadow-sm bg-white outline-none'>
                <input value={link} onChange={({target}) => setLink(target.value)} onBlur={() => setShowForm(false)} type="text" placeholder='https://url.com' className='outline-none' />
                <button 
                    onClick={()=> {
                        // setLink("")
                        setShowForm(false)
                    }}
                    onMouseDown={()=> {
                        onSubmit(link)
                    }}
                    type='button'
                    className='bg-black text-white w-8 aspect-square flex justify-center items-center'
                >
                        ok
                </button>
                <button
                    onMouseDown={()=> {
                        onSubmit("")
                    }}
                    type='button'
                    className='bg-red-400 text-white w-8 aspect-square flex justify-center items-center'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M7 2v2H6V2zm2.297.98a2.625 2.625 0 0 1 3.712 3.712l-1.561 1.562l-.707-.707l1.561-1.562a1.625 1.625 0 0 0-2.298-2.298L8.443 5.25l-.707-.707zM3.44 2.732l1.415 1.414l-.708.708l-1.414-1.415zM2 6h2v1H2zm3.379 2.313L3.817 9.874a1.625 1.625 0 0 0 2.298 2.298l1.562-1.561l.707.707l-1.562 1.562A2.625 2.625 0 0 1 3.11 9.167l1.562-1.561zM14 10h-2V9h2zm-2.146 1.146l1.414 1.415l-.707.707l-1.415-1.415zM9 14v-2h1v2z" clip-rule="evenodd"/></svg>
                </button>
            </div>
    </div>
}

export default LinkEditorForm
'use client'
import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { readAllImages } from '../actions/file'

interface Props {
    children: ReactNode
}

interface InitialImageContext {
    images: string[]
    updateImages(images: string[]): void
}

const Context = createContext<InitialImageContext | null>(null)

const ImageProvider: FC<Props> = ({children}) => {
    const[images, setImages] = useState<string[]>([])

    const updateImages = (data: string[]) => {
        setImages([...data, ...images])
    }

    useEffect(() => {
        readAllImages().then(setImages)
    }, [])

    return (
        <Context.Provider value={{images, updateImages}}>
            {children}
        </Context.Provider>
    )
}

export const useImages = () => useContext(Context)

export default ImageProvider
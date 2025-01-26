'use client'
import { Children, FC, ReactNode } from "react"
import ImageProvider from "./context/imageProvider"

interface Props{
    children: ReactNode
}

const Providers: FC<Props> = ({children}) => {
    return <ImageProvider>
        {children}
    </ImageProvider>
}

export default Providers
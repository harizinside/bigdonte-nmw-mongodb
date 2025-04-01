'use client'
import { FC, ReactNode } from "react"
import ImageProvider from "../context/imageProvider"

interface Props {
  children: ReactNode
}

const Providers: FC<Props> = ({ children }) => {
  return (
    // <AuthProvider>
      <ImageProvider>
        {children}
      </ImageProvider>
    // </AuthProvider>
  )
}

export default Providers

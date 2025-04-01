'use client'
import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { readAllImages } from '../actions/file'

interface Props {
    children: ReactNode
}

interface ImageData {
    _id: string
    image: string
}

interface InitialImageContext {
    images: ImageData[]
    updateImages: (images: ImageData[]) => void
    removeOldImage: (id: string) => void
}

const Context = createContext<InitialImageContext | null>(null)

const ImageProvider: FC<Props> = ({ children }) => {
    const [images, setImages] = useState<{ _id: string; image: string }[]>([])
    const webUrl = process.env.NEXT_PUBLIC_API_WEB_URL

    // Update Images harus disesuaikan dengan array objek
    const updateImages = (data: ImageData[] | undefined) => {
        if (!Array.isArray(data)) {
            console.error("updateImages: Invalid data format", data);
            return;
        }
    
        setImages((prevImages) => {
            if (!Array.isArray(prevImages)) {
                console.error("updateImages: Invalid prevImages format", prevImages);
                return prevImages;
            }
    
            // Hindari duplikasi berdasarkan _id
            const newImages = data.filter(newImg => newImg && !prevImages.some(img => img._id === newImg._id));
            return [...newImages, ...prevImages];
        });
    };    

    // Hapus image berdasarkan _id
    const removeOldImage = (_id: string) => {
        setImages((oldImages) => oldImages.filter((img) => img._id !== _id))
    }

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const allImages = await readAllImages()

                if (!Array.isArray(allImages)) {
                    console.error("Invalid media format:", allImages)
                    return
                }

                const baseUrl = webUrl

                const imageData: ImageData[] = allImages.map((item: { _id: string; image: string }) => ({
                    _id: item._id,
                    image: item.image.startsWith("http") ? item.image : `${baseUrl}${item.image}`,
                }))

                updateImages(imageData) // Memastikan data terbaru dimasukkan tanpa duplikasi
            } catch (error) {
                console.error("Error fetching images:", error)
            }
        }

        fetchImages()

        // **Polling untuk update otomatis setiap 5 detik**
        const interval = setInterval(() => {
            fetchImages()
        }, 5000) // Sesuaikan dengan kebutuhan

        return () => clearInterval(interval) // Hapus interval saat unmount
    }, [])

    return (
        <Context.Provider value={{ images, updateImages, removeOldImage }}>
            {children}
        </Context.Provider>
    )
}

export const useImages = () => {
    const context = useContext(Context)
    if (!context) {
        throw new Error("useImages must be used within an ImageProvider")
    }
    return context
}

export default ImageProvider
import { FC, useState } from "react"
import { FileUploader } from "react-drag-drop-files";
import GalleryImage from "../GalleryImage/page";
import { uploadFile } from "@/app/actions/file";
import { useImages } from "@/app/context/imageProvider";

interface Props {
    visible: boolean;
    onClose(state: boolean): void
    onSelect?(src: string): void
    // onDelete?(src: string): void
}

const ImageGallery: FC<Props> = ({visible, onClose, onSelect}) => {
    const [isUploading, setIsUploading] = useState(false)
    const image = useImages()
    const images = image?.images
    const updateImages = image?.updateImages

    const handleClose = () => {
        onClose(!visible)
    }

    const handleSelection = (image: string) => {
        onSelect && onSelect(image)
        handleClose()
    }

    if(!visible) return null

    return <div 
        tabIndex={-1}
        onKeyDown={({key}) => {
        if(key === "Escape") handleClose()
    }} className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
        <div className="relative md:w-[760px] w-[80%] h-[80%] bg-white rounded-md p-4 overflow-y-auto">
            <div className="absolute right-4 top-4 p-2 z-50">
                <button onClick={handleClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 7l10 10M7 17L17 7"/></svg>
                </button>
            </div>
            <FileUploader 
                handleChange={async (file: File) => {
                    setIsUploading(true)
                    try {
                        const formData = new FormData()
                        formData.append("file", file)
                        const res = await uploadFile(formData)
                        if(res && updateImages){
                            updateImages([res.secure_url])
                        }
                    } catch (error) {
                        console.log(error)
                    }
                    
                    setIsUploading(false)
                }}
                name="file"
                types={["png", "jpg", "svg", "jpeg", "webp"]}
            >
                
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Image File</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" />
                    </label>
                </div> 

            </FileUploader>

            {!images?.length ? <p className="my-2 text-center text-sm text-gray-500 dark:text-gray-400">No Images to Render...</p> : null}

            <div className="grid gap-4 md:grid-cols-4 grid-cols-2 mt-4">
                {isUploading && (
                    <div className="w-full aspect-square rounded animate-pulse bg-gray-200"></div>
                )}
                {images?.map(item => {
                    return <GalleryImage onSelectClick={() => handleSelection(item)} src={item}/>
                })}
            </div>
        </div>

       

    </div>
}

export default ImageGallery
import { FC } from "react"

interface Props {
    src: string;
    onDeleteClick?(): void
    onSelectClick?(): void
}

const GalleryImage: FC<Props> = () => {
    return <div>
    <div className="relative w-full aspect-square overflow-hidden rounded-md">
        <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
        <div className="absolute flex bottom-0 left-0 right-0">
            <button className="bg-red-500 text-white flex-1 flex items-center justify-center p-2 text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M10 2.25a.75.75 0 0 0-.75.75v.75H5a.75.75 0 0 0 0 1.5h14a.75.75 0 0 0 0-1.5h-4.25V3a.75.75 0 0 0-.75-.75zm0 8.4a.75.75 0 0 1 .75.75v7a.75.75 0 0 1-1.5 0v-7a.75.75 0 0 1 .75-.75m4.75.75a.75.75 0 0 0-1.5 0v7a.75.75 0 0 0 1.5 0z"/><path fill="currentColor" fill-rule="evenodd" d="M5.991 7.917a.75.75 0 0 1 .746-.667h10.526a.75.75 0 0 1 .746.667l.2 1.802c.363 3.265.363 6.56 0 9.826l-.02.177a2.85 2.85 0 0 1-2.44 2.51a27 27 0 0 1-7.498 0a2.85 2.85 0 0 1-2.44-2.51l-.02-.177a44.5 44.5 0 0 1 0-9.826zm1.417.833l-.126 1.134a43 43 0 0 0 0 9.495l.02.177a1.35 1.35 0 0 0 1.157 1.191c2.35.329 4.733.329 7.082 0a1.35 1.35 0 0 0 1.157-1.19l.02-.178c.35-3.155.35-6.34 0-9.495l-.126-1.134z" clip-rule="evenodd"/></svg></button>
            <button className="bg-green-400 text-white flex-1 flex items-center justify-center p-2 text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="m10 15.17l9.192-9.191l1.414 1.414L10 17.999l-6.364-6.364l1.414-1.414z"/></svg></button>
        </div>
    </div>

    
</div>
}

export default GalleryImage
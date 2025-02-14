"use client"

import { FC } from 'react';
import { Props } from 'react-select';
import { EditorProvider,  EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Tools from './Tools';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder';
import ImageGallery from './ImageGallery';
import { useState } from 'react';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';

interface props {}

const extensions = [
    StarterKit, 
    Underline, 
    TextAlign.configure({
        types: ['paragraph'],
    }),
    Link.configure({
        openOnClick: false,
        autolink: false,
        linkOnPaste: true,
        HTMLAttributes: {
            target: ""
        },
    }),
    Image.configure({
        inline: false,
        HTMLAttributes: {
            class: "w-[80%] mx-auto"
        }
    }),
    Placeholder.configure({
        placeholder: "Write Something..."
    })
];

const RichEditor: FC<{ value?: string; onChange: (html: string) => void }> = ({ value, onChange }) => {
    const [showImageGallery, setShowImageGallery] = useState(false)
    const editor = useEditor({
        extensions,
        content: value || "", 
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl w-full dark:text-white focus:outline-none outline-none',
                style: "font-size: 16px; line-height:1.4; max-width:100%; min-height:300px;",
            }
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML()); // ⬅️ Kirim HTML ke state saat teks berubah
        }
        // content: "<h1>Hallo Gais</h1>"
    });

    useEffect(() => {
        if (editor && value !== undefined && value !== editor.getHTML()) {  
            editor.commands.setContent(value || "", false); 
        }
    }, [value, editor]);    

    const onImageSelect = (image: string) => {
        editor?.chain().focus().setImage({src: image, alt: "this is an image"}).run()
    }

    return <>
        <Tools editor={editor} onImageSelection={() => setShowImageGallery(true)}/>
        <div className="flex flex-col mt-3">
            <div className="p-4 w-full rounded-[7px] border-[1.5px] border-stroke dark:border-dark-3 dark:bg-dark-2">
                <EditorContent
                    editor={editor}
                />
            </div>
        </div>
        
        <ImageGallery onSelect={onImageSelect} visible={showImageGallery} onClose={setShowImageGallery}/>
    </>
}

export default RichEditor;
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

interface props {}

const extensions = [
    StarterKit, 
    Underline, 
    TextAlign.configure({
        types: ['paragraph'],
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

const RichEditor: FC<Props> = () => {
    const [showImageGallery, setShowImageGallery] = useState(false)
    const editor = useEditor({
        extensions,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none outline-none'
            }
        },
        // content: "<h1>Hallo Gais</h1>"
    });

    const onImageSelect = (image: string) => {
        editor?.chain().focus().setImage({src: image, alt: "this is an image"}).run()
    }

    return <>
        <Tools editor={editor} onImageSelection={() => setShowImageGallery(true)}/>
        <EditorContent
        editor={editor}
        //  extensions={[StarterKit]} content="Hello World <strong>Yooo</strong>"
          />
        <ImageGallery onSelect={onImageSelect} visible={showImageGallery} onClose={setShowImageGallery}/>
    </>
}

export default RichEditor;
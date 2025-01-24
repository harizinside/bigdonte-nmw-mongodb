"use client"

import { FC } from 'react';
import { Props } from 'react-select';
import { EditorProvider,  EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Tools from './Tools';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
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
    return <>
        <Tools editor={editor} onImageSelection={() => setShowImageGallery(true)}/>
        <EditorContent
        editor={editor}
        //  extensions={[StarterKit]} content="Hello World <strong>Yooo</strong>"
          />
        <ImageGallery visible={showImageGallery} onClose={setShowImageGallery}/>
    </>
}

export default RichEditor;
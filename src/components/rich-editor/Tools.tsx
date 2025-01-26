import { ChangeEventHandler, FC } from 'react';
import ToolButton from './ToolButton';
import { ChainedCommands, Editor } from '@tiptap/react';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

interface Props{
    editor : Editor | null
    onImageSelection?() : void
}

const tools = [
    {
        task: "bold",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M6 4.75c0-.69.56-1.25 1.25-1.25h5a4.752 4.752 0 0 1 3.888 7.479A5 5 0 0 1 14 20.5H7.25c-.69 0-1.25-.56-1.25-1.25ZM8.5 13v5H14a2.5 2.5 0 1 0 0-5Zm0-2.5h3.751A2.25 2.25 0 0 0 12.25 6H8.5Z"/></svg>
    },
    {
        task: "italic",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 1024 1024"><path fill="currentColor" d="M798 160H366c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h181.2l-156 544H229c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h432c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8H474.4l156-544H798c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8"/></svg>
    },
    {
        task: "underline",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16"/></svg>
    },
    {
        task: "strike",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5C9.571 5 8 6.54 8 8c0 .804.28 1.362.865 1.818c.631.492 1.665.897 3.224 1.182H19a1 1 0 1 1 0 2h-2.189c.788.794 1.189 1.803 1.189 3c0 2.958-2.906 5-6 5c-1.998 0-3.827-.814-4.936-2.149a1 1 0 1 1 1.538-1.278C9.285 18.393 10.52 19 12 19c2.429 0 4-1.54 4-3c0-.804-.28-1.362-.865-1.818c-.631-.492-1.665-.897-3.224-1.182H5a1 1 0 1 1 0-2h2.189C6.401 10.206 6 9.197 6 8c0-2.958 2.906-5 6-5c1.477 0 2.852.444 3.915 1.205a1 1 0 0 1-1.164 1.627C14.046 5.327 13.084 5 12 5"/></svg>
    },
    {
        task: "code",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><g fill="none"><path d="M0 0h24v24H0z"/><path fill="currentColor" d="M14.486 3.143a1 1 0 0 1 .692 1.233l-4.43 15.788a1 1 0 0 1-1.926-.54l4.43-15.788a1 1 0 0 1 1.234-.693M7.207 7.05a1 1 0 0 1 0 1.414L3.672 12l3.535 3.535a1 1 0 1 1-1.414 1.415L1.55 12.707a1 1 0 0 1 0-1.414L5.793 7.05a1 1 0 0 1 1.414 0m9.586 1.414a1 1 0 1 1 1.414-1.414l4.243 4.243a1 1 0 0 1 0 1.414l-4.243 4.243a1 1 0 0 1-1.414-1.415L20.328 12z"/></g></svg>
    },
    {
        task: "codeblock",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m1 2v14h16V5zm16 7l-3.535 3.536l-1.415-1.415L17.172 12L15.05 9.879l1.415-1.415zM6.828 12l2.122 2.121l-1.414 1.415L4 12l3.536-3.536L8.95 9.88zm4.416 5H9.116l3.64-10h2.128z"/></svg>
    },
    {
        task: "left",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h14M3 6h18M3 18h14M3 14h18"/></svg>
    },
    {
        task: "center",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M6 10h12M3 6h18M3 14h18M6 18h12"/></svg>
    },
    {
        task: "right",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 10h14M3 6h18M7 18h14M3 14h18"/></svg>
    },
    {
        task: "bulletList",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><g fill="none"><circle cx="4.443" cy="5.081" r="1.331" fill="currentColor"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.123 5.08h11.765"/><circle cx="4.443" cy="12" r="1.331" fill="currentColor"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.123 12h11.765"/><circle cx="4.443" cy="18.919" r="1.331" fill="currentColor"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.123 18.92h11.765"/></g></svg>
    },
    {
        task: "numberList",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M6 2.75a.75.75 0 0 0-1.434-.307l-.002.003l-.011.024l-.056.108a4 4 0 0 1-.238.385c-.217.312-.524.662-.906.901a.75.75 0 1 0 .794 1.272q.188-.117.353-.248V7.25a.75.75 0 1 0 1.5 0zm14.5 16a.75.75 0 0 0-.75-.75h-9a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 .75-.75m0-6.506a.75.75 0 0 0-.75-.75h-9a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 .75-.75m0-6.494a.75.75 0 0 0-.75-.75h-9a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 .75-.75M5.15 10.52c-.3-.053-.676.066-.87.26a.75.75 0 0 1-1.06-1.06c.556-.556 1.43-.812 2.192-.677c.397.07.805.254 1.115.605c.316.358.473.825.473 1.352c0 .62-.271 1.08-.606 1.42c-.278.283-.63.511-.906.689l-.08.051a6 6 0 0 0-.481.34H6.25a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75c0-1.313.984-1.953 1.575-2.337l.06-.04c.318-.205.533-.345.69-.504c.134-.136.175-.238.175-.369c0-.223-.061-.318-.098-.36a.42.42 0 0 0-.251-.12M2.97 21.28s.093.084.004.005l.006.005l.013.013a1.4 1.4 0 0 0 .15.125c.095.071.227.158.397.243c.341.17.83.33 1.46.33c.64 0 1.196-.182 1.601-.54c.408-.36.61-.858.595-1.36a1.78 1.78 0 0 0-.426-1.1c.259-.306.412-.686.426-1.102a1.73 1.73 0 0 0-.595-1.36C6.196 16.182 5.64 16 5 16c-.63 0-1.119.158-1.46.33a2.6 2.6 0 0 0-.51.334l-.037.033l-.013.013l-.006.005l-.002.003H2.97l-.001.002a.75.75 0 0 0 1.048 1.072l.026-.02a1 1 0 0 1 .166-.101c.159-.08.42-.17.79-.17c.36 0 .536.099.608.163a.23.23 0 0 1 .088.187a.33.33 0 0 1-.123.23c-.089.078-.263.17-.573.17a.75.75 0 0 0 0 1.5c.31 0 .484.09.573.167c.091.08.121.166.123.231a.23.23 0 0 1-.088.188c-.072.063-.247.163-.608.163a1.75 1.75 0 0 1-.79-.17a1 1 0 0 1-.192-.122a.75.75 0 0 0-1.048 1.072m.002-4.562c.007-.005.2-.166 0 0"/></svg>
    },
    {
        task: "image",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M19 5v14H5V5zm0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-4.86 8.86l-3 3.87L9 13.14L6 17h12z"/></svg>
    }
] as const

const headingOptions = [
    {task: "p", value: "Paragraph"},
    {task: "h1", value: "Heading 1"},
    {task: "h2", value: "Heading 2"},
    {task: "h3", value: "Heading 3"},
    {task: "h4", value: "Heading 4"}
] as const 

const chainMethods = (editor : Editor | null, command: (chain: ChainedCommands) => ChainedCommands
) => {
    if(!editor) return 
    command(editor?.chain().focus()).run()
}

type TaskType = (typeof tools)[number]["task"]
type HeadingType = (typeof headingOptions)[number]["task"]

const Tools: FC<Props> = ({editor, onImageSelection}) => {

    const handleOnClick = (task: TaskType) => {
        switch (task){
            case "bold":
            return chainMethods(editor, (chain) => chain.toggleBold())
            case "italic":
            return chainMethods(editor, (chain) => chain.toggleItalic())
            case "underline":
            return chainMethods(editor, (chain) => chain.toggleUnderline())
            case "strike":
            return chainMethods(editor, (chain) => chain.toggleStrike())
            case "code":
            return chainMethods(editor, (chain) => chain.toggleCode())
            case "codeblock":
            return chainMethods(editor, (chain) => chain.toggleCodeBlock())
            case "numberList":
            return chainMethods(editor, (chain) => chain.toggleOrderedList())
            case "bulletList":
            return chainMethods(editor, (chain) => chain.toggleBulletList())
            case "left":
            return chainMethods(editor, (chain) => chain.setTextAlign("left"))
            case "right":
            return chainMethods(editor, (chain) => chain.setTextAlign("right"))
            case "center":
            return chainMethods(editor, (chain) => chain.setTextAlign("center"))
            case "image":
            return onImageSelection && onImageSelection();
        }
    }

    const handleHeadingSelection: ChangeEventHandler<HTMLSelectElement> = ({target}) => {
        const {value} = target as {value: HeadingType}

        switch(value){
            case 'p':
                return chainMethods(editor, (chain) => chain.setParagraph()
            )
            case 'h1':
                return chainMethods(editor, (chain) => chain.toggleHeading({level: 1})
            )
            case 'h2':
                return chainMethods(editor, (chain) => chain.toggleHeading({level: 2})
            )
            case 'h3':
                return chainMethods(editor, (chain) => chain.toggleHeading({level: 3})
            )
            case 'h4':
                return chainMethods(editor, (chain) => chain.toggleHeading({level: 4})
            )
        }
    }

    return <div>
        <select className='p-2' name="" id="" onChange={handleHeadingSelection}>
            {headingOptions.map(item => {
                return  <option key={item.task} value={item.task}>
                            {item.value}
                        </option>
            } )}
        </select>
        {tools.map(({icon, task}) => {
            return <ToolButton 
            onClick={() => handleOnClick(task)}
            active={editor?.isActive(task) || editor?.isActive({textAlign: task}) }
            >{icon}</ToolButton>
        })}
    </div>;
}

export default Tools
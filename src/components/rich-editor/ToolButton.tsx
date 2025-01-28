import { FC, ReactNode } from "react"
import clsx from "clsx"

interface Props {
    children: ReactNode
    active?: boolean
    onClick?(): void
}

const ToolButton: FC<Props> = ({children, onClick, active}) => {
    return <button onClick={onClick} className={clsx("p-2 rounded-md", active ? "bg-black text-white dark:bg-white dark:text-black" : "text-black dark:text-white")}>{children}</button>
}

export default ToolButton 
export function ActionButton({
    onClick,
    children,
    className = undefined,
}: {
    onClick: () => void
    children: string
    className?: string | undefined
}) {
    return (
        <button
            className={'action-button' + (className ? ` ${className}` : '')}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

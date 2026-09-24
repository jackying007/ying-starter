import { cn } from '../ui'

export type MenuButtonProps = {
  className?: string
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}

export const MenuButton = ({ className, children, active, disabled, onClick, ...props }: MenuButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        'w-8 h-8 rounded-md p-2 bg-background border border-border cursor-pointer hover:bg-border fc text-base',
        active && 'bg-border',
        disabled && 'opacity-40 hover:bg-transparent cursor-not-allowed',
        className
      )}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

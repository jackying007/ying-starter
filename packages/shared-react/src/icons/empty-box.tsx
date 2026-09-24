import type { IconSvgProps } from './type'

export const EmptyBoxIcon = (props: IconSvgProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="none">
        <path fill="currentColor" d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" opacity="0.16" />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm4-4h8l4 4H4zm0 8h4"
        />
      </g>
    </svg>
  )
}

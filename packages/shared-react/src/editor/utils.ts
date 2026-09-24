import { type JSONContent } from '@tiptap/react'

export function findNodes(node: JSONContent, types: string[]): JSONContent[] {
  const result: JSONContent[] = []
  if (node.type && types.includes(node.type)) {
    result.push(node)
  }
  for (const child of node.content ?? []) {
    result.push(...findNodes(child, types))
  }
  return result
}

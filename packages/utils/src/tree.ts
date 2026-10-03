export function arrayToTree<T>(array: T[] = [], idField = 'id', parentIdFiled = 'parentId') {
  function toTree(parentId: any): (T & { children?: T[] })[] {
    return array
      .filter(el => el[parentIdFiled as keyof T] === parentId)
      .map(el => ({ ...el, children: toTree(el[idField as keyof T]) }))
  }

  return toTree(null)
}

export function flattenTrees<T extends { children?: T[] }>(trees: T[] = []): T[] {
  return trees.reduce<T[]>((prev, cur) => {
    if (cur.children) {
      return prev.concat(cur, ...flattenTrees(cur.children))
    } else {
      return prev.concat(cur)
    }
  }, [])
}

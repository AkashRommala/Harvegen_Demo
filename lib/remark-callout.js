import { visit } from 'unist-util-visit'

export default function remarkCallout() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (!['info', 'warning', 'note', 'resource'].includes(node.name)) return

        const data = node.data || (node.data = {})
        data.hName = 'callout'
        data.hProperties = {
          type: node.name,
          title: node.attributes?.title || ''
        }
      }
    })
  }
}

declare module "react-markdown" {
  import React from "react"
  const ReactMarkdown: React.ComponentType<any>
  export default ReactMarkdown
  export type Components = Record<string, React.ComponentType<any>>
}

declare module "remark-gfm" {
  const plugin: any
  export default plugin
}

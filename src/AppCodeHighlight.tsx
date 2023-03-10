import React, { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-scss'

const AppCodeHighlight = (props: any) => {
  const codeElement = useRef<any>()

  useEffect(() => {
    if (Prism) {
      Prism.highlightElement(codeElement.current)
    }
  }, [])

  return (
    <pre style={props.style}>
      <code ref={codeElement} className={`language-${props.lang}`}>
        {props.children}&nbsp;
      </code>
    </pre>
  )
}

AppCodeHighlight.defaultProps = {
  lang: 'jsx',
  style: null,
}

export default AppCodeHighlight

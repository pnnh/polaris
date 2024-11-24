import React, {useEffect, useState} from 'react'

export function GoTop () {
  const [display, setDisplay] = useState<string>('none')
  const bodyDom = document.getElementsByTagName('body')[0]
  useEffect(() => {
    bodyDom.addEventListener('scroll', (event) => {
      const target = event.target as HTMLBodyElement
      if (target.scrollTop > 200) {
        setDisplay('block')
      } else {
        setDisplay('none')
      }
    }, {passive: true})
  }, [bodyDom])

  return <button style={{display: display}} onClick={() => {
    bodyDom.scrollTop = 0
  }} title="回到顶部">
    <i className="ri-arrow-up-line"></i>
  </button>
}

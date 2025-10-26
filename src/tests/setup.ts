import '@testing-library/jest-dom'

if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => { },
    removeListener: () => { },
    addEventListener: () => { },
    removeEventListener: () => { },
    dispatchEvent: () => false,
  })
}

if (!('ResizeObserver' in window)) {
  window.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
  } as any
}

if (!document.createRange) {
  document.createRange = () => {
    const range = {
      setStart: () => { },
      setEnd: () => { },
      commonAncestorContainer: document.body,
      createContextualFragment: (html: string) => {
        const template = document.createElement('template')
        template.innerHTML = html
        return template.content
      },
      cloneRange: () => range,
      collapse: () => { },
      compareBoundaryPoints: () => 0,
      deleteContents: () => { },
      detach: () => { },
      extractContents: () => document.createDocumentFragment(),
      getBoundingClientRect: () => ({
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        x: 0,
        y: 0,
        toJSON: () => { },
      }),
      getClientRects: () => ({
        length: 0,
        item: () => null,
        [Symbol.iterator]: function* () { },
      }),
      insertNode: () => { },
      selectNode: () => { },
      selectNodeContents: () => { },
      setEndAfter: () => { },
      setEndBefore: () => { },
      setStartAfter: () => { },
      setStartBefore: () => { },
      surroundContents: () => { },
      toString: () => '',
    } as unknown as Range
    return range
  }
}

const originalGetComputedStyle = window.getComputedStyle
window.getComputedStyle = (elt: Element) => originalGetComputedStyle(elt)
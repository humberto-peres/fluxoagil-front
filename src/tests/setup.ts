import '@testing-library/jest-dom'

if (!window.matchMedia) {
  // @ts-ignore
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

if (!('ResizeObserver' in window)) {
  // @ts-ignore
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

if (!document.createRange) {
  // @ts-ignore
  document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: document.body,
    createContextualFragment: (html: string) => {
      const template = document.createElement('template')
      template.innerHTML = html
      return template.content
    },
  })
}

const originalGetComputedStyle = window.getComputedStyle
// @ts-ignore
window.getComputedStyle = (elt: Element) => originalGetComputedStyle(elt)

;(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches

  if (reducedMotion) {
    document.querySelectorAll('.scroll-reveal').forEach(function (element) {
      element.classList.add('revealed')
    })
    return
  }

  var observed = new WeakSet()
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return
        entry.target.classList.add('revealed')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
  )

  function observeWithin(root) {
    var elements = []
    if (root.matches && root.matches('.scroll-reveal')) elements.push(root)
    if (root.querySelectorAll) {
      elements = elements.concat(Array.from(root.querySelectorAll('.scroll-reveal')))
    }

    elements.forEach(function (element) {
      if (observed.has(element)) return
      observed.add(element)
      observer.observe(element)
    })
  }

  observeWithin(document)

  var mutationObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1) observeWithin(node)
      })
    })
  })

  mutationObserver.observe(document.body, { childList: true, subtree: true })
})()

function getQuery (queryStr) {
  const [, query] = queryStr.split('?')
  if (query) {
      return query.split('&').reduce((pre, cur) => {
          const [key, val] = cur.split('=')
          pre[key] = decodeURIComponent(val)
          return pre
      }, {})
  }
  return {}
}
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url

  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL parameter is required',
    })
  }

  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Failed to fetch image',
      })
    }

    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const contentType = response.headers.get('content-type') || 'image/png'
    setResponseHeader(event, 'Content-Type', contentType)
    
    setResponseHeader(event, 'Access-Control-Allow-Origin', '*')
    setResponseHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS')
    setResponseHeader(event, 'Cache-Control', 'public, max-age=3600')

    return buffer
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Proxy error: ' + error.message,
    })
  }
})
export default defineEventHandler((event) => {
  const path = event.path;
  
  if (path === '/v2' || path.startsWith('/v2/') || path.startsWith('/v2?')) {
    const newPath = path.replace(/^\/v2(?=\/|\?|$)/, '') || '/';
    return sendRedirect(event, newPath, 301);
  }
});

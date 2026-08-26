export const getBreadcrumbs = new Proxy({}, { get: (target, prop) => () => [{ label: 'Beranda', to: '/' }] });

const getBreadcrumbs = new Proxy({}, { get: (target, prop) => () => [{ label: "Beranda", to: "/" }] });

export { getBreadcrumbs as g };
//# sourceMappingURL=breadcrumbs-CLzVyNhY.mjs.map

export const resolvePath = (base, uri) => `${base}${uri.replace(/^\//, '')}`;
export default {
  resolvePath,
};

export const isLimitReached = (current, total) => current >= total;

export const generateUrl = (endpoint, limit, offsetKey, page) => {
  const url = new URL(endpoint);

  if (limit) {
    url.searchParams.append('limit', limit);
    url.searchParams.append(offsetKey, page * limit);
  }

  return url;
}
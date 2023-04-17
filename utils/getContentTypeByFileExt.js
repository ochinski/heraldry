const getContentTypeByFileExt = (fileExt) => {
  const contentTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
  };

  return contentTypes[fileExt] || "application/octet-stream";
};

export default getContentTypeByFileExt;

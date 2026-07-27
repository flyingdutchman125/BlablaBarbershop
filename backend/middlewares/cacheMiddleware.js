const cache = new Map();

// Middleware for intercepting GET requests and serving from cache
exports.cacheMiddleware = (durationInSeconds = 60) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Skip caching for specific paths if needed, e.g. /api/auth
    if (req.originalUrl.startsWith("/api/auth")) {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse && cachedResponse.expiry > Date.now()) {
      // Add a custom header to indicate cache hit (useful for debugging)
      res.setHeader("X-Cache", "HIT");
      return res.json(cachedResponse.data);
    }

    // Intercept res.json to capture the response data
    const originalJson = res.json;
    res.json = (body) => {
      // Only cache successful 200 OK responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, {
          data: body,
          expiry: Date.now() + durationInSeconds * 1000,
        });
      }
      res.setHeader("X-Cache", "MISS");
      return originalJson.call(res, body);
    };

    next();
  };
};

// Middleware to clear cache automatically on POST, PATCH, DELETE, PUT
exports.clearCacheOnMutation = (req, res, next) => {
  if (["POST", "PATCH", "PUT", "DELETE"].includes(req.method)) {
    // Intercept response to clear cache only on successful mutation
    const originalJson = res.json;
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Clear all cached GET requests to ensure consistency
        cache.clear();
      }
      return originalJson.call(res, body);
    };
  }
  next();
};

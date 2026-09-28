export const validate = (schema, target = null) => async (req, res, next) => {
  try {
    if (target) {
      const parsed = await schema.parseAsync(req[target]);
      req[target] = parsed;
      return next();
    }

    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    if (parsed.body !== undefined) {
      req.body = parsed.body;
    }
    
    if (parsed.query !== undefined) {
      req.query = Object.assign(req.query || {}, parsed.query);
    }
    
    if (parsed.params !== undefined) {
      req.params = Object.assign(req.params || {}, parsed.params);
    }
    
    next();
  } catch (error) {
    next(error);
  }
};
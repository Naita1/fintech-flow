export const validate = (schema, target = null) => async (req, res, next) => {
  try {
    if (target) {
      const parsed = await schema.parseAsync(req[target]);
      if (target === 'query') {
        req.validatedQuery = parsed;
      } else {
        req[target] = parsed;
      }
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
      req.validatedQuery = parsed.query;
    }
    
    if (parsed.params !== undefined) {
      req.params = Object.assign(req.params || {}, parsed.params);
    }
    
    next();
  } catch (error) {
    next(error);
  }
};
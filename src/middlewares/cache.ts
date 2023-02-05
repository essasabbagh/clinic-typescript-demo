import { Request, Response, NextFunction } from 'express';

import apicache from 'apicache';

// higher-order function returns false for responses of other status codes
// (e.g. 403, 404, 500, etc)

let cache = apicache.middleware;

const onlyStatus200 = (req: Request, res: Response) => res.statusCode === 200;

const cacheSuccesses = cache('5 minutes', onlyStatus200);

export default cacheSuccesses;

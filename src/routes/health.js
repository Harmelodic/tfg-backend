import {Router} from 'express';

// eslint-disable-next-line new-cap
const router = Router();

router.route('/')
    .get((req, res, next) => {
      res.send({
        status: 'OK',
      });
    });

export default router;

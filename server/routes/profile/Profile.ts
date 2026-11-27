import {Router} from 'express';

import {ServerConfig} from '../../ServerConfig';

const DefaultRoute = (config: ServerConfig) =>
  Router().get('/@:handle', async (req, res) => {
    const profile = await (await fetch(`${config.CLIENT.BACKEND_REST}/v17/users/public/${req.params.handle}`)).json();
    res.render('profile', {config, profile});
  });

export default DefaultRoute;

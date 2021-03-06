import request from 'request';
import conf from '../configure.js';

const UBUNTU_SCA_URL = conf.get('SERVER:UBUNTU_SCA_URL');

export const customers = (req, res) => {
  const auth = req.session.authorization;

  const options = {
    uri: `${UBUNTU_SCA_URL}/purchases/v1/customers`,
    headers: {
      authorization: auth
    },
    json: true,
    body: {
      stripe_token: req.body.stripe_token
    }
  };

  request.post(options).pipe(res);

};

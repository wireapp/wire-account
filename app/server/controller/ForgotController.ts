import Axios from "axios";
import {Request, Response} from "express";
import {ServerConfig} from "../config";

export class ForgotController {

  constructor(private readonly config: ServerConfig) {}

  handleGet = async (req: Request, res: Response) => {
    const _ = req.app.locals._;
    const payload = {
      html_class: 'account forgot',
      status: req.query.success ? 'success' : 'error',
      title: _('Change Password'),
    };
    return res.render('account/forgot', payload);
  };

  handlePost = async (req: Request, res: Response) => {
    const _ = req.app.locals._;
    let status;
    let error;

    const email = (req.fields.email as string || '').toLowerCase().trim();
    const emailRegex = /[^@]+@[^@]+\.[^@]+/;

    if (!emailRegex.test(email)) {
      error = _('That does not look like an email.');
      status = 'error';
    } else {
      try {
        await Axios.post(`${this.config.BACKEND_REST}/password-reset`, {params: {email}});
        // TODO Track piwik
        // util.track_event_to_piwik('account.forgot', 'success' if result.status_code < 300 else 'fail', result.status_code, 1)
        status = 'success';
      } catch (requestError) {
        switch (requestError.response.data.code) {
          case 400: {
            error = _('This email is not in use.');
            status = 'error';
            break;
          }
          case 409: {
            error = _('We already sent you an email. The link is valid for 10 minutes.');
            status = 'error';
            break;
          }
          default: {
            error = _('Something went wrong, please try again.');
            status = 'error';
          }
        }
      }
    }

    const payload = {
      error,
      html_class: 'account forgot',
      status: req.query.success ? 'success' : status,
      title: _('Change Password'),
    };
    return res.render('account/forgot', payload);
  }
};

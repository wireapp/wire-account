import {Request, Response} from "express";
import {ServerConfig} from "../config";

export class VerifyController {

  constructor(private readonly config: ServerConfig) {}

  handleEmailGet = async (req: Request, res: Response) => {
    const _ = req.app.locals._;
    const payload = {
      credentials: 'true',
      html_class: 'account verify',
      status: req.query.success ? 'success' : 'error',
      title: _('Verify Account'),
      url: `${this.config.BACKEND_REST}/activate?key=${req.query.key}&code=${req.query.code}`,
    };
    return res.render('account/verify_email', payload);
  }

  handleBotGet = async (req: Request, res: Response) => {
    const _ = req.app.locals._;
    const payload = {
      credentials: 'false',
      html_class: 'account verify',
      status: req.query.success ? 'success' : 'error',
      title: _('Verify Bot'),
      url: `${this.config.BACKEND_REST}/provider/activate?key=${req.query.key}&code=${req.query.code}`,
    };
    return res.render('account/verify_bot', payload);
  }

  handlePhoneGet = async (req: Request, res: Response) => {
    // TODO Track piwik
    // util.track_event_to_piwik('account.verify-phone', 'success', 200, 1)
    const _ = req.app.locals._;
    const payload = {
      html_class: 'account phone',
      title: _('Verify Phone'),
      url: `${this.config.URL.REDIRECT_PHONE_BASE}/${req.params.code}`,
    };
    return res.render('account/verify_phone', payload);
  }
};

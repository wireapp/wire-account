import {Request, Response} from "express";

export class ResetController {

  handleGet = async (req: Request, res: Response) => {
    res.render('account/reset')
  }
};

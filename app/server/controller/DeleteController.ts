import {Request, Response} from "express";

export class DeleteController {

  handleGet = async (req: Request, res: Response) => {
    return res.render('account/delete');
  }
};

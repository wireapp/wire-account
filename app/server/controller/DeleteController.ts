import {Request, Response, Router} from "express";

export class DeleteController {

  public static readonly ROUTE_DELETE = '/delete';

  private static readonly TEMPLATE_DELETE = 'account/delete';

  public getRoutes = () => {
    return [
      Router().get(DeleteController.ROUTE_DELETE, this.handleGet),
    ];
  };

  private readonly handleGet = async (req: Request, res: Response) => {
    return res.render(DeleteController.TEMPLATE_DELETE);
  }
};

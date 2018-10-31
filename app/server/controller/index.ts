import {DeleteController} from "./DeleteController";
import {ForgotController} from "./ForgotController";
import {ResetController} from "./ResetController";
import {VerifyController} from "./VerifyController";

export const ROUTES: {} = {
  deleteAccount: DeleteController.ROUTE_DELETE,
  forgot: ForgotController.ROUTE_FORGOT,
  resetPassword: ResetController.ROUTE_RESET,
  verifyBot: VerifyController.ROUTE_VERIFY_BOT,
  verifyEmail: VerifyController.ROUTE_VERIFY_EMAIL,
  verifyPhone: VerifyController.ROUTE_VERIFY_PHONE,
};

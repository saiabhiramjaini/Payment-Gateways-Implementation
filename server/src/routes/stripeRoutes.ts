import {Router} from "express";
import { checkout } from "../controllers/stripeControllers";

const stripeRoutes: Router = Router();

stripeRoutes.post("/create-checkout-session", checkout as any);

export default stripeRoutes;
import express, {Express} from "express"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import cors from 'cors';
import authRoute from "./routes/authRoute";
import investmentRoute from "./routes/investmentRoute";
import portfolioRoute from "./routes/portfolioRoute"
import recurringPaymentRoute from "./routes/recurringPaymentRoute"
import tradeRoute from './routes/tradeRoute';
import { notFound, errorHandler } from './middlewares/errorMiddleware';


    
dotenv.config();

const app: Express = express();

const corsOptions = {
    origin: ['http://localhost:3000', "" ],
    credentials: true

  };

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/investment", investmentRoute)
app.use("/api/v1/portfolio", portfolioRoute)
app.use("/api/v1/recurring", recurringPaymentRoute)
app.use("/api/v1/trade", tradeRoute)

const PORT = process.env.PORT || 5000;

app.use(notFound);
app.use(errorHandler);

app.listen(PORT,  () => {
    console.log(`Listening on ${PORT}`)
})
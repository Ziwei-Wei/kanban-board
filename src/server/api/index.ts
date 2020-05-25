import express, {Request, Response} from "express";
import path from "path";

const router = express.Router();

// Serve the static files from the React app
router.use(express.static(path.resolve("./dist/public")));

// Handles any requests that don't match the ones above
router.get("/", (req: Request, res: Response) => {
  res.sendFile(path.resolve("./dist/public/index.html"));
});

export default router;

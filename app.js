import dotenv from "dotenv";
dotenv.config({ quiet: true });
import cookieParser from "cookie-parser";

import express from "express";
import main from "./db/index.js";
import fileUpload from "express-fileupload";
import cors from "cors";

import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";
import cartRouter from "./routes/cart.routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
);

app.use("/", userRouter);
app.use("/", productRouter);
app.use("/", orderRouter);
app.use("/", cartRouter);

main()
  .then(() => {
    console.log("database is connected");
    app.listen(process.env.PORT, () => {
      console.log("server is running at", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("database is not connected", err.message);
  });

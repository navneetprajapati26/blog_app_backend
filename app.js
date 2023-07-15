import express from "express";
import mongoose from "mongoose";
import router from "./routes/user_route";
import blogRouter from "./routes/blog_routes";

const app = express();

app.use(express.json());

app.use("/api/user", router);
app.use("/api/blog", blogRouter);



mongoose
  .connect(
    "mongodb+srv://navneetprajapati26:IdzkctGUrgpjI4zH@cluster0.tzqg2lg.mongodb.net/Blog?retryWrites=true&w=majority"
  )
  .then(() => app.listen(process.env.PORT || 5000))
  .then(() => console.log("connected and on 5000"))
  .catch((err) => console.log(err));

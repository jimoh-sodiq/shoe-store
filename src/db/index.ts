import mongoose from "mongoose";
import type { Express } from "express";

export default class ServerConnector {
  private url = process.env.MONGO_URI || ""

  private port = process.env.PORT || 4173;
  

  private async connectDB() {
    return mongoose.connect(this.url);
  }

  public async start(app: Express): Promise<void> {
    try {
      await this.connectDB();
      app.listen(this.port, () => {
        console.log("server is listening on port " + this.port);
        // pino logger
      });
    } catch (e) {
      console.error(e);
    }
  }
}

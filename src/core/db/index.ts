import mongoose from "mongoose";
import type { Express } from "express";
import globalConfig from '../config';

export default class ServerConnector {
  private url = globalConfig.mongodb.mongoUri || ""

  private port = globalConfig.port;

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

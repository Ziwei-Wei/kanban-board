/*
 * constants for the server to use
 * author: ziwei wei
 */
export const jwtSetting = {
  jwtSecret: "the kanban app - e4ed1573-f16c-4399-b162-f25133d8fd2c",
  jwtAccessTime: {
    expiresIn: "30 minutes"
  }
};

export const PORT = process.env.PORT || "8080";
export const dbURI =
  "mongodb+srv://user:fmVzcYSgooZE0h9H@cluster0-pyczo.mongodb.net/test?retryWrites=true&w=majority";
export const dbName = "kanban";

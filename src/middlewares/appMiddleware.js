import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

const appMiddleware = (app, mysql) => {
  // express 용 body paser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  // mysql 커넥션 풀
  app.use(mysql);

  // api 응답 로그
  app.use(morgan("dev"));

  // cors 설정
  app.use(cors());
};

export default appMiddleware;

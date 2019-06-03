import pbkdf2Password from "pbkdf2-password";

const hasher = pbkdf2Password();

// ===== 암호화 pbkdf2async 비동기 처리.
export const pbkdf2Async = inputData => {
  return new Promise((resolve, reject) => {
    hasher(inputData, (err, pass, salt, hash) => {
      if (err) {
        return reject(err);
      }
      resolve({ pass, salt, hash });
    });
  });
};

// ===== express req 객체의 ip 얻는 방법
export const getUserIp = req => {
  let ipAddress;

  if (!!req.hasOwnProperty("sessionID")) {
    ipAddress = req.headers["x-forwarded-for"];
  } else {
    if (!ipAddress) {
      var forwardedIpsStr = req.header("x-forwarded-for");

      if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(",");
        ipAddress = forwardedIps[0];
      }
      if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
      }
    }
  }
  return ipAddress;
};

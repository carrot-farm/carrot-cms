import mysql from "mysql2/promise";

// 기본 쿼리
const runQuery = (pool, query, useTransaction, unRelease) => {
  let connection;
  return new Promise(async (resolve, reject) => {
    try {
      connection = await pool.getConnection();
      // 트렌젝션 시작
      if (useTransaction) {
        await connection.beginTransaction();
      }
      // 쿼리
      const [result] = await connection.query(query);
      // 트렌젝션 사용시 커밋
      if (useTransaction) {
        await connection.commit();
      }
      // 커넥션 반환
      if (!unRelease) {
        connection.release();
      }
      resolve(result);
    } catch (e) {
      if (useTransaction && connection) {
        connection.rollback();
      }
      connection.release();
      reject(e);
    }
  });
};

class Mysql {
  tableName = "";
  where = "";
  field = "*";
  mysqlData = "";
  type = "SELECT";
  mysqlSkip = "";
  mysqlLimit = "";
  transaction = false;
  unRelease = false; // 커넥션 끊을 지 말지 여부
  // 생성자
  constructor(pool) {
    this.pool = pool;
  }
  // 기본 쿼리문
  query(query, useTransaction) {
    return runQuery(this.pool, query, useTransaction);
  }
  // 테이블 셋팅
  table(tableName, type) {
    this.tableName = tableName;
    this.type = type.toUpperCase();
    return this;
  }

  // find
  find(_query) {
    let i = 0;
    for (let key in _query) {
      if (i > 0) {
        this.where += " AND ";
      }
      this.where += `${key}=${mysql.escape(_query[key])}`;
      i++;
    }
    return this;
  }

  // field 셋팅
  select(_field) {
    this.field = _field;
    return this;
  }

  // 입력 혹은 업데이트 데이타
  data(_data) {
    let i = 0;
    let keys = "";
    let values = "";
    if (this.type === "INSERT") {
      for (let key in _data) {
        if (i <= 0) {
          keys += " (";
          values += " (";
        } else {
          keys += ", ";
          values += ", ";
        }
        keys += `${key}`;
        values += `${mysql.escape(_data[key])}`;
        i++;
      }
      keys += ")";
      values += ")";
      this.mysqlData += `${keys} VALUES ${values}`;
    } else if (this.type === "UPDATE") {
      for (let key in _data) {
        if (i > 0) {
          this.mysqlData += ", ";
        }
        this.mysqlData += `${key}=${mysql.escape(_data[key])}`;
        i++;
      }
    }
    return this;
  }

  // limit
  limit(num) {
    this.mysqlLimit = Number(num);
    return this;
  }

  // skip
  skip(num) {
    this.mysqlSkip = Number(num);
    return this;
  }

  // 트랜젝션 사용
  useTransaction() {
    this.transaction = true;
    return this;
  }

  // 커넥션 유지 안함.
  unReleaseConnection() {
    this.unRelease = true;
    return this;
  }

  // select, delete
  exec() {
    let queryString = "";

    if (this.type === "SELECT") {
      queryString += `SELECT ${this.field} FROM ${this.tableName} `;
    } else if (this.type === "DELETE") {
      queryString += `DELETE FROM ${this.tableName} `;
    }
    queryString += this.mergeQuery();
    return this.runQuery(queryString);
  }

  // insert, update
  save() {
    let queryString = "";
    if (this.type === "INSERT") {
      queryString += `INSERT INTO ${this.tableName} ${this.mysqlData} `;
    } else if (this.type === "UPDATE") {
      queryString += `UPDATE ${this.tableName} SET ${this.mysqlData}  `;
      queryString += this.mergeQuery();
    }
    return this.runQuery(queryString);
  }

  // 쿼리를 합치기.
  mergeQuery() {
    let queryString = "";
    if (this.where) {
      queryString += `WHERE ${this.where} `;
    }
    if (this.mysqlLimit !== "") {
      queryString += `LIMIT ${this.mysqlLimit} `;
    }
    if (this.mysqlSkip !== "") {
      if (this.mysqlLimit) {
        queryString += `OFFSET ${this.mysqlSkip} `;
      } else {
        queryString += `LIMIT ${this.mysqlSkip}, 1 `;
      }
    }
    return queryString;
  }

  // 지역 변수 초기화
  clear() {
    this.tableName = "";
    this.where = "";
    this.field = "*";
    this.mysqlData = "";
    this.type = "SELECT";
    this.mysqlSkip = "";
    this.mysqlLimit = "";
    this.transaction = false;
    this.unRelease = false; // 커넥션 끊을 지 말지 여부
  }

  // 쿼리 실행
  runQuery(_query) {
    console.log("*** runQquery\n", _query);
    return runQuery(this.pool, _query, this.transaction, this.unRelease);
  }
}

export default (req, res, next) => {
  req.mysql = new Mysql(req.mysqlPool);
  return next();
};

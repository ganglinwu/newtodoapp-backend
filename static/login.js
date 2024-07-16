"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
const loginBtn = document.getElementById("loginBtn");
const userName = document.getElementById("userName");
const password = document.getElementById("password");
if (loginBtn === null) {
  const err = new Error("Login button not found!");
  console.error(err.message);
}
loginBtn.addEventListener("click", () =>
  __awaiter(void 0, void 0, void 0, function* () {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3001/login");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Charset", "utf-8");
    xhr.send(
      JSON.stringify({
        userName: `${userName.value}`,
        password: `${password.value}`,
      }),
    );
    xhr.onload = () => {
      if (xhr.status === 200) {
        alert("Login successful");
      }
    };
  }),
);

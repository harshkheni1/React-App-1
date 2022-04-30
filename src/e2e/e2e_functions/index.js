// const crypto = require("crypto");
import { Crypt } from "hybrid-crypto-js";
let crypt = new Crypt();

function split(input, len) {
  return input.match(
    new RegExp(
      ".{1," + len + "}(?=(.{" + len + "})+(?!.))|.{1," + len + "}$",
      "g"
    )
  );
}

let encryptStringWithRsaPublicKey = function (toEncrypt) {
  let publicKey = sessionStorage.getItem("pemPublic");
  let privateKey = sessionStorage.getItem("pemPrivate");
  try {
    let splittedString = split(toEncrypt, 100);
    let encryptedStringArr = [];
    for (let i = 0; i < splittedString.length; i++) {
      let encrypted = crypt.encrypt(publicKey, splittedString[i]);
      encryptedStringArr.push(encrypted);
    }
    return encryptedStringArr;
  } catch (ex) {
    console.log(ex);
  }
};

let decryptStringWithRsaPrivateKey = function (toDecrypt) {
  let publicKey = sessionStorage.getItem("pemPublic");
  let privateKey = sessionStorage.getItem("pemPrivate");
  try {
    let requestString = [];
    for (let i = 0; i < toDecrypt.length; i++) {
      let decrypted = crypt.decrypt(privateKey, toDecrypt[i]);
      requestString.push(decrypted.message);
    }
    return requestString.join("");
  } catch (ex) {
    console.log(ex);
  }
};

export default {
  encryptResponse: encryptStringWithRsaPublicKey,
  decryptRequest: decryptStringWithRsaPrivateKey
};

// let a = encryptStringWithRsaPublicKey("hello", "public.pem")
// let b = decryptStringWithRsaPrivateKey(a, "private.pem");
// console.log(b)

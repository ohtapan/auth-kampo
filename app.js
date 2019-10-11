import Amplify from 'aws-amplify';
require("isomorphic-fetch");

Amplify.configure({
  Auth: {
    identityPoolId: "ap-northeast-1:a2c584fa-96df-42f4-8b2a-fec689415669",
    region: "ap-northeast-1",
    userPoolId: "ap-northeast-1_udVhD0eGu",
    userPoolWebClientId: "127phg37vg3jmrngjqvoacnon7"
  },
  API: {
    endpoints: [
      {
        name: "kampo-sho-search-agw",
        endpoint: "https://p95hnwcvz2.execute-api.ap-northeast-1.amazonaws.com/dev",
        region: "ap-northeast-1"
      }
    ]
  }
})

var userName;
var pw;

var keys;
var attribute = "symptoms";
var mode = "or";

Amplify.Auth.signOut({ global: true })
    .then(data => {
      console.log(data);
    })
    .catch(err => console.log(err));

window.onload = function () {

  document.getElementById("signIn").onclick = function () {

    userName = document.getElementById("userName").value
    pw = document.getElementById("pw").value

    Amplify.Auth.signIn(userName, pw)
      .then(user => {
        if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
          return Amplify.Auth.completeNewPassword(user, pw, {})
        }
        return user
      })
      .then(user => {
        document.getElementById('idToken').value = user.signInUserSession.idToken.jwtToken; 
        alert("サインインしました");  
      }) //tokenを表示
      .catch(e => {
        console.error(e);
        alert("ユーザー名かパスワードが違います");
      })

  }

  document.getElementById("signOut").onclick = function () {
    Amplify.Auth.signOut({ global: true })
    .then(data => {
      console.log(data);
      document.getElementById('idToken').value = "";
      alert("サインアウトしました");
    })
    .catch(err => console.log(err));
  }

  document.getElementById("idCopy").onclick = function () {
    var Target = document.getElementById('idToken');
    Target.select();
    document.execCommand('copy');
  }
  
  document.getElementById("tokenUpdate").onclick = function () {
    Amplify.Auth.currentSession()
    .then(user => {
      document.getElementById('idToken').value = user.idToken.jwtToken;
    })
  }

  document.getElementById("search").onclick = function () {

    keys = document.getElementById('word').value;

    let apiName = 'kampo-sho-search-agw';
    let path = '/resource';
    let myInit = {
    body: {
      keys,
      attribute,
      mode,
    },
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": document.getElementById('idToken').value
    }
    }

    Amplify.API.post(apiName, path, myInit).then(response => {
      document.getElementById('result').value = JSON.stringify(response);
      console.log(response);
    }).catch(error => {
        console.log(error.response);
        document.getElementById('result').value = "error:ログインしてください"　　
    });

  }
}

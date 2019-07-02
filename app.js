require("isomorphic-fetch")
const Amplify = require("aws-amplify")
Amplify.default.configure({
  Auth: {
    identityPoolId: "ap-northeast-1:a2c584fa-96df-42f4-8b2a-fec689415669",
    region: "ap-northeast-1",
    userPoolId: "ap-northeast-1_udVhD0eGu",
    userPoolWebClientId: "127phg37vg3jmrngjqvoacnon7"
  }
})

var userName;
var pw;
var validTime = 3600;
var countTime = validTime;

window.onload = function () {

  document.getElementById("button").onclick = function () {

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
        document.getElementById('accessToken').value = user.signInUserSession.idToken.jwtToken
      }) //tokenを表示
      .catch(e => console.error(e))

  }

  document.getElementById("copy").onclick = function () {
    var Target = document.getElementById('accessToken');
    Target.select();
    document.execCommand('copy');
    Target.value = Target.value;
  }

}

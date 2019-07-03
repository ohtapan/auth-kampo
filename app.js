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
        document.getElementById('idToken').value = user.signInUserSession.idToken.jwtToken
        document.getElementById('accessToken').value = user.signInUserSession.accessToken.jwtToken
        document.getElementById('refreshToken').value = user.signInUserSession.refreshToken.token
        
      }) //tokenを表示
      .catch(e => console.error(e))

  }

  document.getElementById("idCopy").onclick = function () {
    var Target = document.getElementById('idToken');
    Target.select();
    document.execCommand('copy');
  }
  
  document.getElementById("accessCopy").onclick = function () {
    var Target = document.getElementById('accessToken');
    Target.select();
    document.execCommand('copy');
  }

  document.getElementById("refreshCopy").onclick = function () {
    var Target = document.getElementById('refreshToken');
    Target.select();
    document.execCommand('copy');
  }
  
  document.getElementById("tokenUpdate").onclick = function () {
    Amplify.Auth.currentSession()
    .then(user => {
      document.getElementById('idToken').value = user.idToken.jwtToken
      document.getElementById('accessToken').value = user.accessToken.jwtToken
    })
  }

}

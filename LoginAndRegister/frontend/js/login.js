const form = document.getElementById("userLogin");
let captchaPic = document.getElementById("captchaPic");
let captcha = form.elements["captcha"];
let username = form.elements["username"];
let password = form.elements["password"];
let submitbutton = form.elements["submitbutton"];
const invalid_token = "INVALID_USERNAME_OR_TOKEN";
const invalid_captcha = "INVALID_CAPTCHA";

form.addEventListener("submit", (event) => {
  // stop invalid form submission
  event.preventDefault();

  var oripwd = password.value;
  var encryptedpassword = forge_sha256(username.value + oripwd);
  console.log(encryptedpassword);
  console.log(captcha.value);
  $.ajax({
    method: "POST",
    xhrFields: { withCredentials: true },
    url: "http://localhost:3001/login",
    data: {
      username: username.value,
      password: encryptedpassword,
      captcha: captcha.value,
    },
  }).done(function (data, status) {
    console.log(data);
    console.log(status);
    if (data.RESULT == "SUCCESS") {
      alert("登陆成功，即将跳转到首页！");
      document.cookie = "username=John Doe";
      window.location.href = "/index.html";
    } else if(data.RESULT == invalid_captcha){
      alert("验证码错误！");
      submitbutton.value = "再次尝试";
      submitbutton.style.backgroundColor = "#991122";
      captcha.value = "";
      captcha.style.backgroundColor = "#991122";
      getCaptcha();
    } else if(data.RESULT == invalid_token){
      alert("用户名或密码不正确！");
      submitbutton.value = "再次尝试";
      submitbutton.style.backgroundColor = "#991122";
      captcha.value = "";
      captcha.style.backgroundColor = "#991122";
      getCaptcha();
    }
  });
});

function getCaptcha() {
  $.ajax({
    method: "GET",
    xhrFields: { withCredentials: true },
    url: "http://localhost:3001/getcaptcha",
    data: {},
  }).done(function (data, status) {
    console.log(status);
    if (status == "success") {
      // console.log(data);
      const captcha = document.getElementById("captchaPic");
      captcha.innerHTML = data;
      console.log(captcha);
    }
  });
}

captchaPic.addEventListener("click", (event) => {
  getCaptcha();
});

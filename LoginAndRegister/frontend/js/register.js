const form = document.getElementById("userRegister");
const defaultColor = "#373b3d";
let username = form.elements["username"];
let password = form.elements["password"];
let repassword = form.elements["repassword"];
let email = form.elements["email"];
let tips = document.getElementById("passwordtips");
let checktips = document.getElementById("passwordcheck");
let privacybox = form.elements["privacypolicycheck"];
let submitbutton = form.elements["submitbutton"];
let captchaPic = document.getElementById("captchaPic");
let captcha = form.elements["captcha"];
let pwddiffcuty = 0;
let privacychecked = false;
const invalid_captcha = "INVALID_CAPTCHA";
let sleep = function (fun, time) {
  setTimeout(() => {
    fun();
  }, time);
};

const duplicated_username = "USERNAME_OCCUPIED";

privacybox.addEventListener("change", (event) => {
  privacychecked = !privacychecked;
});

username.addEventListener("input", (event) => {
  username.style.backgroundColor = defaultColor;
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

form.addEventListener("submit", (event) => {
  console.log("Privacy checked " + privacybox.value);
  event.preventDefault();
  if (privacychecked) {
    console.log("Username " + username.value);
    console.log("Email " + email.value);

    var oripwd = password.value;
    var encryptedpassword = forge_sha256(username.value + oripwd);
    console.log(encryptedpassword);

    $.ajax({
      method: "POST",
      xhrFields: { withCredentials: true },
      url: "http://localhost:3001/register",
      data: {
        username: username.value,
        password: encryptedpassword,
        email: email.value,
        captcha: captcha.value,
      },
    }).done(function (data, status) {
      console.log(data);
      console.log(status);
      if (data.RESULT == "SUCCESS") {
        alert("???????????????????????????");
        window.location.href = "/login.html";
      } else {
        if (data.RESULT == duplicated_username) {
          username.value = "";
          username.placeholder = "????????????????????????";
          username.style.backgroundColor = "#991122";
          getCaptcha();
        } else if (data.RESULT == invalid_captcha) {
          alert("??????????????????");
          captcha.value = "";
          captcha.style.backgroundColor = "#991122";
          getCaptcha();
        }
        submitbutton.value = "????????????";
        submitbutton.style.backgroundColor = "#991122";
      }
    });
  } else {
    alert("??????????????????????????????????????????");
  }
});

// ?????????????????????????????????????????????
function cmpPasswd(pwd, repwd) {
  if (pwd != repwd) {
    // console.log("NOT MATCH");
    repassword.setCustomValidity("??????????????????????????????");
    repassword.style.backgroundColor = "#991122";
    tips.innerHTML = "??????????????????????????????";
    tips.style.backgroundColor = "#991122";
  } else if (pwddiffcuty > 0) {
    repassword.setCustomValidity("");
    repassword.style.backgroundColor = defaultColor;
    tips.innerHTML = "???????????????";
    tips.style.backgroundColor = "#228B22";
  } else {
    repassword.setCustomValidity("?????????????????????");
    repassword.style.backgroundColor = "#991122";
    tips.innerHTML = "?????????????????????";
    tips.style.backgroundColor = "#991122";
  }
}

function checkPwdStrength(pwd) {
  pwddiffcuty = 0;
  if (pwd.length > 30) {
    checktips.innerHTML = "????????????????????????30";
    checktips.style.backgroundColor = "red";
    return;
  } else if (pwd.length < 8) {
    checktips.innerHTML = "?????????????????????8";
    checktips.style.backgroundColor = "red";
    return;
  } else if (pwd.length < 15 && pwd.length >= 8) {
    pwddiffcuty = 1;
  } else if (pwd.length < 20 && pwd.length >= 15) {
    pwddiffcuty = 2;
  } else {
    pwddiffcuty = 3;
  }
  typeNum = 0;
  var _color = [];
  if (/(?=.*[a-z])/.test(pwd)) {
    typeNum += 1;
  }
  if (/(?=.*[A-Z])/.test(pwd)) {
    typeNum += 1;
  }
  if (/(?=.*[!@#$%^&*?\(\)])/.test(pwd)) {
    typeNum += 1;
  }
  if (/(?=.*\d)/.test(pwd)) {
    typeNum += 1;
  }
  console.log("Strength: " + typeNum);
  switch (typeNum) {
    case 0:
    case 1:
      checktips.innerHTML = "???????????????????????????";
      checktips.style.backgroundColor = "#FF4500";
      return; // ??????????????????????????????????????????
      break;
    case 2:
    case 3:
    case 4:
      pwddiffcuty += typeNum;
  }
  switch (pwddiffcuty) {
    case 1:
    case 2:
    case 3:
      checktips.innerHTML = "??????????????????";
      checktips.style.backgroundColor = "#FFA500";
      break;
    case 4:
      checktips.innerHTML = "??????????????????";
      checktips.style.backgroundColor = "#3CB371";
      break;
    case 5:
      checktips.innerHTML = "??????????????????";
      checktips.style.backgroundColor = "#2E8B57";
      break;
    case 6:
      checktips.innerHTML = "?????????????????????";
      checktips.style.backgroundColor = "#008080";
      break;
    case 7:
      checktips.innerHTML = "???????????????????????????";
      checktips.style.backgroundColor = "#000080";
      break;
  }
}

// ???????????????????????????????????????
password.addEventListener("input", (event) => {
  //   console.log("Checking");
  const pwd = password.value;
  const repwd = repassword.value;
  cmpPasswd(pwd, repwd);
  checkPwdStrength(pwd);
  if (pwddiffcuty == 0) {
    password.setCustomValidity("??????????????????");
  } else {
    password.setCustomValidity("");
  }
});

repassword.addEventListener("input", (event) => {
  //   console.log("Comparing");
  const pwd = password.value;
  const repwd = repassword.value;
  cmpPasswd(pwd, repwd);
});

captchaPic.addEventListener("click", (event) => {
    getCaptcha();
});
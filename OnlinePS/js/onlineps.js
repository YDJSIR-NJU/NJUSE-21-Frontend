const canvas = document.getElementById("banner");
var oriSrc = "img/banner.png";
var hasPic = false;
var imgSrc = oriSrc;
let ctx = canvas.getContext("2d");

const uploadFile = document.getElementById("upload-file");
let img = new Image();
let fileName = "";
// upload File
uploadFile.addEventListener("change", () => {
  const file = document.getElementById("upload-file").files[0];
  // init FileReader API
  const reader = new FileReader();
  if (file) {
    fileName = file.name;
    // read data as URL
    reader.readAsDataURL(file);
    hasPic = true;
  }

  // add image to canvas
  reader.addEventListener(
    "load",
    () => {
      img = new Image();
      oriSrc = reader.result;
      imgSrc = oriSrc;
      img.src = imgSrc;
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        canvas.removeAttribute("data-caman-id");
      };
    },
    false
  );
});

const cropperModeArea = document.getElementById("cropperModeArea");
const endCutting = document.getElementById("endCrop");
const resetCutting = document.getElementById("resetCrop");
const leftRotate = document.getElementById("leftRotate");
const rightRotate = document.getElementById("rightRotate");
const cropNow = document.getElementById("cropNow");
const download = document.getElementById("download");

const lightUp = document.getElementById("lightUp");
const lightDown = document.getElementById("lightDown");
const contrastUp = document.getElementById("contrastUp");
const contrastDown = document.getElementById("contrastDown");
const saturationUp = document.getElementById("saturationUp");
const saturationDown = document.getElementById("saturationDown");
const exposureUp = document.getElementById("exposureUp");
const exposureDown = document.getElementById("exposureDown");

const zoomIn = document.getElementById("zoomIn");
const zoomOut = document.getElementById("zoomOut");

const reset = document.getElementById("reset");

const fliter1 = document.getElementById("fliter1");
const fliter2 = document.getElementById("fliter2");
const fliter3 = document.getElementById("fliter3");
const fliter4 = document.getElementById("fliter4");
const fliter5 = document.getElementById("fliter5");
const fliter6 = document.getElementById("fliter6");

download.addEventListener("click", (event) => {
  console.log("Downloading");
  // get canvas data
  var image = imgSrc;

  // create temporary link
  var tmpLink = document.createElement("a");
  var d = Date.parse(new Date());
  tmpLink.download = d + "_image.png"; // set the name of the download file
  tmpLink.href = image;

  // temporarily add link to body and initiate the download
  document.body.appendChild(tmpLink);
  tmpLink.click();
  document.body.removeChild(tmpLink);
});

var isCut = 0;

/*===============================================================
        缩放旋转裁剪模式
      ===============================================================*/
resetCutting.addEventListener("click", (event) => {
  if (!hasPic) {
    alert("请先上传需要操作的图片！");
    return;
  }
  cropper.reset();
  cropper.clear();
});
leftRotate.addEventListener("click", (event) => {
  if (!hasPic) {
    alert("请先上传需要操作的图片！");
    return;
  }
  cropper.rotate(-90);
});
rightRotate.addEventListener("click", (event) => {
  if (!hasPic) {
    alert("请先上传需要操作的图片！");
    return;
  }
  cropper.rotate(90);
});
cropNow.addEventListener("click", (event) => {
  if (!hasPic) {
    alert("请先上传需要操作的图片！");
    return;
  }
  console.log("Getting Cropped Result");
  var cropboxstatus = cropper.getData();
  if (cropboxstatus.height == 0 && cropboxstatus.width == 0) {
    alert("当前没有选定区域！");
  } else {
    var data = cropper.getCroppedCanvas().toDataURL();
    imgSrc = data;
    cropper.replace(data);
    cropper.clear();
  }
});

/*===============================================================
        调色模式
      ===============================================================*/
lightUp.addEventListener("click", (event) => {
  if (!hasPic) {
    alert("请先上传需要操作的图片！");
    return;
  }
  console.log("lightUp");
  Caman("#banner", function () {
    this.brightness(5).render(function () {
      imgSrc = this.toBase64();
    });
  });
});
lightDown.addEventListener("click", (event) => {
  if (!hasPic) {
    alert("请先上传需要操作的图片！");
    return;
  }
  console.log("lightDown");
  Caman("#banner", function () {
    this.brightness(-5).render(function () {
      imgSrc = this.toBase64();
    });
  });
});
contrastUp.addEventListener("click", (event) => {
  if (!hasPic) {
    alert("请先上传需要操作的图片！");
    return;
  }
  console.log("contrastUp");
  Caman("#banner", function () {
    this.contrast(5).render(function () {
      imgSrc = this.toBase64();
    });
  });
});
contrastDown.addEventListener("click", (event) => {
  if (!hasPic) {
    alert("请先上传需要操作的图片！");
    return;
  }
  console.log("contrastDown");
  Caman("#banner", function () {
    this.contrast(-5).render(function () {
      imgSrc = this.toBase64();
    });
  });
});
saturationUp.addEventListener("click", (event) => {
  if (!hasPic) {
    alert("请先上传需要操作的图片！");
    return;
  }
  console.log("saturationUp");
  Caman("#banner", function () {
    this.saturation(5).render(function () {
      imgSrc = this.toBase64();
    });
  });
});
saturationDown.addEventListener("click", (event) => {
  console.log("saturationDown");
  if (!hasPic) {
    alert("请先上传需要操作的图片！");
    return;
  }
  Caman("#banner", function () {
    this.saturation(-5).render(function () {
      imgSrc = this.toBase64();
    });
  });
});
exposureUp.addEventListener("click", (event) => {
  console.log("exposureUp");
  if (!hasPic) {
    alert("请先上传需要操作的图片！");
    return;
  }
  Caman("#banner", function () {
    this.exposure(5).render(function () {
      imgSrc = this.toBase64();
    });
  });
});
exposureDown.addEventListener("click", (event) => {
  console.log("exposureDown");
  if (!hasPic) {
    alert("请先上传需要操作的图片！");
    return;
  }
  Caman("#banner", function () {
    this.exposure(-5).render(function () {
      imgSrc = this.toBase64();
    });
  });
});

/*===============================================================
        非缩放旋转裁剪模式下缩放
      ===============================================================*/
zoomIn.addEventListener("click", (event) => {
  if (!hasPic) {
    alert("请先上传需要操作的图片！");
    return;
  } else if(isCut == 0){
    var iimg = new Image();
    iimg.src = imgSrc;
    iimg.onload = function () {
      canvas.removeAttribute("data-caman-id");
      console.log("ZoomIn");
      canvas.height = iimg.height * 1.1;
      canvas.width = iimg.width * 1.1;
      console.log(iimg.height);
      console.log(iimg.width);
      ctx.drawImage(iimg, 0, 0, iimg.width * 1.1, iimg.height * 1.1);
      imgSrc = canvas.toDataURL();
    };
  }
});
zoomOut.addEventListener("click", (event) => {
  if (!hasPic) {
    alert("请先上传需要操作的图片！");
    return;
  } else if(isCut == 0){
    var iimg = new Image();
    iimg.src = imgSrc;
    iimg.onload = function () {
      canvas.removeAttribute("data-caman-id");
      console.log("ZoomIn");
      canvas.height = iimg.height * 0.9;
      canvas.width = iimg.width * 0.9;
      console.log(iimg.height);
      console.log(iimg.width);
      ctx.drawImage(iimg, 0, 0, iimg.width * 0.9, iimg.height * 0.9);
      imgSrc = canvas.toDataURL();
    };
  }
});

/*===============================================================
        滤镜选项
      ===============================================================*/
fliter1.addEventListener("click", (event) => {
  if (!hasPic) {
    alert("请先上传需要操作的图片！");
    return;
  } else {
    var filter = LenaJS["red"];
    // img.src = imgSrc;
    LenaJS.filterImage(canvas, filter, img);
    imgSrc = canvas.toDataURL();
  }
});

fliter2.addEventListener("click", (event) => {
    if (!hasPic) {
      alert("请先上传需要操作的图片！");
      return;
    } else {
      var filter = LenaJS["grayscale"];
      LenaJS.filterImage(canvas, filter, img);
      imgSrc = canvas.toDataURL();
    }
});

fliter3.addEventListener("click", (event) => {
    if (!hasPic) {
      alert("请先上传需要操作的图片！");
      return;
    } else {
      var filter = LenaJS["invert"];
      LenaJS.filterImage(canvas, filter, img);
      imgSrc = canvas.toDataURL();
    }
});

fliter4.addEventListener("click", (event) => {
    if (!hasPic) {
      alert("请先上传需要操作的图片！");
      return;
    } else {
      var filter = LenaJS["roberts"];
      LenaJS.filterImage(canvas, filter, img);
      imgSrc = canvas.toDataURL();
    }
});

fliter5.addEventListener("click", (event) => {
    if (!hasPic) {
      alert("请先上传需要操作的图片！");
      return;
    } else {
      var filter = LenaJS["sepia"];
      LenaJS.filterImage(canvas, filter, img);
      imgSrc = canvas.toDataURL();
    }
});

fliter6.addEventListener("click", (event) => {
    if (!hasPic) {
      alert("请先上传需要操作的图片！");
      return;
    } else {
      var filter = LenaJS["laplacian"];
      LenaJS.filterImage(canvas, filter, img);
      imgSrc = canvas.toDataURL();
    }
});

/*===============================================================
        模式切换与重置
      ===============================================================*/
endCutting.addEventListener("click", (event) => {
  if (!hasPic) {
    alert("请先上传需要操作的图片！");
    return;
  }
  console.log("STATUS " + isCut);
  if (isCut == 0) {
    try {
      console.log("Initializing Cropper");
      cropper = new Cropper(canvas, {
        responsive: true,
        autoCrop: false,
        // backgroud: false,
        viewMode: 2,
        crop(event) {},
      });
      cropper.replace(imgSrc);
      cropper.clear();
      endCutting.innerText = "确认并退出";
      endCutting.style.backgroundColor = "brown";
      leftRotate.innerText = "左转90°";
      rightRotate.innerText = "右转90°";
      cropNow.innerText = "裁剪选区";
      resetCutting.innerText = "放弃选区";

      document.getElementById("zoomNotice").innerHTML =
        "双击可切换拖拽（鼠标为十字箭头）和划定选区（鼠标为十字光标）模式。请使用滚轮缩放！";
      zoomIn.innerText = "滚轮↑";
      zoomOut.innerText = "滚轮↓";
      lightUp.innerText = "";
      lightDown.innerText = "";
      contrastUp.innerText = "";
      contrastDown.innerText = "";
      saturationUp.innerText = "";
      saturationDown.innerText = "";
      exposureUp.innerText = "";
      exposureDown.innerText = "";
      document.getElementById("fliters").style.visibility = "hidden";
    } catch (e) {}
    isCut = 1;
  } else if (isCut == 1) {
    var cropboxstatus = cropper.getData();
    if (cropboxstatus.height == 0 && cropboxstatus.width == 0) {
      try {
        cropper.destroy();
        img.src = imgSrc;
        img.onload = function () {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        };
        isCut = 0;
        endCutting.innerText = "旋转与裁剪";
        endCutting.style.backgroundColor = "#373e4a";
        leftRotate.innerText = "";
        rightRotate.innerText = "";
        cropNow.innerText = "";
        resetCutting.innerText = "";

        document.getElementById("zoomNotice").innerHTML = "请使用按钮缩放！";
        zoomIn.innerText = "放大";
        zoomOut.innerText = "缩小";
        lightUp.innerHTML = "&nbsp;亮度+&nbsp;";
        lightDown.innerHTML = "&nbsp;亮度-&nbsp;";
        contrastUp.innerText = "对比度+";
        contrastDown.innerText = "对比度-";
        saturationUp.innerText = "饱和度+";
        saturationDown.innerText = "饱和度-";
        exposureUp.innerText = "曝光度+";
        exposureDown.innerText = "曝光度-";
        document.getElementById("fliters").style.visibility = "visible";
      } catch (e) {}
    } else {
      alert("请先确认或放弃当前选区！");
    }
  }
});

reset.addEventListener("click", (event) => {
  if (!hasPic) {
    alert("请先上传需要操作的图片！");
    return;
  }
  if(isCut == 0){
    try {
        cropper.destroy();
      } catch (e) {}
      img.src = oriSrc;
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
  }
  else{
      alert("请先退出旋转与裁剪模式！");
  }
});

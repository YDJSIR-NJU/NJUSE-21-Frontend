// 参考链接：http://www.alloyteam.com/2016/03/image-steganography/

/*
    重置画布为特定图片
*/
function resetImg(id, src) {
    var oImg = new Image();
    oImg.src = src;
    oImg.crossOrigin = "anonymous";
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext("2d");
    canvas.width = oImg.width;
    canvas.height = oImg.height;
    ctx.drawImage(oImg, 0, 0);
}

/* 
    外部调用方法
    在id为<id>的canvas上绘制在<color>通道上带隐式水印的<src>图片
    可以选"R"、"G"、"B"三种通道
*/
function encodeImg(src, id, color) {
    var img = new Image();
    img.src = src;
    img.crossOrigin = "anonymous";

    var textData;
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext("2d");

    ctx.font = "16px Microsoft Yahei";
    ctx.fillStyle = "rgba(255, 255, 255, 1)";

    var originalData;

    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        console.log(canvas.width);
        console.log(canvas.height);
        
        ctx.translate(img.width / 2, img.height / 2);
        ctx.rotate(Math.random() * 90 * Math.PI / 180);             // 围绕中心点旋转随机角度作为初始倾斜角度

        content = "YDJSIR";
        step = 200;
        rowNum = img.width / step;
        lineNum = img.height / step;
        Num = Math.max(rowNum, lineNum);                            // 取长边
        shuffle = 0;                                                // 抖动角度
        var myDate = new Date();

        for (let i = 0; i < Num; i++) {
            for (let j = 0; j < Num; j++) {
                // 线列加水印，内容是当前用户和UNIX时间戳
                ctx.fillText(content + " " + myDate.getTime(), step * (i - Num / 2), step * (j - Num / 2));
            }
            ctx.rotate(-shuffle * 5 * Math.PI / 180);               // 随机旋转一个小角度
            shuffle = Math.random();
            ctx.rotate(shuffle * 5 * Math.PI / 180);                // 还原
        }
        ctx.rotate(-shuffle * 5 * Math.PI / 180);                   // 还原
        textData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);     // 获取水印数据
        console.log("Watermark Data")
        console.log(textData);

        canvas.width = img.width;   // 重置画布
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        originalData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height); // 获取图片数据

        console.log("Original Data")
        console.log(originalData);
        mergeData(ctx, color, textData, originalData);              // 选择特定通道，进行混合与绘制
    };


}


/*
    ==外部调用方法==
    读出id为<id>的<color>通道中的水印信息
*/
function decodeImg(id, color) {
    var ctx = document.getElementById(id).getContext("2d");
    var encodedData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    console.log("DECODING");
    console.log(encodedData);
    bit = 3 - getOffset(color);
    console.log("Cur Bit " + bit);
    var data = encodedData.data;
    for (var i = 0; i < data.length; i++) {
        if (i % 4 == bit) {
            if (data[i] % 2 === 0) {
                data[i] = 128;
            } else {
                data[i] = 0;
            }
        }
        else {
            // 可选，关闭其他分量，不关闭也能看到水印
            // data[i] = 0;
        }
    }

    console.log("DECODED");
    console.log(encodedData);
    // 将结果绘制到画布
    ctx.putImageData(encodedData, 0, 0);
}

/*
    有水印的地方把<color>通道对应的值置为偶数，反之置为奇数，提取水印时以此为依据。
*/
function mergeData(ctx, color, watermarkData, originalData) {
    var oData = originalData.data;
    var newData = watermarkData.data;
    var bit, offset;                                    // bit的作用是找到对应通道，其实就是模4取余后的余数，offset指向的是alpha通道距离当前通道的偏移量

    offset = getOffset(color);
    bit = 3 - offset;
    
    console.log("Total number of pixels: " + oData.length / 4);

    var bitProcessed = 0;   // 计算到底处理了多少个像素点

    // 像素遍历，添加信息
    for (var i = 0; i < oData.length; i++) {
        if (i % 4 == bit) {
            // 只处理目标通道
            if (newData[i + offset] !== 0 && oData[i] % 2 !== 0) {          // 奇数情形且对应的位点有信息
                if (oData[i] === 255) {
                    oData[i]--;
                } else {
                    oData[i]++;
                }
                bitProcessed += 1;
            }
            else if (newData[i + offset] === 0 && oData[i] % 2 === 0) {     // 偶数情形且对应的位点没有信息
                oData[i]++;
                // 反正破不了255
            }
            // 偶数情形且有信息/奇数情形且没有信息：不管不顾就好
        }
    }
    console.log("Number of pixels in watermark: " + bitProcessed);
    ctx.putImageData(originalData, 0, 0);                                   // 绘图
    console.log("Merged Data");
    console.log(originalData);
};

// 用于DEBUG
function sleep(delay) {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
        continue;
    }
}

function getOffset(color){
    //看是修改RGB哪一个颜色数值
    switch (color) {
        case "R":
            offset = 3;
            break;
        case "G":
            offset = 2;
            break;
        case "B":
            offset = 1;
            break;
        case "A":
            offset = 0;
    }
    return offset;
}
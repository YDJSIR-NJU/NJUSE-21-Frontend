// 参考链接：https://cloud.tencent.com/developer/article/1158636
(function () {
    function __picWM({
        url = "",
        textAlign = "center",
        textBaseline = "middle",
        font = "16px Microsoft Yahei",
        fillStyle = "rgba(1, 1, 1, 0.5)",   // 深灰色半透明水印
        content = "DEMO",
        cb = null,
        step = 200,     // 步进
    } = {}) {
        const img = new Image();
        img.src = url;
        img.crossOrigin = "anonymous";
        img.onload = function () {
            // 绘制底图
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            // 绘制水印
            ctx.textAlign = textAlign;
            ctx.textBaseline = textBaseline;
            ctx.font = font;

            // 围绕中心点旋转随机角度作为初始倾斜角度
            ctx.translate(img.width / 2, img.height / 2);
            ctx.rotate(Math.random() * 90 * Math.PI / 180);     // 旋转

            rowNum = img.width / step;
            lineNum = img.height / step;
            Num = Math.max(rowNum, lineNum);                    // 取长边
            shuffle = 0;                                        // 抖动角度
            var myDate = new Date();

            for (let i = 0; i < Num; i++) {
                for (let j = 0; j < Num; j++) {
                    // 随机颜色，且确保透明度不超过50%
                    ctx.fillStyle = "rgba(" + (Math.random() * 256) + ", " + (Math.random() * 256) + ", " + (Math.random() * 256) + ", " + Math.random() * 0.7 + ")";
                    // 线列加水印，内容是当前用户和UNIX时间戳
                    ctx.fillText(content + " " + myDate.getTime(), step * (i - Num / 2), step * (j - Num / 2));
                }
                ctx.rotate(-shuffle * 5 * Math.PI / 180);       // 随机旋转角度
                shuffle = Math.random();
                ctx.rotate(shuffle * 5 * Math.PI / 180);        // 还原
            }
            const base64Url = canvas.toDataURL();               // 导出绘图产生效果
            cb && cb(base64Url);    
        };
    }

    // 多平台支持 浏览器/Node.js
    // https://blog.csdn.net/loveliness_Girl/article/details/98596947
    if (typeof module != "undefined" && module.exports) {
        //CMD
        module.exports = __picWM;
    } else if (typeof define == "function" && define.amd) {
        // AMD
        define(function () {
            return __picWM;
        });
    } else {
        window.__picWM = __picWM;
    }
})();

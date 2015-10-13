(function (exports) {

    function CountDownLatch(count, done) {
        this.count = count;
        this.done = done;
    }
    exports.CountDownLatch = CountDownLatch;

    CountDownLatch.prototype.countDown = function() {
        if (--this.count == 0) {
            this.done();
        }
    }

    function appendQueryString(url, name, value) {
        if (url.indexOf('?') == -1) {
            return url + "?" + name + '=' + value;
        } else {
            return url + "&" + name + '=' + value;
        }
    }
    exports.appendQueryString = appendQueryString;

    function downloadImage(imgUrl, imgId, done) {
        var image = document.getElementById(imgId);
        var downloadingImage = new Image();
        downloadingImage.onload = function () {
            image.src = this.src;
            done();
        };
        downloadingImage.onerror = function () {
            done();
        };
        // Assume the image is dynamic and insert a cache bust.
        downloadingImage.src = appendQueryString(imgUrl, "_t", new Date().getTime());
    }
    exports.downloadImage = downloadImage;

    function mpld3_plot(selector, url) {
        var parentElement = $("#" + selector);
        var saveLink = $("<a />", {
            href: url,
            target: "_blank",
            "class": "btn btn-default glyphicon glyphicon-save",
        });
        parentElement.before(saveLink);
        return $.ajax({
            url: url,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            dataType: "json"
        }).done(function (data) {
            mpld3.draw_figure(selector, data);
        });
    }
    exports.mpld3Plot = mpld3_plot;

})(this.Common = {})

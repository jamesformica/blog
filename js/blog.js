function ready() {
    new blogManager();
}

var blogManager = (function () {
    function blogManager() {
        this.articleIterator = articleList.length - 1;
        this._articleContainer = document.getElementsByClassName("ui-articles")[0];
        this._articleListContainer = document.getElementsByClassName("ui-article-list")[0];
        this._hamburger = document.getElementsByClassName("ui-hamburger")[0];
        this._backdrop = document.getElementsByClassName("ui-backdrop")[0];

        var articleToDisplay = this.getArticleToDisplay();

        this.populateArticleList();
        this.getArticle(articleToDisplay);
        this.attachEvents();

        if (this.isGoogleDefined()) {
            google.charts.load('current', { 'packages': ['corechart'] });
        }
    }

    blogManager.prototype.isGoogleDefined = function() {
        return typeof (google) !== "undefined";
    }

    /**
     * Work out if there is an article in the url or if we
     * just should use the latest published article
     */
    blogManager.prototype.getArticleToDisplay = function () {
        var articleParam = this.getQueryParam("article");

        if (articleParam !== null) {
            var articleNum = Number(articleParam);

            if (!isNaN(articleNum)) {
                this.articleIterator = articleNum;
                return articleList[articleNum];
            }
        }

        var firstAvailable = this.getPrevArticle(articleList.length);
        return articleList[firstAvailable];
    }

    /**
     * Populates the side panel with the list of links to all articles 
     */
    blogManager.prototype.populateArticleList = function () {
        for (var i = articleList.length - 1; i >= 0; i--) {
            var article = articleList[i];

            if (article.published) {
                var _li = document.createElement("li");
                var _a = document.createElement("a");
                var _text = document.createTextNode(article["title"]);

                _a.classList = "inverse";
                _a.href = this.getDisplayUrl(i);
                _a.appendChild(_text);
                _li.appendChild(_a);
                this._articleListContainer.appendChild(_li);
            }
        }
    }

    /**
     * Send an async GET request asking for the next article
     */
    blogManager.prototype.getArticle = function (article) {
        var _this = this;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                _this.appendArticle(xmlhttp.responseText);

                if (_this.isGoogleDefined()) {
                    google.charts.setOnLoadCallback(_this.drawCharts);
                    document.title = article["title"];
                }
            }
        }

        xmlhttp.open("GET", this.getUrl(article), true);
        xmlhttp.send();
    }

    /**
     * Convert the response's markdown to html then render
     * the retrieved article on the page
     */
    blogManager.prototype.appendArticle = function (responseText) {
        var converter = new showdown.Converter();
        converter.setOption('tables', true);
        converter.setOption('strikethrough', true);

        var html = this.getChartsReady(responseText);
        html = converter.makeHtml(html);

        var _article = document.createElement("article");
        _article.innerHTML = html;

        this._articleContainer.appendChild(_article);
    }

    /**
     * Helper function to get the URL to an article's content
     */
    blogManager.prototype.getUrl = function (article) {
        return window.location.pathname + "articles/" + article["file"];
    }

    /**
     * Helper function to get the URL that will display the article
     * nicely with the layout
     */
    blogManager.prototype.getDisplayUrl = function (articleNum) {
        return window.location.pathname + "?article=" + articleNum;
    }

    /**
     * Helper that returns the index of the next available future article
     * to display. Honours the published flag
     */
    blogManager.prototype.getNextArticle = function (currentIndex) {
        currentIndex++;
        var currentArticle = articleList[currentIndex];
        while (currentArticle !== undefined && !currentArticle.published) {
            currentArticle = articleList[++currentIndex];
        }

        return currentIndex;
    }

    /**
     * Helper that returns the index of the next available past article
     * to display. Honours the published flag
     */
    blogManager.prototype.getPrevArticle = function (currentIndex) {
        currentIndex--;
        var currentArticle = articleList[currentIndex];
        while (currentArticle !== undefined && !currentArticle.published) {
            currentArticle = articleList[--currentIndex];
        }

        return currentIndex;;
    }

    /**
     * Set up click handlers for various elements
     */
    blogManager.prototype.attachEvents = function () {
        this._hamburger.onclick = function () {
            document.body.classList = "slide";
        };

        this._backdrop.onclick = function () {
            document.body.classList = "";
        };

        var nextArticleIndex = this.getNextArticle(this.articleIterator);
        var prevArticleIndex = this.getPrevArticle(this.articleIterator);
        var nextArticle = articleList[nextArticleIndex];
        var prevArticle = articleList[prevArticleIndex];

        if (nextArticle) {
            var _next = document.getElementsByClassName("ui-next")[0];
            _next.classList = _next.classList + " show";

            var _nextLink = _next.getElementsByClassName("ui-next-link")[0];
            _nextLink.innerHTML = nextArticle["title"];
            _nextLink.href = getDisplayUrl(nextArticleIndex);
        }

        if (prevArticle) {
            var _prev = document.getElementsByClassName("ui-prev")[0];
            _prev.classList = _prev.classList + " show";

            var _prevLink = _prev.getElementsByClassName("ui-prev-link")[0];
            _prevLink.innerHTML = prevArticle["title"];
            _prevLink.href = this.getDisplayUrl(prevArticleIndex);
        }
    }

    /**
     * Helper function to get values out of the query string params
     */
    blogManager.prototype.getQueryParam = function (name) {
        var index = window.location.search.indexOf(name);

        if (index > -1) {
            var pair;
            var nextAmp = window.location.search.indexOf("&", index);

            if (nextAmp > -1) {
                pair = window.location.search.substring(index, nextAmp);
            } else {
                pair = window.location.search.substring(index);
            }

            var splitPair = pair.split("=");

            if (splitPair.length === 2) return splitPair[1];
        }

        return null;
    }

    /**
     * Find all chart declarations and replace them with a div that's ready to be
     * converted to a Google chart
     */
    blogManager.prototype.getChartsReady = function (html) {
        var chartIndex = html.indexOf("{chart:");

        while (chartIndex > -1) {
            var chartCloseBracket = html.indexOf("}", chartIndex);
            var declaration = html.substring(chartIndex, chartCloseBracket);
            var namespace = declaration.split(":")[1];

            var _chartPlaceholder = document.createElement("div");
            _chartPlaceholder.classList = "ui-chart chart";
            _chartPlaceholder.dataset.namespace = namespace;

            html = html.substring(0, chartIndex) + _chartPlaceholder.outerHTML + html.substring(chartCloseBracket + 1);

            // try find the next one
            chartIndex = html.indexOf("{chart:", chartCloseBracket);
        }

        return html;
    }

    /**
     * Finds all chart placeholders and draws the Google chart within
     * the placeholder
     */
    blogManager.prototype.drawCharts = function () {
        var _charts = document.getElementsByClassName("ui-chart");

        for (var i = 0; i < _charts.length; i++) {
            var _chart = _charts[i];
            _chart.classList = _chart.classList + " show";

            var chartData = eval(_chart.dataset.namespace);
            var type = chartData["type"] || "line";
            var data = google.visualization.arrayToDataTable(chartData["data"]);

            var options = {
                title: chartData["title"] || "",
                legend: {
                    position: 'bottom'
                },
                vAxis: {
                    format: 'long',
                    title: chartData["vTitle"]
                }
            };

            var googleChart;
            if (type === "line") {
                googleChart = new google.visualization.LineChart(_chart);
            } else {
                console.error("Invalid chart type: " + type);
            }

            googleChart.draw(data, options);
        }
    }

    return blogManager;
})();
var articleIterator;
function ready() {
    articleIterator = articleList.length - 1;

    var _articlesContainer = document.getElementsByClassName("ui-articles")[0];
    var _articleList = document.getElementsByClassName("ui-article-list")[0];
    var articleToShow = undefined;

    var articleParam = getQueryParam("article");

    if (articleParam !== null) {
        var articleNum = Number(articleParam);

        if (!isNaN(articleNum)) {
            articleToShow = articleList[articleNum];
            articleIterator = articleNum;
        }
    }

    if (!articleToShow) {
        var firstAvailable = getPrevArticle(articleList.length);
        articleToShow = articleList[firstAvailable];
    }

    populateArticleList(_articleList);
    getArticle(articleToShow, _articlesContainer);
    attachEvents();

    if (typeof (google) !== "undefined") {
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawCharts);
    }
}

/**
 * Populates the side panel with the list of links to all articles 
 */
function populateArticleList(_articleList) {
    for (var i = articleList.length - 1; i >= 0; i--) {
        var article = articleList[i];

        if (article.published) {
            var _li = document.createElement("li");
            var _a = document.createElement("a");
            var _text = document.createTextNode(article["title"]);

            _a.classList = "inverse";
            _a.href = getDisplayUrl(i);
            _a.appendChild(_text);
            _li.appendChild(_a);
            _articleList.appendChild(_li);
        }
    }
}

/**
 * Send an async GET request asking for the next article
 */
function getArticle(article, elementToAppend) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            appendArticle(xmlhttp.responseText, elementToAppend);
        }
    }

    xmlhttp.open("GET", getUrl(article), true);
    xmlhttp.send();
}

/**
 * Convert the response's markdown to html then render
 * the retrieved article on the page
 */
function appendArticle(responseText, elementToAppend) {
    var converter = new showdown.Converter();
    converter.setOption('tables', true);
    converter.setOption('strikethrough', true);

    var html = getChartsReady(responseText);
    html = converter.makeHtml(html);

    var _article = document.createElement("article");
    _article.innerHTML = html;

    elementToAppend.appendChild(_article);
}

/**
 * Helper function to get the URL to an article's content
 */
function getUrl(article) {
    return window.location.pathname + "articles/" + article["file"];
}

/**
 * Helper function to get the URL that will display the article
 * nicely with the layout
 */
function getDisplayUrl(articleNum) {
    return window.location.pathname + "?article=" + articleNum;
}

/**
 * Helper that returns the index of the next available future article
 * to display. Honours the published flag
 */
function getNextArticle(currentIndex) {
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
function getPrevArticle(currentIndex) {
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
function attachEvents() {
    var _hamburger = document.getElementsByClassName("ui-hamburger")[0];
    var _backdrop = document.getElementsByClassName("ui-backdrop")[0];

    _hamburger.onclick = function () {
        document.body.classList = "slide";
    };

    _backdrop.onclick = function () {
        document.body.classList = "";
    }

    var nextArticleIndex = getNextArticle(articleIterator);
    var prevArticleIndex = getPrevArticle(articleIterator);
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
        _prevLink.href = getDisplayUrl(prevArticleIndex);
    }
}

/**
 * Helper function to get values out of the query string params
 */
function getQueryParam(name) {
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
function getChartsReady(html) {
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
function drawCharts() {
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
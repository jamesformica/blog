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
        articleToShow = articleList[articleIterator];
    }

    populateArticleList(_articleList);
    getArticle(articleToShow[1], _articlesContainer);
    attachEvents();
}

/**
 * Populates the side panel with the list of links to all articles 
 */
function populateArticleList(_articleList) {
    articleList.forEach(function (value, index) {
        var _li = document.createElement("li");
        var _a = document.createElement("a");
        var _text = document.createTextNode(articleList[index][0]);

        _a.classList = "inverse";
        _a.href = getDisplayUrl(index);
        _a.appendChild(_text);
        _li.appendChild(_a);
        _articleList.appendChild(_li);
    });
}

/**
 * Send an async GET request asking for the next article
 */
function getArticle(articleName, elementToAppend) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            appendArticle(xmlhttp.responseText, elementToAppend);
        }
    }

    xmlhttp.open("GET", getUrl(articleName), true);
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

    var html = converter.makeHtml(responseText);

    var _article = document.createElement("article");
    _article.innerHTML = html;

    elementToAppend.appendChild(_article);
}

/**
 * Helper function to get the URL to an article's content
 */
function getUrl(articleName) {
    return window.location.pathname + "articles/" + articleName;
}

/**
 * Helper function to get the URL that will display the article
 * nicely with the layout
 */
function getDisplayUrl(articleNum) {
    return window.location.pathname + "?article=" + articleNum;
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

    var nextArticle = articleList[articleIterator + 1];
    var prevArticle = articleList[articleIterator - 1];

    if (nextArticle) {
        var _next = document.getElementsByClassName("ui-next")[0];
        _next.classList = _next.classList + " show";

        var _nextLink = _next.getElementsByClassName("ui-next-link")[0];
        _nextLink.innerHTML = nextArticle[0];
        _nextLink.href = getDisplayUrl(articleIterator + 1);
    }

    if (prevArticle) {
        var _prev = document.getElementsByClassName("ui-prev")[0];
        _prev.classList = _prev.classList + " show";

        var _prevLink = _prev.getElementsByClassName("ui-prev-link")[0];
        _prevLink.innerHTML = prevArticle[0];
        _prevLink.href = getDisplayUrl(articleIterator - 1);
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
var articleIterator = 0;

function ready() {
    var _articlesContainer = document.getElementsByClassName("ui-articles")[0];
    var _articleList = document.getElementsByClassName("ui-article-list")[0];
    var articleToShow = -1;

    var articleIndex = window.location.search.indexOf("article");
    
    if (articleIndex > -1) {
        var articleNum = window.location.search.substring(articleIndex).split("=")[1];
        articleNum = Number(articleNum);

        if (!isNaN(articleNum)) {
            articleToShow = articleList[articleNum];
        }
    }

    if (articleToShow === -1) {
        articleToShow = articleList[articleIterator];
    }

    populateArticleList(_articleList);
    getArticle(articleToShow[1], _articlesContainer);

   
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
 * Helper function to get the URL to an article
 */
function getUrl(articleName) {
    return "/articles/" + articleName;
}

function getDisplayUrl(articleNum) {
    return "/?article=" + articleNum;
}

/**
 * Send an async GET request asking for the next article
 */
function getArticle(articleName, elementToAppend) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            appendArticle(xmlhttp.responseText, elementToAppend);
            //elementToAppend.innerHTML = "<em>CHICKEN</em> New Header";
        }
    }

    xmlhttp.open("GET", getUrl(articleName), true);
    xmlhttp.send();
}

/**
 * Render the retrieved article on the page
 */
function appendArticle(responseText, elementToAppend) {
    var parser = new DOMParser();
    var converter = new showdown.Converter();

    var html = converter.makeHtml(responseText);

    var _article = document.createElement("article");
    _article.innerHTML = html;

    elementToAppend.appendChild(_article);
}
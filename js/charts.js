var charts;
(function (charts) {
    charts.marriageChart = {
        type: "line",
        title: "Average Age of Marriage",
        vTitle: "Age",
        data: [
            ["Year", "Male", "Female"],
            ["1950", 22.8, 20.3],
            ["1960", 22.8, 20.3],
            ["1970", 23.2, 20.8],
            ["1980", 24.7, 22.0],
            ["1990", 26.1, 23.9],
            ["1993", 26.5, 24.5],
            ["1994", 26.7, 24.5],
            ["1995", 26.9, 24.5],
            ["1996", 27.1, 24.8],
            ["1997", 26.8, 25.0],
            ["1998", 26.7, 25.0],
            ["1999", 26.9, 25.1],
            ["2000", 26.8, 25.1],
            ["2001", 26.9, 25.1],
            ["2002", 26.9, 25.3],
            ["2003", 27.1, 25.3],
            ["2005", 27.0, 25.5],
            ["2006", 27.5, 25.9],
            ["2007", 27.7, 26.0],
            ["2008", 27.6, 25.9],
            ["2009", 28.1, 25.9],
            ["2010", 28.2, 26.1]
        ]
    };

    charts.nailbitersChart = {
        type: "bar",
        title: "% of Nail Biters by Age Group",
        hTitle: "Percent",
        legend: "none",
        data: [
            ["Ages", "Percent", { role: 'style' }],
            ["Children", 33, "#1abc9c"],
            ["Adolescents", 44, "#3498db"],
            ["Young Adults", 29, "#9b59b6"],
            ["Older Adults", 5, "#f39c12"]
        ]
    }
})(charts || (charts = {}));


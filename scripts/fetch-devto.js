async function fetchDevToArticles() {
    const response = await fetch('https://dev.to/api/articles?tag=javascript&top=7');
    const articles = await response.json();

    articles.forEach(article => {
        console.log(article.title);
        console.log(article.url);
        console.log("---");
    });
}

fetchDevToArticles();
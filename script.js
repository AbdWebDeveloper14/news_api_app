const api = "e5df2bc660284105aa38d6dd94320864";

const newsContainer = document.getElementById("news-container");
const loader = document.querySelector(".loader");
const categoryButtons = document.querySelectorAll(".categories button");

async function fetchNews(url) {
    loader.style.display = "block";       
    newsContainer.innerHTML = "";         

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.articles.length === 0) {
            newsContainer.innerHTML = `<p>No news found for this category.</p>`;
            return;
        }

        displayNews(data.articles);

    } catch (error) {
        console.log(error);
        newsContainer.innerHTML = `<p>Unable to fetch news. Try again later.</p>`;
    } finally {
        loader.style.display = "none";    
    }
}

function displayNews(articles) {
    articles.forEach(element => {

        const articlesDiv = document.createElement("div");
        articlesDiv.classList.add("news-card");

        const newsimage = document.createElement("img");
        newsimage.src = element.urlToImage || "https://via.placeholder.com/400x200";
        newsimage.alt = "news-image";
        articlesDiv.appendChild(newsimage);

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("news-content");
        contentDiv.style.padding = "15px";

        const heading = document.createElement("h3");
        heading.classList.add("title");
        heading.innerText = element.title;
        contentDiv.append(heading);

        const description = document.createElement("p");
        description.classList.add("description");
        description.innerText = element.description || "No description available.";
        contentDiv.append(description);

        const publishedAt = document.createElement("span");
        publishedAt.classList.add("publishedAt");
        publishedAt.innerText = new Date(element.publishedAt).toLocaleString();
        contentDiv.append(publishedAt);

        articlesDiv.append(contentDiv);
        newsContainer.append(articlesDiv);
    });
}

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        const category = button.innerText.toLowerCase();
        const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${api}`;
        fetchNews(url);
    });
});


window.onload = () => {
    const defaultCategory = "technology";
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${defaultCategory}&apiKey=${api}`;
    fetchNews(url);
};

const apiKey = "e5df2bc660284105aa38d6dd94320864";

const newsContainer = document.getElementById("news-container");
const loader = document.querySelector(".loader");
const categoryButtons = document.querySelectorAll(".categories button");

async function fetchNews(url) {
    loader.style.display = "block";
    newsContainer.innerHTML = "";

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        if (data.status !== "ok") {
            throw new Error(data.message || "News API error");
        }

        if (!data.articles || data.articles.length === 0) {
            newsContainer.innerHTML = `<p>No news found for this category.</p>`;
            return;
        }

        displayNews(data.articles);

    } catch (error) {
        console.error("Fetch Error:", error.message);
        newsContainer.innerHTML = `
            <p style="color:red; text-align:center;">
                Unable to fetch news. (${error.message})
            </p>
        `;
    } finally {
        loader.style.display = "none";
    }
}

function displayNews(articles) {
    newsContainer.innerHTML = "";

    articles.forEach(article => {
        const articleDiv = document.createElement("div");
        articleDiv.className = "news-card";

        const img = document.createElement("img");
        img.src = article.urlToImage || "https://via.placeholder.com/400x200";
        img.alt = "news image";

        const content = document.createElement("div");
        content.className = "news-content";

        const title = document.createElement("h3");
        title.textContent = article.title || "No title";

        const desc = document.createElement("p");
        desc.textContent = article.description || "No description available.";

        const date = document.createElement("span");
        date.textContent = article.publishedAt
            ? new Date(article.publishedAt).toLocaleString()
            : "";

        content.append(title, desc, date);
        articleDiv.append(img, content);
        newsContainer.appendChild(articleDiv);
    });
}

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        categoryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const category = button.innerText.toLowerCase();
        const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`;
        fetchNews(url);
    });
});

window.addEventListener("load", () => {
    const defaultCategory = "technology";
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${defaultCategory}&apiKey=${apiKey}`;
    fetchNews(url);
});

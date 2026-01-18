// ======== API KEY ========
const apiKey = "9CqFbN2o6lWyZxjNPiO8VN5zrSg8CWGlFd9h6MCX7Wg2xFX9"; // Currents API Key

// ======== DOM ELEMENTS ========
const newsContainer = document.getElementById("news-container");
const loader = document.querySelector(".loader");
const categoryButtons = document.querySelectorAll(".categories button");

// ======== CATEGORY MAP ========
const categoryMap = {
    Technology: "technology",
    Sports: "sports",
    Business: "business",
    Health: "health",
    Entertainment: "entertainment",
    Science: "science",
    General: "all"
};

// ======== FETCH NEWS FUNCTION ========
async function fetchNews(url) {
    if (loader) loader.style.display = "block";
    newsContainer.innerHTML = "";

    try {
        const res = await fetch(url);
        const data = await res.json();

        // Check for errors
        if (!res.ok || !data.news) {
            throw new Error(data.message || `Error ${res.status}`);
        }

        if (data.news.length === 0) {
            newsContainer.innerHTML = `<p style="text-align:center;">No news found for this category.</p>`;
            return;
        }

        displayNews(data.news);

    } catch (error) {
        console.error("Fetch Error:", error.message);
        newsContainer.innerHTML = `
            <div style="color:red; text-align:center; padding: 20px;">
                <h3>Unable to fetch news</h3>
                <p>Reason: ${error.message}</p>
                <small>Check if your API key is correct and Currents API is working.</small>
            </div>
        `;
    } finally {
        if (loader) loader.style.display = "none";
    }
}

// ======== DISPLAY NEWS ========
function displayNews(articles) {
    newsContainer.innerHTML = "";

    articles.forEach(article => {
        const articleDiv = document.createElement("div");
        articleDiv.className = "news-card";

        const img = document.createElement("img");
        img.src = article.image || "https://via.placeholder.com/400x200?text=No+Image+Available";
        img.alt = "news image";
        img.style.width = "100%";
        img.style.borderRadius = "5px";

        const content = document.createElement("div");
        content.className = "news-content";

        const title = document.createElement("h3");
        title.textContent = article.title || "No title available";

        const desc = document.createElement("p");
        desc.textContent = article.description || "No description available.";

        const date = document.createElement("span");
        date.style.display = "block";
        date.style.marginTop = "10px";
        date.style.fontSize = "0.8rem";
        date.style.color = "#777";
        date.textContent = article.published || "";

        const link = document.createElement("a");
        link.href = article.url;
        link.target = "_blank";
        link.innerText = "Read More";
        link.style.color = "#6a11cb";
        link.style.textDecoration = "none";
        link.style.fontWeight = "bold";

        content.append(title, desc, date, link);
        articleDiv.append(img, content);
        articleDiv.style.background = "#fff";
        articleDiv.style.padding = "15px";
        articleDiv.style.margin = "15px";
        articleDiv.style.borderRadius = "10px";
        articleDiv.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";

        newsContainer.appendChild(articleDiv);
    });
}

// ======== CATEGORY BUTTON CLICK ========
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        categoryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const category = categoryMap[button.innerText] || "all";

        const url = `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}&category=${category}&language=en`;
        fetchNews(url);
    });
});

// ======== LOAD DEFAULT NEWS ========
window.addEventListener("load", () => {
    const url = `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}&category=all&language=en`;
    fetchNews(url);
});

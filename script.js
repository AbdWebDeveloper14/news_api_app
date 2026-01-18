const apiKey = "23a34053b13480d273137b214670d2be"; // GNews API Key

const newsContainer = document.getElementById("news-container");
const loader = document.querySelector(".loader");
const categoryButtons = document.querySelectorAll(".categories button");

// 1. Fetch function updated for GNews structure
async function fetchNews(url) {
    if (loader) loader.style.display = "block";
    newsContainer.innerHTML = "";

    try {
        const res = await fetch(url);
        const data = await res.json();

        // GNews 403 error handle karne ke liye
        if (!res.ok) {
            const errorMessage = data.errors ? data.errors[0] : `Error ${res.status}`;
            throw new Error(errorMessage);
        }

        // GNews mein status: "ok" nahi hota, direct articles hote hain
        if (!data.articles || data.articles.length === 0) {
            newsContainer.innerHTML = `<p style="text-align:center;">No news found for this category.</p>`;
            return;
        }

        displayNews(data.articles);

    } catch (error) {
        console.error("Fetch Error:", error.message);
        newsContainer.innerHTML = `
            <div style="color:red; text-align:center; padding: 20px;">
                <h3>Unable to fetch news</h3>
                <p>Reason: ${error.message}</p>
                <small>Check if your GNews API key is verified via email.</small>
            </div>
        `;
    } finally {
        if (loader) loader.style.display = "none";
    }
}

// 2. Display function updated for GNews property names
function displayNews(articles) {
    newsContainer.innerHTML = "";

    articles.forEach(article => {
        const articleDiv = document.createElement("div");
        articleDiv.className = "news-card";

        // GNews use 'image' instead of 'urlToImage'
        const img = document.createElement("img");
        img.src = article.image || "https://via.placeholder.com/400x200?text=No+Image+Available";
        img.alt = "news image";

        const content = document.createElement("div");
        content.className = "news-content";

        const title = document.createElement("h3");
        title.textContent = article.title || "No title available";

        const desc = document.createElement("p");
        // GNews provides description
        desc.textContent = article.description || "No description available.";

        const date = document.createElement("span");
        date.style.display = "block";
        date.style.marginTop = "10px";
        date.style.fontSize = "0.8rem";
        date.style.color = "#777";
        date.textContent = article.publishedAt
            ? new Date(article.publishedAt).toLocaleString()
            : "";

        const link = document.createElement("a");
        link.href = article.url;
        link.target = "_blank";
        link.innerText = "Read More";
        link.style.color = "#6a11cb";
        link.style.textDecoration = "none";
        link.style.fontWeight = "bold";

        content.append(title, desc, date, link);
        articleDiv.append(img, content);
        newsContainer.appendChild(articleDiv);
    });
}

// 3. Category Click Event
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        categoryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const category = button.innerText.toLowerCase();
        // GNews categories: general, world, nation, business, technology, entertainment, sports, science, health
        const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=10&apikey=${apiKey}`;
        fetchNews(url);
    });
});

// 4. Initial Load
window.addEventListener("load", () => {
    const defaultCategory = "general"; // 'general' is safer for first load
    const url = `https://gnews.io/api/v4/top-headlines?category=${defaultCategory}&lang=en&country=us&max=10&apikey=${apiKey}`;
    fetchNews(url);
});
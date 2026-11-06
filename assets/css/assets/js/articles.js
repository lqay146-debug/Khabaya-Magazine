/*
  قاعدة بيانات مقالات مجلة خبايا
  أضف كل مقال جديد داخل القائمة articles
*/

const KHABAYA_ARTICLES = [
  /*
  مثال لإضافة مقال:

  {
    title: "عنوان المقال",
    description: "نبذة مختصرة عن المقال",
    category: "التقنية والذكاء الاصطناعي",
    categorySlug: "technology",
    image: "https://example.com/image.jpg",
    url: "articles/article-name.html",
    date: "2026-11-06",
    author: "فريق خبايا"
  }

  */
];

function khabayaFormatDate(date) {
  if (!date) return "";
  const parsed = new Date(date + "T00:00:00");
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(parsed);
}

function khabayaCreateCard(article) {
  const card = document.createElement("article");
  card.className = "article-card";

  const link = document.createElement("a");
  link.href = article.url || "#";
  link.style.textDecoration = "none";
  link.style.color = "inherit";

  if (article.image) {
    const image = document.createElement("img");
    image.src = article.image;
    image.alt = article.title || "صورة المقال";
    image.loading = "lazy";
    link.appendChild(image);
  }

  const content = document.createElement("div");
  content.className = "article-card-content";

  const category = document.createElement("small");
  category.textContent = article.category || "منوعات";
  category.style.color = "#a27b3f";

  const heading = document.createElement("h2");
  heading.textContent = article.title || "مقال من خبايا";

  const description = document.createElement("p");
  description.textContent = article.description || "";

  const date = document.createElement("small");
  date.textContent = khabayaFormatDate(article.date);
  date.style.color = "#788292";

  content.append(category, heading, description, date);
  link.appendChild(content);
  card.appendChild(link);

  return card;
}

function khabayaRenderArticles(container, articles = KHABAYA_ARTICLES) {
  if (!container) return;

  container.replaceChildren();

  if (!articles.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.innerHTML = "<h2>قريباً في خَبايا</h2><p>نعمل على إعداد مقالات جديدة لتشاركنا المعرفة.</p>";
    container.appendChild(empty);
    return;
  }

  [...articles]
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .forEach(article => container.appendChild(khabayaCreateCard(article)));
}

document.addEventListener("DOMContentLoaded", () => {
  khabayaRenderArticles(document.getElementById("articlesGrid"));
});

/* =========================================
   KHABAYA MAGAZINE - ARTICLES SYSTEM
   نظام عرض وإدارة بيانات المقالات
========================================= */

const KHABAYA_ARTICLES = [

  /*
  لإضافة مقال جديد، انسخ النموذج التالي
  وضعه داخل القائمة، مع الفاصلة بين المقالات:

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

/* أسماء الأقسام */
const KHABAYA_CATEGORIES = {
  technology: "التقنية والذكاء الاصطناعي",
  health: "الصحة والحياة",
  business: "المال والأعمال",
  education: "التعليم والمنح",
  society: "الثقافة والمجتمع",
  knowledge: "حقائق ومعرفة",
  internet: "الإنترنت والتطبيقات",
  stories: "قصص وتجارب",
  development: "تطوير الذات والمهارات",
  world: "اكتشف العالم"
};

/* تنسيق التاريخ */
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

/* إنشاء بطاقة مقال */
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
    image.onerror = () => image.remove();

    link.appendChild(image);
  }

  const content = document.createElement("div");
  content.className = "article-card-content";

  const category = document.createElement("small");
  category.textContent = article.category || "منوعات";

  const heading = document.createElement("h2");
  heading.textContent = article.title || "مقال من خبايا";

  const description = document.createElement("p");
  description.textContent = article.description || "";

  const date = document.createElement("small");
  date.textContent = khabayaFormatDate(article.date);

  content.append(category, heading, description, date);
  link.appendChild(content);
  card.appendChild(link);

  return card;
}

/* عرض المقالات */
function khabayaRenderArticles(container, articles = KHABAYA_ARTICLES) {
  if (!container) return;

  container.replaceChildren();

  const sortedArticles = [...articles].sort((a, b) => {
    return (b.date || "").localeCompare(a.date || "");
  });

  if (sortedArticles.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";

    const heading = document.createElement("h2");
    heading.textContent = "لا توجد مقالات حالياً";

    const paragraph = document.createElement("p");
    paragraph.textContent = "نعمل على إعداد مقالات جديدة في خبايا.";

    empty.append(heading, paragraph);
    container.appendChild(empty);
    return;
  }

  sortedArticles.forEach(article => {
    container.appendChild(khabayaCreateCard(article));
  });
}

/* البحث في المقالات */
function khabayaSearchArticles(query) {
  const search = String(query || "").trim().toLowerCase();

  if (!search) return KHABAYA_ARTICLES;

  return KHABAYA_ARTICLES.filter(article => {
    const searchableText = [
      article.title,
      article.description,
      article.category,
      article.keywords,
      article.author
    ].join(" ").toLowerCase();

    return searchableText.includes(search);
  });
}

/* التصفية حسب القسم */
function khabayaFilterCategory(category) {
  if (!category) return KHABAYA_ARTICLES;

  return KHABAYA_ARTICLES.filter(article => {
    return article.categorySlug === category;
  });
}

/* تشغيل صفحة جميع المقالات */
document.addEventListener("DOMContentLoaded", function () {

  const grid = document.getElementById("articlesGrid");

  if (!grid) return;

  const params = new URLSearchParams(window.location.search);

  const query = params.get("q") || "";
  const category = params.get("category") || "";

  let results = KHABAYA_ARTICLES;

  if (category) {
    results = khabayaFilterCategory(category);
  }

  if (query) {
    results = khabayaSearchArticles(query).filter(article => {
      return !category || article.categorySlug === category;
    });
  }

  khabayaRenderArticles(grid, results);

  const heading = document.querySelector(".articles-heading h1");

  if (heading && category && KHABAYA_CATEGORIES[category]) {
    heading.textContent = KHABAYA_CATEGORIES[category];
  } else if (heading && query) {
    heading.textContent = "نتائج البحث عن: " + query;
  }

});

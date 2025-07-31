const productList = document.getElementById("product-list");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const categorySelect = document.getElementById("category");

let allProducts = [];


searchInput.addEventListener("input", filterAndDisplayProducts);
sortSelect.addEventListener("change", filterAndDisplayProducts);
categorySelect.addEventListener("change", filterAndDisplayProducts);

function fetchAndDisplayProducts() {
  loading.style.display = "flex";
  productList.style.display = "none";

  Promise.all([
    fetch("https://fakestoreapi.com/products").then((res) => res.json()),
    fetch("https://fakestoreapi.com/products/categories").then((res) =>
      res.json()
    ),
  ])
    .then(([products, categories]) => {
      allProducts = products;

      categories.forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat[0].toUpperCase() + cat.slice(1);
        categorySelect.appendChild(opt);
      });

      loading.style.display = "none";
      productList.style.display = "grid";
      filterAndDisplayProducts(); // mahsulotlarni ko'rsatish
    })
    .catch((error) => {
      loading.innerHTML = "<p>Xatolik yuz berdi: " + error.message + "</p>";
    });
}

function filterAndDisplayProducts() {
  const query = searchInput.value.toLowerCase();
  const sort = sortSelect.value;
  const category = categorySelect.value;

  let filtered = allProducts.filter(
    (p) =>
      p.title.toLowerCase().includes(query) &&
      (category === "all" || p.category === category)
  );

  if (sort === "asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  displayProducts(filtered);
}


function displayProducts(products) {
  productList.innerHTML = "";
  if (products.length === 0) {
    productList.innerHTML = "<p>Mahsulot topilmadi.</p>";
    return;
  }

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p class="price">$${p.price}</p>
    `;
    productList.appendChild(card);
  });
}

fetchAndDisplayProducts();

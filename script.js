const accessKey = "d0-lxfdEisuHpBLAFiOk9172E99ER506J8-OY4oQKHE";

const searchForm = document.getElementById("search-form");
const searchbox = document.getElementById("search-box");
const searchHistory = document.getElementById("search-history");
const showMoreBtn = document.getElementById("show-more-btn");
const searchResult = document.getElementById("search-result");
const loadingSpinner = document.getElementById("loading-spinner");
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const captionText = document.getElementById("caption");
const downloadLink = document.getElementById("download-link");
const closeModal = document.getElementsByClassName("close")[0];

let keyword = "";
let page = 1;
let history = JSON.parse(localStorage.getItem('searchHistory')) || [];

function updateSearchHistory() {
    searchHistory.innerHTML = "";
    history.forEach((term, index) => {
        if (term) { // Avoid adding empty terms
            const div = document.createElement('div');
            const span = document.createElement('span');
            span.textContent = term;
            span.addEventListener('click', () => {
                searchbox.value = term;
                page = 1;
                searchImages();
                searchHistory.style.display = 'none';
            });
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                history.splice(index, 1);
                localStorage.setItem('searchHistory', JSON.stringify(history));
                updateSearchHistory();
            });
            div.appendChild(span);
            div.appendChild(deleteBtn);
            searchHistory.appendChild(div);
        }
    });
    searchHistory.style.display = history.length ? 'block' : 'none';
}

async function searchImages() {
    keyword = searchbox.value.trim();
    if (!keyword) return; // Do nothing if the search term is empty

    if (!history.includes(keyword)) {
        history.unshift(keyword);
        if (history.length > 10) history.pop(); // Limit history to 10 items
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
    updateSearchHistory();

    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;

    loadingSpinner.style.display = 'block';

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (page === 1) {
            searchResult.innerHTML = "";
        }

        const results = data.results;
        results.forEach((result) => {
            const image = document.createElement("img");
            image.src = result.urls.small;
            image.alt = result.description || "Unsplash Image";
            image.addEventListener('click', () => {
                openModal(result);
            });
            searchResult.appendChild(image);
        });

        if (data.total_pages > page) {
            showMoreBtn.style.display = "block";
        } 
        else {
            showMoreBtn.style.display = "none";
        }
    } 
    catch (error) {
        console.error(error);
    } 
    finally {
        loadingSpinner.style.display = 'none';
    }
}

function openModal(imageData) {
    modal.style.display = "block";
    modalImg.src = imageData.urls.regular;
    captionText.innerHTML = imageData.description || "Unsplash Image";
    downloadLink.href = imageData.urls.full;
}

closeModal.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    page = 1;
    searchImages();
    searchHistory.style.display = 'none';
});

showMoreBtn.addEventListener("click", () => {
    page++;
    searchImages();
});

searchbox.addEventListener('focus', () => {
    updateSearchHistory();
    searchHistory.style.display = 'block';
});

searchbox.addEventListener('blur', () => {
    setTimeout(() => {
        searchHistory.style.display = 'none';
    }, 200); // Add a slight delay to allow clicking on history items
});

const toggleDarkMode = document.createElement('button');
toggleDarkMode.textContent = 'Dark Mode';
toggleDarkMode.style.position = 'fixed';
toggleDarkMode.style.top = '20px';
toggleDarkMode.style.right = '20px';
toggleDarkMode.style.padding = '10px 20px';
toggleDarkMode.style.border = 'none';
toggleDarkMode.style.background = '#ff5f6d';
toggleDarkMode.style.color = 'white';
toggleDarkMode.style.borderRadius = '4px';
toggleDarkMode.style.cursor = 'pointer';
document.body.appendChild(toggleDarkMode);

toggleDarkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelector('form').classList.toggle('dark-mode');
    document.querySelector('input').classList.toggle('dark-mode');
    document.querySelector('button').classList.toggle('dark-mode');
    searchHistory.classList.toggle('dark-mode');
    modal.classList.toggle('dark-mode');
    captionText.classList.toggle('dark-mode');
    downloadLink.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    const mk = document.getElementById('heading-1');
    if(mk.style.color == 'white'){
        mk.style.color = 'black';
    }
    else{
        mk.style.color = 'white';
    }
});

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    document.querySelector('form').classList.add('dark-mode');
    document.querySelector('input').classList.add('dark-mode');
    document.querySelector('button').classList.add('dark-mode');
    searchHistory.classList.add('dark-mode');
    modal.classList.add('dark-mode');
    captionText.classList.add('dark-mode');
    downloadLink.classList.add('dark-mode');
}
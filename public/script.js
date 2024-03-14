const fetchAllButton = document.getElementById('fetch-quotes');
const fetchRandomButton = document.getElementById('fetch-random');
const fetchByAuthorButton = document.getElementById('fetch-by-author');

const quoteContainer = document.getElementById('quote-container');
const quoteText = document.querySelector('.quote');
const attributionText = document.querySelector('.attribution');
let singleQuotes = [];

const resetQuotes = () => {
  quoteContainer.innerHTML = '';
  singleQuotes = [];
}

const renderError = response => {
  quoteContainer.innerHTML = `<p>Your request returned an error from the server: </p>
<p>Code: ${response.status}</p>
<p>${response.statusText}</p>`;
}

const renderQuotes = (quotes = []) => {
  resetQuotes();
  if (quotes.length > 0) {
    quotes.forEach(quote => {
      const newQuote = document.createElement('div');
      newQuote.className = 'single-quote';
      newQuote.innerHTML = `<div class="quote-text">${quote.quote}</div>
      <div class="attribution">- ${quote.person}</div>
      <button onclick="editQuote(event)"><i>Edit this quote</i></button>
      `;
      quoteContainer.appendChild(newQuote);
    });
    singleQuotes = document.querySelectorAll('.single-quote');
    console.log(singleQuotes)
  } else {
    quoteContainer.innerHTML = '<p>Your request returned no quotes.</p>';
  }
}

fetchAllButton.addEventListener('click', () => {
  fetch('/api/quotes')
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      renderError(response);
    }
  })
  .then(response => {
    renderQuotes(response.quotes);
  });
});

fetchRandomButton.addEventListener('click', () => {
  fetch('/api/quotes/random')
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      renderError(response);
    }
  })
  .then(response => {
    renderQuotes([response.quote]);
  });
});

fetchByAuthorButton.addEventListener('click', () => {
  const author = document.getElementById('author').value;
  fetch(`/api/quotes?person=${author}`)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      renderError(response);
    }
  })
  .then(response => {
    renderQuotes(response.quotes);
  });
});

const editQuote = (e) => {
  const button = e.currentTarget
  button.style.display = "none"
  const quoteContainer = button.closest(".single-quote")
  const quoteDiv = quoteContainer.querySelector(".quote-text")
  const personDiv = quoteContainer.querySelector(".attribution")

  const quoteText = quoteDiv.innerText
  const personText = personDiv.innerText

  quoteDiv.innerHTML = `<input type="text" id="quote-text" name="quote-text" value="${quoteText}"></input>`
  personDiv.innerHTML = `<input type="text" id="attribution" name="attribution" value="${personText}"></input>`

  const submitButton = document.createElement("button")
  submitButton.setAttribute("type", "submit")
  submitButton.textContent = "Submit"
  quoteContainer.appendChild(submitButton)

  console.log(quoteDiv)
  console.log(personDiv)
  }
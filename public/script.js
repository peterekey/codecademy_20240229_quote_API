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
      newQuote.setAttribute("id", quote.id)
      newQuote.appendChild(renderQuoteAndPerson(quote))
      quoteContainer.appendChild(newQuote);
    });
    singleQuotes = document.querySelectorAll('.single-quote');
  } else {
    quoteContainer.innerHTML = '<p>Your request returned no quotes.</p>';
  }
}

const renderQuoteAndPerson = (quote) => {
  const quoteDetails = document.createElement("div")
  quoteDetails.className = "text-and-attribution"
  quoteDetails.innerHTML = `<div class="quote-text">${quote.quote}</div>
  <div class="attribution">- ${quote.person}</div>
  <button class="edit-quote" onclick="editQuote(event)"><i>Edit this quote</i></button>
  `;
  return quoteDetails
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
  const singleQuote = button.closest(".single-quote")
  const quoteDiv = singleQuote.querySelector(".quote-text")
  const personDiv = singleQuote.querySelector(".attribution")

  const quoteText = quoteDiv.innerText
  const personText = personDiv.innerText.slice(2)

  quoteDiv.innerHTML = `<input type="text" id="quote-text-input-${singleQuote.id}" name="quote-text" value="${quoteText}"></input>`
  personDiv.innerHTML = `<input type="text" id="attribution-input-${singleQuote.id}" name="attribution" value="${personText}"></input>`

  const submitButton = document.createElement("button")
  submitButton.className = "submit-change"
  submitButton.setAttribute("type", "submit")
  submitButton.textContent = "Submit"
  submitButton.addEventListener("click", (event) => handleSubmit(event, singleQuote))
  singleQuote.appendChild(submitButton)

  }

const handleEditAPI = async (quoteDetails, singleQuote) => {
  try {
    const response = await fetch(`/api/quotes/${quoteDetails.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quote: quoteDetails.quote,
        person: quoteDetails.person
      })
    })

    if(response.ok) {
      const JSON = await response.json()
      const submitButton = singleQuote.querySelector(".submit-change")
      const quoteTextAndAttribution = singleQuote.querySelector(".text-and-attribution")
      const editedQuote = renderQuoteAndPerson(JSON)
      quoteTextAndAttribution.remove()
      submitButton.remove()
      singleQuote.appendChild(editedQuote)
    } else {
      return renderError(response)
    }
  } catch (error) {
    console.error('Fetch error:' + error)
    renderError(error)
  }


}

const handleSubmit = (e, singleQuote) => {
  const quoteInput = singleQuote.querySelector(`#quote-text-input-${singleQuote.id}`)
  const personInput = singleQuote.querySelector(`#attribution-input-${singleQuote.id}`)

  const newQuote = quoteInput.value
  const newPerson = personInput.value
  const id = singleQuote.id

  const quoteDetails = {
    id: id,
    quote: newQuote,
    person: newPerson
  }
  handleEditAPI(quoteDetails, singleQuote)
}
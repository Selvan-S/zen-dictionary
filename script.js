const fetch_results = document.querySelector("#fetch-results");
const search_inp = document.querySelector("#search-input");
const search_form = document.querySelector("#search-form");

// Fetching data from dictionary api
async function getData(word) {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      {
        method: "GET",
      }
    );
    const data = await res.json();
    renderInfo(data);
  } catch (error) {
    console.log(error);
  }
}

// Rendering word info display it in card
function renderInfo(data) {
  if (data.title == "No Definitions Found") {
    return (fetch_results.innerHTML = `<h4 class="text-primary d-flex justify-content-center">No Definitions Found</h4>`);
  } else {
    fetch_results.innerHTML = `
      <div class="card m-4">
        <div class="card-header text-center text-capitalize">
          ${data[0].word}
        </div>
        <div class="card-body">
          <span class="fw-bold text-info">Audio: </span>

            <audio controls>
              ${data[0].phonetics.map((val) => {
                if (val.audio != undefined) {
                  return `
                <source src=${val.audio} type="audio/ogg">
                <source src=${val.audio} type="audio/mpeg">
                `;
                }
              })}
              Your browser does not support the audio element.
            </audio>

          <p class="card-text">
            <span class="fw-bold text-info">Origin:</span> <span>${
              data[0].origin
            }</span> <br />
            <span class="fw-bold text-info">Meanings:</span> 
            ${
              !data[0].meanings.length
                ? "N/A"
                : getDefinitions(data[0].meanings)
            }
          </p>
        </div>
      </div>
    `;
  }
}

// Handling Submit
search_form.addEventListener("submit", (e) => {
  e.preventDefault();
  let inputValue = search_inp.value.trim();
  let filterValue = inputValue.split(" ").join("%20");
  if (!filterValue) {
    alert("Input should not be empty");
  } else {
    fetch_results.innerHTML = spinner();
    search_form.reset();
    getData(filterValue.toLowerCase());
  }
});

// Display Spinner while fetching and display the data
function spinner() {
  return `<div class="spinner-border text-primary d-flex justify-content-center mx-auto w-full" role = "status">
    </div >`;
}

// Looping through definitions and display it in Bootstrap list
function getDefinitions(data) {
  return `
  <ul class="list-group list-group-flush">
    ${data.map((val) => {
      return `
      <li class="list-group-item">
        <span class="text-secondary">Part Of Speech:</span> <span>${
          val.partOfSpeech
        }</span><br/>
        <span class="text-secondary">Definitions:</span> <span>${
          val.definitions[0].definition
        }</span><br/>
        <span class="text-secondary">Example:</span> <span>${
          val.definitions[0].example
        }</span><br/>
        <span class="text-secondary">Synonyms: </span>
        ${
          val.synonyms.length != 0
            ? `<span>${[...val.synonyms]}</span><br/>`
            : "N/A <br/>"
        }
        <span class="text-secondary">Antonyms: </span>
        ${
          val.antonyms.length != 0
            ? `<span>${[...val.antonyms]}</span><br/>`
            : "N/A <br/>"
        }
        
      </li>`;
    })}
  </ul>`;
}

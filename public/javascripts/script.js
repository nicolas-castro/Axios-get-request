document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');
  let errDiv;

const restCountriesApi = axios.create({
    baseURL: 'https://restcountries.eu/rest/v2/name/'
});

function getCountryInfo(theName) {
    restCountriesApi.get(theName)
    .then(responseFromAPI => {
    removeErrDiv();
    const countryName = responseFromAPI.data[0].name;
    const countryCapital = responseFromAPI.data[0].capital;
    
// instead in the console, show data in the browser using JS DOM manipulation:
    document.getElementById("countryName").innerHTML = countryName;
    document.getElementById("countryCapital").innerHTML = "Capital: " + countryCapital;            
})
.catch(err => {
        if(err.response.status === 404){
            removeCountryInfo();
            createDiv();
            const theErr = document.createTextNode(`What the heck is ${theName}? 🤭`); 
            errDiv.appendChild(theErr);        
        } else {
            console.log('err => ', err)
        }
    })
}

function createDiv(){
    errDiv = document.createElement("div"); 
    errDiv.setAttribute("id", "error");
    document.body.appendChild(errDiv); 
}

function removeErrDiv(){
    if(document.getElementById("error")){
        const error = document.getElementById("error");
        error.parentNode.removeChild(error);
    }
}

function removeCountryInfo(){
    document.getElementById("countryName").innerHTML = "";
    document.getElementById("countryCapital").innerHTML = "";
}

function checkInput() {
    removeErrDiv();
    if(document.getElementById("theInput").value === "") { 
        document.getElementById('theButton').disabled = true; 
        removeCountryInfo();
        createDiv();
        const theErr = document.createTextNode(`Wanna input something? 🤪`); 
        errDiv.appendChild(theErr); 
    } else { 
        document.getElementById('theButton').disabled = false;
    }
}

document.getElementById("theButton").onclick = function(){
    removeErrDiv();
    const country = document.getElementById("theInput").value;       
    getCountryInfo(country);
}

const stockInfo  = axios.create({
  baseURL: 'https://api.iextrading.com/1.0/stock/',
});

const stockTicket = "amzn";

stockInfo.get(`${stockTicket}/chart`)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
});

stockInfo.get(`${stockTicket}/chart`)
    .then(response => {
      printTheChart(response.data);
    })
    .catch( error => {
      console.log(error);
  });

const printTheChart = (stockData => {
  const stockLabels = stockData.map( element => element.date);
  const stockPrice = stockData.map( element => element.close);
  const ctx = document.getElementById('myChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: stockLabels,
      datasets: [{
        label: "Stock Chart",
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: stockPrice,
      }]
    }
  });
});

}, false);

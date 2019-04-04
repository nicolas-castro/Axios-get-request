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

// When the WALL-E button is clicked
document.getElementById("post-wall-e").onclick = function() {
  // Create an object with data to submit
  const characterInfo = {
     name:       'WALL-E',
     occupation: 'Waste Allocation Robot',
     weapon:     'Head laser'
   };
   // Make a POST request
   axios.post('https://ih-crud-api.herokuapp.com/characters',characterInfo)
     .then(response => {
          const { name, id } = response.data;
          const newCharacterHtml = 
             `
               <li>
                 <h3> ${name} </h3>
                 <p> Id: ${id} </p>
               </li>
             `;
         document.getElementById("characters-list").innerHTML += newCharacterHtml;
         console.log('post successfull and the response is: ',response );
     })
     .catch(error => {
         console.log('Oh No! Error is: ', error);  
     })
 }

 document.getElementById("character-form").onsubmit = function(event) {
  
  event.preventDefault(); // <= !!!

  console.log('form submit');
};

const theNames = document.getElementsByClassName("the-name");
const theOccupations = document.getElementsByClassName("the-occupation");
const theWeapons = document.getElementsByClassName("the-weapon");

document.getElementById("character-form").onsubmit = function(event) {
  event.preventDefault();
 
  const characterInfo = {
     name: theNames[0].value,
     occupation: theOccupations[0].value,
     weapon: theWeapons[0].value
  };
 
   axios.post('https://ih-crud-api.herokuapp.com/characters', characterInfo)
     .then(response => {
         const { name, id } = response.data;
         const newCharacterHtml = `
         <li>
           <h3> ${name} </h3>
           <p> Id: ${id} </p>
         </li>
         `;
         document.getElementById("characters-list").innerHTML += newCharacterHtml;
       // Clear the form after submitting:
         document.getElementById("character-form").reset();

     })
     .catch(error => {
         console.log("Error is: ", error);
     })
}

document.getElementById("getButton").onclick = function(event){
  const theId = document.getElementById("theCharId").value;
  axios.get(`https://ih-crud-api.herokuapp.com/characters/${theId}`)
      .then(response => {
          console.log('Response from the API is: ', response);
      })
      .catch(error => {
          console.log("The error is: ", error);
      });
}

document.getElementById("getButton").onclick = function(event){
  const theId = document.getElementById("theCharId").value;
  axios.get(`https://ih-crud-api.herokuapp.com/characters/${theId}`)
    .then(response => {
        // console.log('Response from the API is: ', response.data);
        
        // The following lane hides the form to create a new character when we are updating one
        document.getElementById("character-form").style.display = "none";
        document.getElementById("updateForm").style.display = "block";
        theNames[1].value = response.data.name;
        theOccupations[1].value = response.data.occupation;
        theWeapons[1].value = response.data.weapon;
    })
    .catch(error => {
    // console.log("The error is: ", error);
        document.getElementById("updateForm").style.display="none";
        if(error.response.status === 404){
            const errorMessage = `There's no character with id: ${theId}. Try some other ID.`
            const errDiv = document.createElement("div");
            errDiv.setAttribute("id", "error");
            errDiv.innerHTML = errorMessage;
            document.body.appendChild(errDiv);
        }
  });
}
document.getElementById("update-form").onsubmit = function(event){
  event.preventDefault();
  const theId = document.getElementById("theCharId").value;
  const updatedcharacterInfo = {
    name: theNames[1].value,
    occupation: theOccupations[1].value,
    weapon: theWeapons[1].value
  };
  
  axios.patch(`https://ih-crud-api.herokuapp.com/characters/${theId}`, updatedcharacterInfo)
    .then(response => {
          console.log('update successful: ', response);
          document.getElementById("update-form").reset();
    })
    .catch(error => {
        console.log(error);
    })
}

}, false);

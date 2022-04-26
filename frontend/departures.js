function onSubmitTest(event) {
    event.preventDefault();

    const postcode = document.getElementById('postcode').value;

    var xhttp = new XMLHttpRequest();

    xhttp.open('GET', `http://localhost:3000/departureBoards?postcode=${postcode}`, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onload = function() {
        const resultElement = document.getElementById("results");
        resultElement.innerHTML = "";
        const resultsHeader = document.createElement('h2');
        resultsHeader.innerText = "Results";
        resultElement.appendChild(resultsHeader);

        const busStopArray = JSON.parse(xhttp.responseText);
        busStopArray.forEach((busStop) => {
            // Create elements for our bus Stop
            const busStopNameHeader = document.createElement('h3');
            busStopNameHeader.innerText = `${busStop.name} (${busStop.indicator})`;
            resultElement.appendChild(busStopNameHeader);

            const arrivalsList = document.createElement('ul');
            busStop.arrivals.forEach((arrival) => {
                const arrivalElement = document.createElement('li');
                arrivalElement.innerText = `${arrival.routeNumber} ${moment.utc(arrival.arrivalTime).fromNow()}`;
                arrivalsList.appendChild(arrivalElement);
            });
            resultElement.appendChild(arrivalsList);
        });
    }

    xhttp.send();
}
var date = moment().format("YYYY-MM-DD");
var end = moment().add(14, 'days').format("YYYY-MM-DD");
console.log(end);
var count = 0;





$("#add-params").on("click", function(){


city = $("#city-input").val();
localStorage.setItem('city', city);
var miles = $("#miles-input").val();
state = $("#select-state option:selected").attr("value");
localStorage.setItem('state', state);
console.log(state);
var queryURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&stateCode=${state}&startDateTime=${date}T14:00:00Z&endDateTime=${end}T14:00:00Z&radius=${miles}&unit=miles&apikey=VVhqdJgL8bOLqDeCOvQzEaDiHBKw5xvC`;
console.log(queryURL);
$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
      console.log(response);
    $("#instructions").html(`<p>Browse the list of events over the next 2 weeks below and click the "Select" button next to your choice.</p>
    <p>You can click the "Link to Details" to view in TicketMaster more details on it.</p>`);
    $("#options").append(response._embedded.events.map(show));
    count = 0;
  });
});


$(document).on("click", ".select", function(){
    localStorage.setItem('event', $(this).attr("event"));
    localStorage.setItem('time', $(this).attr("time"));
    localStorage.setItem('date', $(this).attr("date"));
    $("#options").html(``);
    $("#instructions").html(``);
    $("#find").html(`
    <th>
                <div class="form-group">
                    <label for="name-input">What type of food do you want?</label>
                    <input class="form-control" id="food-input" type="text">
                </div>
            </th>
            <th>
            $: <input type="checkbox" class="myCheck">
            $$: <input type="checkbox" class="myCheck">
            $$$: <input type="checkbox" class="myCheck">
            $$$$: <input type="checkbox" class="myCheck">
            </th>
            <br>
            <th>
                <button type="button" class="btn btn-dark" id="new-params">Submit</button>
            </th>
    `)
    
});


function show(r){
    var i = count;
    var time = moment(r.dates.start.localTime, 'HH:mm').format('hh:mm a');
    count ++;
    return `</br><button class="select" value="${i}" event="${r.name}" time="${time}" date="${r.dates.start.localDate}">select</button>
    <h5>${r.name}</h5><p>Date/Time: ${r.dates.start.localDate} ${time}</p>
    <a href="${r.url}">Link to Details</a>
    <img src="${r.images[0].url}"/></br>
    <hr>`
}

$(document).on("click", "#new-params", function(){

    var food = $("#food-input").val();
    var city = localStorage.getItem('city');
   
    var newURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${food}&location=${city}`;

    $.ajax({
       url: newURL,
       headers: {
        'Authorization':'Bearer 1CVYoXqsRViH_HtqoMSa7s5kkNBOA8qLuUeqLM2TAaekisIeSLsahjgzH7hcRCbXF7ltlBapaeEBqTm8ojpZB9xPcCuiyUzjMQw9NaxwlPrkF_QJZQgQiFmSsnu2XHYx',
    },
       method: 'GET',
       dataType: 'json',
       success: function(data){
          console.log(data);
          $("#instructions").html(`<p>Browse the list of restaurants in your area.</p>
          <p>And then select the one you want to go to.</p>`);
          $("#choices").append(data.businesses.map(display));
       }
    });
});


function display(r){
    var i = count;
    count ++;
    return `</br><button class="newSelect" value="${i}" name="${r.name}">select</button>
    <h5>${r.name}</h5><p>Price: ${r.price} Phone Number: ${r.display_phone} Address: ${r.location.display_address[0]}, ${r.location.display_address[1]}</p>
    <a href="${r.url}">Link to Details on Yelp</a>
    <img src="${r.image_url}"/></br>
    <hr>`
}


$(document).on("click", ".newSelect", function(){
    $("#options").html(``);
    $("#instructions").html(``);
    $("#find").html(``);
    $("#choices").html(``);
    $("#results").html(`
    <h1>You are going to eat at ${$(this).attr("name")}.<h1>
    <h1>And then going to ${localStorage.getItem('event')} at ${localStorage.getItem('time')} on ${localStorage.getItem('date')}
    `);
});
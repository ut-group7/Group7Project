var config = {
  apiKey: "AIzaSyDDxX6GASYnkjZK_ETcT02vI2HL4IaVYmo",
  authDomain: "group7-e91b6.firebaseapp.com",
  databaseURL: "https://group7-e91b6.firebaseio.com",
  projectId: "group7-e91b6",
  storageBucket: "group7-e91b6.appspot.com",
  messagingSenderId: "427946972311"
};
firebase.initializeApp(config);
const database = firebase.database();
var user = firebase.auth().currentUser;
//===============================================================================================================
// sign up new user
$(document).on("click", "#signUp", function() {
  event.preventDefault();
  var data = {
    email: $("#registerEmail").val(), //get the email from Form
    password: $("#registerPassword").val() //get the pass from Form
  };
  firebase
    .auth()
    .createUserWithEmailAndPassword(data.email, data.password)
    .then(function(user) {
			$("#signUpSuccess").html(`
			<p>You are now signed up!</p>
			`);
			console.log("Successfully created user account with uid:", user.uid);
			$("#errorFrame").hide();
    })
    .catch(function(error) {
			console.log("Error creating user:", error);
			$("#errorFrame").html(`
			<p>An error has occured, "${error.message}"</p>
			`)
    });
  console.log(data);
});
//===================================================================================================================
//login if already a user
//===========================================================
$(document).on("click", "#login", function(){
	event.preventDefault();
	var data = {
		email: $("#loginEmail").val(),
		password: $("#loginPassword").val()
};
firebase
		.auth()
		.signInWithEmailAndPassword(data.email, data.password)
		.then(function(){
				$("#loginSuccess").html(`
				<p>You have logged in</p>
				`)
				$("#loginFail").hide();
		})
		.catch(function(err){
				console.error(err);
				$("#loginFail").html(`
				<p>An error has occured, "${err.message}"</p>
				`)
		});
		
})
//===========================================================
//================================
//sign out
$(document).on("click", "#logOutBtn", function(){
	event.preventDefault();
firebase
.auth()
.signOut()
.then(function(){
	console.log("sign out successful")
	$("#logOutSuccess").text("You have been signed out");
}).catch(function(error){
	console.log("an error occured:", error)
	})
});
//================================
// show appropriate buttons based on if user is logged in or not
firebase.auth().onAuthStateChanged(function(user){
	if (user) {
		console.log("a user is signed in");
		$("#signUpBtn").hide();
				$("#logInBtn").hide();
				$("#logOutBtn").show();
				$("#eventBtn").show();
	} else {
		console.log("no user is signed in")
		$("#signUpBtn").show();
				$("#logInBtn").show();
				$("#logOutBtn").hide();
				$("#eventBtn").hide();
	}
})

//===================================================================

var date = moment().format("YYYY-MM-DD");
var end = moment()
  .add(14, "days")
  .format("YYYY-MM-DD");
console.log(end);
var count = 0;
var page = 0;
var miles;
var address;

$("#add-params").on("click", function() {
  city = $("#city-input").val();
  sessionStorage.setItem("city", city);
  miles = $("#miles-input").val();
  state = $("#select-state option:selected").attr("value");
  var category = "";
  category = $("#search-input").val();
  var keyword = "";
  if (category !== "") {
    keyword = `&keyword=${category}`;
  }
  sessionStorage.setItem("state", state);
  console.log(state);
  var queryURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&stateCode=${state}&startDateTime=${date}T14:00:00Z&endDateTime=${end}T14:00:00Z&radius=${miles}&unit=miles&size=10&page=${page}${keyword}&apikey=VVhqdJgL8bOLqDeCOvQzEaDiHBKw5xvC`;
  console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    $(
      "#instructions"
    ).html(`<p>Browse the list of events over the next 2 weeks below and click the "Select" button next to your choice.</p>
    <p>You can click the "Link to Details" to view in TicketMaster more details on it.</p>`);
    $("#options").html(``);
    $("#options").append(response._embedded.events.map(show));
    $("#next").html(makePages(response.page.totalPages));
    count = 0;
  });
});

function makePages(p) {
	var pages = [];
	for (var i = 0; i < p; i++) {
		pages.push(`<span class="page" data-page="${i}"> ${i + 1}</span>`);
	}
  pages = "Pages:  " + pages.join();
  return pages;

}


$(document).on("click", ".page", function(){
  page = $(this).attr("data-page");
  console.log(this);
  $("#options").html("");
  var queryURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&stateCode=${state}&startDateTime=${date}T14:00:00Z&endDateTime=${end}T14:00:00Z&radius=${miles}&unit=miles&size=10&page=${page}&apikey=VVhqdJgL8bOLqDeCOvQzEaDiHBKw5xvC`;
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

$(document).on('click', '.select', function() {
	sessionStorage.setItem('event', $(this).attr('event'));
	sessionStorage.setItem('time', $(this).attr('time'));
	sessionStorage.setItem('date', $(this).attr('date'));
	sessionStorage.setItem('link', $(this).attr('link'));
  sessionStorage.setItem('tmAddress', $(this).attr('address'));
  $("#home-Submit").html(``);
	$('#options').html(``);
	$('#instructions').html(``);
	$('#next').html(``);
	$('#find').html(`
    <th>
                <div class="form-group">
                    <label for="name-input">Food Type</label>
                    <input class="form-control" id="food-input" type="text">
                </div>
            </th>
            <th id=dollar-data class=rounded-pill>
            $: <input type="checkbox" name="price" class="myCheck"  value="1">
            $$: <input type="checkbox" name="price2" class="myCheck"  value="2">
            $$$: <input type="checkbox" name="price3" class="myCheck"  value="3">
            $$$$: <input type="checkbox" name="price4" class="myCheck"  value="4">
           </th>
            <br>
            <th>
                <button type="button" class="btn btn-primary btn-lg" id="new-params">Submit</button>
            </th>
    `);
  $("#next").html("");
});

function show(r) {
	var i = count;
  var back = "";
  if(i===0 || i%2===0){
    back = "dark";
  }else{
    back = "light";
  }
	address =
		r._embedded.venues[0].address.line1 +
		', ' +
		r._embedded.venues[0].city.name +
		', ' +
		r._embedded.venues[0].state.name;
	var time = moment(r.dates.start.localTime, 'HH:mm').format('hh:mm a');
	count++;
  return `
  <div class="row eachResult ${back}">
    <div class="col-md-6 info">
      <div class="d-flex flex-column info">
        <div class="p-2"><p>Date: ${r.dates.start.localDate}</p></div>
        <div class="p-2"><h5>${r.name}</h5></div>
        <div class="p-2"><p>${address} ${time}</p></div>
        <div class="p-2"><a href="${r.url}" target="_blank">Link to Details</a></div>
      </div>   
    </div>
      <div class="col-md-2"></div>
      <div class="col-md-4">
        <div class="p-2"><img alt="Venue Image" src="${r.images[0].url}"/></div>
        <div class="p-2"><button type="button" class="btn btn-primary select" backColor="${back}" value="${i}" event="${r.name}" time="${time}" date="${r.dates.start
          .localDate}" link="${r.url}" address="${address}">select</button></div>
      </div>
    </div> 
  </div>
  `;
}

$(document).on('click', '#new-params', function() {
	var food = $('#food-input').val();
	var city = sessionStorage.getItem('city');

	var dollars = $("input[name='price']:checked").val();
	var dollars2 = $("input[name='price2']:checked").val();
	var dollars3 = $("input[name='price3']:checked").val();
	var dollars4 = $("input[name='price4']:checked").val();
	var dollarSign = isChecked(dollars, dollars2, dollars3, dollars4);

	function isChecked(dollars, dollars2, dollars3, dollars4) {
		var dollarSign = '';
		if (dollars !== undefined) {
			dollarSign = dollars;
		}
		if (dollars2 !== undefined) {
			if (dollarSign === '') {
				dollarSign = dollars2;
			} else {
				dollarSign = dollarSign + ',' + dollars2;
			}
		}
		if (dollars3 !== undefined) {
			if (dollarSign === '') {
				dollarSign = dollars3;
			} else {
				dollarSign = dollarSign + ',' + dollars3;
			}
		}
		if (dollars4 !== undefined) {
			if (dollarSign === '') {
				dollarSign = dollars4;
			} else {
				dollarSign = dollarSign + ',' + dollars4;
			}
    }
    if(dollarSign === ''){
      return dollarSign;
    }
    dollarSign = "&price=" + dollarSign;
    return dollarSign;
	}

	var eventTime = sessionStorage.getItem('time');
	var isOpen = moment(eventTime, 'hh:mm a').subtract(3, 'hours').format('X');

	var newURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${food}&location=${city}${dollarSign}&limit=10&open_at=${isOpen}`;

	$.ajax({
		url: newURL,
		headers: {
			Authorization:
				'Bearer 1CVYoXqsRViH_HtqoMSa7s5kkNBOA8qLuUeqLM2TAaekisIeSLsahjgzH7hcRCbXF7ltlBapaeEBqTm8ojpZB9xPcCuiyUzjMQw9NaxwlPrkF_QJZQgQiFmSsnu2XHYx'
		},
		method: 'GET',
		dataType: 'json',
		success: function(data) {
			console.log(data);
			$('#instructions').html(`<p>Browse the list of restaurants in your area.</p>
          <p>And then select the one you want to go to.</p>`);
      $("#choices").html(``);
      $("#choices").append(data.businesses.map(display));
    }
  });
});

function display(r) {
  var yAddress = r.location.display_address.join(" ");
  var i = count;
  var back = "";
  count++;
  if(i===0 || i%2===0){
    back = "even";
  }else{
    back = "odd";
  }
  return `
  <div class="row yResults ${back}">
    <div class="col-md-6 left">
      <div class="d-flex flex-column">
        <div class="p-2"><h5>${r.name}  Price: ${r.price}</h5></div>
        <div class="p-2"> Phone Number: ${r.display_phone}</div>
        <div class="p-2"> Address: ${yAddress}</div>
        <div class="p-2"> <a href="${r.url}" target="_blank">Link to Details on Yelp</a> </div>
      </div> 
    </div> 
    <div class="col-md-2"></div>  
    <div class="col-md-4 right">
      <div class="p-2"><img alt="Venue Image" src="${r.image_url}"/></div>
      <div class="p-2"><button type="button" class="btn btn-primary newSelect" value="${i}" name="${r.name}" address="${yAddress}">select</button></div>
    </div>
  </div>  
		`;
}

$(document).on('click', '.newSelect', function() {
	var user = firebase.auth().currentUser;
	sessionStorage.setItem('yAddress', $(this).attr('address'));
	sessionStorage.setItem('yName', $(this).attr('name'));
	$('#options').html(``);
	$('#instructions').html(``);
	$('#find').html(``);
	$('#choices').html(``);
	$('#results').html(`
    <h1>You are going to eat at ${$(this).attr('name')}.</h1>
    <h1>And then going to ${sessionStorage.getItem(
		'event'
	)} at ${sessionStorage.getItem('time')} on ${sessionStorage.getItem('date')}</h1>
    <a href="${sessionStorage.getItem('link')}" target="_blank">Purchase Tickets</a>
		`);
		var user = firebase.auth().currentUser;
		if (user) {
		var newPostRef = 	database.ref('users/' + user.uid).push({
			event: sessionStorage.getItem('event'),
			time: sessionStorage.getItem('time'),
			date: sessionStorage.getItem('date'),
			link: sessionStorage.getItem('link'),
			food: sessionStorage.getItem('yName'),
		})
		console.log(user.uid);
		var postId = newPostRef.key;
		console.log(postId);
		// var admin = require("firebase-admin");
		// var db = admin.database();
		// var ref = db.ref('users/user.uid/postId');
		// ref.on("value", function(snapshot){
		// 	console.log(snapshot.val());
		// }, function (errorObject) {
		// 	console.log("The read failed: " + errorObject.code);
		// });
	}
	// calls mapbox to map location selected
	mapIt();
});

function mapIt() {
	var destination = sessionStorage.getItem('tmAddress');
	var city = sessionStorage.getItem('city');
	console.log('destination ' + destination);
	mapboxgl.accessToken = 'pk.eyJ1IjoiZnJlZDFuIiwiYSI6ImNqdW5ibmkyMjBpMnc0MHBuZXlxc3dkcHgifQ.O_czpPEJoyLfkymB0dicCQ';
	var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v11',
		center: [ -79.4512, 43.6568 ],
		zoom: 13
	});
	map.on('load', function() {
		var directions = new MapboxDirections({
			accessToken: mapboxgl.accessToken
		});
		map.addControl(directions, 'top-left');
	})
}


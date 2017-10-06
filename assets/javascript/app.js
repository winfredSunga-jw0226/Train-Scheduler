  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCY4bI6TdF_Ftb5jl71xUsVqDplEat0UVA",
    authDomain: "train-schedule-34baf.firebaseapp.com",
    databaseURL: "https://train-schedule-34baf.firebaseio.com",
    projectId: "train-schedule-34baf",
    storageBucket: "",
    messagingSenderId: "748574430618"
  };
  firebase.initializeApp(config);

  //create an instance of firebase database
  var database = firebase.database();

  //declare and initialize variables 
  var trainName = "";
  var destination = "";
  var firstArrivalTime = "";
  var frequencyMinutes = 0; 

  //variables which be derived using Moment.js
  var nextArrival = "";
  var minutesAway = 0;

  //capture on first-load or on child added events
  database.ref("/train-schedules").on("child_added", function(snapshot) {
    //store snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    //assign the values into variables
    trainName = sv.trainName;
    destination = sv.destination;
    frequencyMinutes = sv.frequencyMinutes;
    firstArrivalTime = moment({hour : sv.firstArrivalTime.split(":")[0], minute : sv.firstArrivalTime.split(":")[1]}); 

    // console.log("first arrival time : " + firstArrivalTime);

    //get the total # of minutes elapsed from the start time - this will help us derived the minutes away value
    var minutesElapsedFromFirstArrival = moment().diff(firstArrivalTime, "minutes");

    // console.log("minutesElapsedFromFirstArrival : " + minutesElapsedFromFirstArrival);

    //derive the minutes away value
    var minutesAway = parseInt(frequencyMinutes) - parseInt(minutesElapsedFromFirstArrival) % parseInt(frequencyMinutes);

    //I want to see "0 minutes away" from the schedule whenever the current time matches the next arrival time
    if (minutesAway === parseInt(frequencyMinutes)) {
      minutesAway = 0;
    } 

    //derive the next arrival time
    nextArrival = moment().add(minutesAway, 'm').format("hh:mm A");
  
    //create a new table row
    var row = $("<tr>");

    //creatre td elements per column in the table
    var td1 = $("<td>").addClass("td1").text(trainName);
    var td2 = $("<td>").addClass("td2").text(destination);
    var td3 = $("<td>").addClass("td3").text(frequencyMinutes);
    var td4 = $("<td>").addClass("td4").text(nextArrival);
    var td5 = $("<td>").addClass("td5").text(minutesAway); //(minutesAway);

    row.append(td1, td2, td3, td4, td5);

    //display each train schedules as new rows in the first panel
    $("table").append(row);
  });


   //capture submit button click event
  $("#submit").on("click", function() {
    //prevent window from refreshing
    event.preventDefault();

    //grab the values from the html input text boxes
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstArrivalTime = $("#first-arrival-time").val().trim();
    frequencyMinutes = $("#frequency").val().trim();

    //push the data into firebase
    database.ref("/train-schedules").push({
      trainName : trainName,
      destination : destination,
      firstArrivalTime : firstArrivalTime,
      frequencyMinutes : frequencyMinutes 
    });

    // console.log(trainName);
    // console.log(destination);
    // console.log(firstArrivalTime);
    // console.log(frequencyMinutes);

  });


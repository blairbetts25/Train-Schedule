$(document).ready(function () {
    var trainName;
    var trainDestination;
    var firstTrainTime;
    var trainFrequency;
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB9qaI2BUBrzApBoB1JcrsXvGwezRlruew",
        authDomain: "train-schedule-cf938.firebaseapp.com",
        databaseURL: "https://train-schedule-cf938.firebaseio.com",
        projectId: "train-schedule-cf938",
        storageBucket: "",
        messagingSenderId: "679871458793"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    $("#add-train-btn").on("click", function (event) {
        event.preventDefault();

        // Grabs user input
        trainName = $("#train-name-input").val().trim();
        trainDestination = $("#destination-input").val().trim();
        firstTrainTime = moment($("#arival-input").val().trim(), "HH:mm").format("hh:mm");
        trainFrequency = $("#rate-input").val().trim();

        // Creates local "temporary" object for holding employee data
        var newTrain = {
            name: trainName,
            destination: trainDestination,
            arival: firstTrainTime,
            rate: trainFrequency
        };

        // Uploads employee data to the database
        database.ref().push(newTrain);

        // Logs everything to console
        alert("Train successfully added");

        // Clears all of the text-boxes
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#arival-input").val("");
        $("#rate-input").val("");
    });
    database.ref().on("child_added", function (childSnapshot) {

        // Store everything into a variable.
        trainName = childSnapshot.val().name;
        trainDestination = childSnapshot.val().destination;
        firstTrainTime = childSnapshot.val().arival;
        trainFrequency = childSnapshot.val().rate;


       // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");

        // Current Time
        var currentTime = moment();

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        // Time apart (remainder)
        var tRemainder = diffTime % trainFrequency;

        // Minute Until Train
        var tMinutesTillTrain = trainFrequency - tRemainder;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(trainDestination),
            $("<td>").text(trainFrequency),
            $("<td>").text(moment(nextTrain).format("hh:mm A")),
            $("<td>").text(tMinutesTillTrain),
        );

        // Append the new row to the table
        $("#train-table > tbody").append(newRow);
    });

})
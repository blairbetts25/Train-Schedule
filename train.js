$(document).ready(function () {
    var trainName;
    var trainDestination;
    var firstTrainTime;
    var trainFrequency;

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


        trainName = $("#train-name-input").val().trim();
        trainDestination = $("#destination-input").val().trim();
        firstTrainTime = moment($("#arival-input").val().trim(), "HH:mm").format("hh:mm");
        trainFrequency = $("#rate-input").val().trim();


        var newTrain = {
            name: trainName,
            destination: trainDestination,
            arival: firstTrainTime,
            rate: trainFrequency
        };


        database.ref().push(newTrain);


        alert("Train successfully added");


        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#arival-input").val("");
        $("#rate-input").val("");
    });
    database.ref().on("child_added", function (childSnapshot) {


        trainName = childSnapshot.val().name;
        trainDestination = childSnapshot.val().destination;
        firstTrainTime = childSnapshot.val().arival;
        trainFrequency = childSnapshot.val().rate;


        var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");

        var currentTime = moment();

        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        var tRemainder = diffTime % trainFrequency;

        var tMinutesTillTrain = trainFrequency - tRemainder;

        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(trainDestination),
            $("<td>").text(trainFrequency),
            $("<td>").text(moment(nextTrain).format("hh:mm A")),
            $("<td>").text(tMinutesTillTrain),
        );

        $("#train-table > tbody").append(newRow);
    });

})
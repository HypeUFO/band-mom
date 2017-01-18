// this is mock data, but when we create our API
// we'll have it return data that looks like this

const MOCK_EVENTS = {
    "events": [{
        "venueName": "The Rainbow Room",
        "venueAddress": "9015 W Sunset Blvd West Hollywood, CA 90069",
        "eventDate": "February 2, 2017",
        "startTime": "9:00",
        "soundCheckTime": "8:00",
        "manifest": {},
        "userId": "111111" // The user id of the user that made the event
    }, {
        "venueName": "Loaded",
        "venueAddress": "6377 Hollywood Blvd Los Angeles, CA 90028",
        "eventDate": "March 2, 2017",
        "startTime": "8:00",
        "soundCheckTime": "7:00",
        "manifest": {},
        "userId": "333333" // The user id of the user that made the event
    }, {
        "venueName": "The Satellite",
        "venueAddress": "1717 Silver Lake Blvd Los Angeles, CA 90026",
        "eventDate": "December 2, 2017",
        "startTime": "9:00",
        "soundCheckTime": "7:00",
        "manifest": {},
        "userId": "222222" // The user id of the user that made the event
    }, {
        "venueName": "The Rainbow Room",
        "venueAddress": "9015 W Sunset Blvd West Hollywood, CA 90069",
        "eventDate": "February 2, 2017",
        "startTime": "9:00",
        "soundCheckTime": "8:00",
        "manifest": {},
        "userId": "444444" // The user id of the user that made the event
    }]
};

const MOCK_USERS = {
    "users": [{
        "id": "1111111",
        "firstName": "John",
        "lastName": "Doe",
        "userName": "johndoe123",
        "password": "password123",
        "hash": "string",
        "salt": "string",
        "email": "johndoe@gmail.com",
        "phone": "555-555-5555"
    }, {
        "id": "2222222",
        "firstName": "John",
        "lastName": "Smith",
        "userName": "johnsmith123",
        "password": "password123",
        "hash": "string",
        "salt": "string",
        "email": "johnsmith@gmail.com",
        "phone": "555-555-5555"
    }, {
        "id": "333333",
        "firstName": "Jane",
        "lastName": "Smith",
        "userName": "janesmith123",
        "password": "password123",
        "hash": "string",
        "salt": "string",
        "email": "janesmith@gmail.com",
        "phone": "555-555-5555"
    }, {
        "id": "444444",
        "firstName": "John",
        "lastName": "Doe",
        "userName": "janedoe123",
        "password": "password123",
        "hash": "string",
        "salt": "string",
        "email": "janedoe@gmail.com",
        "phone": "555-555-5555"
    }]
};

// NEW EVENT SETUP GUIDE

const QUESTIONS = {
    currentQuestion: 0,
    manifest: [],
    questions: [{
        question: "What is the date of the event?",
    }, {
        question: "What is the venue name?",
    }, {
        question: "What is the venue address?",
    }, {
        question: "What time does the event start?",
    }, {
        question: "What time is sound check?",
    }, {
        question: "Is there anything you need to purchase before the event?",
        answer: [{
            name: "quarter inch cables",
            quantity: ""
        }, {
            name: "XLR cables",
            quantity: ""
        }, {
            name: "guitar/bass strings",
            quantity: ""
        }, {
            name: "misc",
            description: "$('.description').val()",
            quantity: ""
        }]
    }, {
        question: "Are there any notes you want to add?",
    }]
};
/*
function doGuide() {
    
}*/

function renderNextQuestion() {
    $('.btn-guide-next').on('click', function (event) {
        if (QUESTIONS.currentQuestion < QUESTIONS.questions.length && QUESTIONS.currentQuestion > 0) {
            QUESTIONS.manifest.push($('.user-event-input').val());
            var question = QUESTIONS.questions[QUESTIONS.currentQuestion];
            var questionHtml = `<h3>${question.question}</h3><form class="form-field" name="answerList">`;
            var prompt = `<input type="text" class="form-control user-event-input" placeholder="">`;
            questionHtml += prompt;
            questionHtml += `</form>`;
            $('#event-guide-form').html(questionHtml);
        } else if (QUESTIONS.currentQuestion === 0) {
            var question = QUESTIONS.questions[QUESTIONS.currentQuestion];
            var questionHtml = `<h3>${question.question}</h3><form class="form-field" name="answerList">`;
            var prompt = `<input type="text" class="form-control user-event-input" placeholder="">`;
            questionHtml += prompt;
            questionHtml += `</form>`;
            $('#event-guide-form').html(questionHtml);
        }
        QUESTIONS.currentQuestion++;

        //evalProgress();
        //createProgressTemplate();
    });
}

function renderEvent() {
    $('.btn-guide-next').on('click', function () {
        if (QUESTIONS.currentQuestion > QUESTIONS.questions.length) {
            $('table').append(
                `<tr>
                <td> ${QUESTIONS.manifest[0]} </td>
                <td> ${QUESTIONS.manifest[1]} </td>
                <td> ${QUESTIONS.manifest[2]} </td>
                <td> ${QUESTIONS.manifest[3]} </td>
                <td> ${QUESTIONS.manifest[4]} </td>
            </tr>`);
            console.log(QUESTIONS.manifest)
            $('#eventGuideModal').modal('hide');
            QUESTIONS.manifest = [];
            QUESTIONS.currentQuestion = 0;
        }
    });
}








// GET USER EVENTS ON LOGIN

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn

function getEvents(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
    setTimeout(function () {
        callbackFn(MOCK_EVENTS)
    }, 1);
}

// this function stays the same when we connect
// to real API later
function displayEvents(data) {
    for (index in data.events) {
        $('table').append(
            `<tr>
                <td><a href="#"> ${data.events[index].eventDate} </a></td>
                <td> ${data.events[index].venueName} </td>
                <td> ${data.events[index].venueAddress} </td>
                <td> ${data.events[index].startTime} </td>
                <td> ${data.events[index].soundCheckTime} </td>
            </tr>`);
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayEvents() {
    getEvents(displayEvents);

}

// LOGIN BUTTON LINKS TO DASHBOARD

const handleLogin = function () {
    $('.btn-login').click(function () {
        window.location.href = "dashboard.html";
    })
};

const handleSignUp = function () {
    $('.btn-signup').click(function () {
        window.location.href = "dashboard.html";
    })
};



//  on page load do this
$(document).ready(function () {
    handleLogin();
    handleSignUp();
    getAndDisplayEvents();
    renderNextQuestion();
    renderEvent();
});
// using mock data until API is created
const MOCK_EVENTS = {
    "events": [{
        "venueName": "The Rainbow Room",
        "venueAddress": "9015 W Sunset Blvd West Hollywood, CA 90069",
        "eventDate": "February 2, 2017",
        "startTime": "9:00",
        "soundCheckTime": "8:00",
        "manifest": {
            "quarterInchCables": "2",
            "strings": "3",
            "xlrCables": "1",
            "misc": {
                "description": "guitar strap",
                "qty": "1"
            }

        },
        "userId": "111111" // The user id of the user that made the event
    }, {
        "venueName": "Loaded",
        "venueAddress": "6377 Hollywood Blvd Los Angeles, CA 90028",
        "eventDate": "March 2, 2017",
        "startTime": "8:00",
        "soundCheckTime": "7:00",
        "manifest": {},
        "userId": "333333"
    }, {
        "venueName": "The Satellite",
        "venueAddress": "1717 Silver Lake Blvd Los Angeles, CA 90026",
        "eventDate": "December 2, 2017",
        "startTime": "9:00",
        "soundCheckTime": "7:00",
        "manifest": {},
        "userId": "222222"
    }, {
        "venueName": "The Rainbow Room",
        "venueAddress": "9015 W Sunset Blvd West Hollywood, CA 90069",
        "eventDate": "February 2, 2017",
        "startTime": "9:00",
        "soundCheckTime": "7:00",
        "manifest": {},
        "userId": "444444"
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

// Stage PLOT

const MOCK_STAGE_PLOT = {
    stagePlots: [{
        "userId": "333333",
        "file": "images/stage-plot.jpeg",
        "dateCreated": "January 12, 2017",
        "dateModified": "January 16, 2017"
    }]
};


// NEW EVENT SETUP GUIDE

const NEW_EVENT = {

};

const QUESTIONS = {
    currentQuestion: 0,
    manifest: [],
    questions: [{
        question: "What is the date of the event?",
        //mapToField: "eventDate"
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
        isMultiLine: true,
        options: [{
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

function renderOptionsHTML(question) {
    var questionHtml = `<h3>${question.question}</h3>`;
    for (index in question.options) {
        var prompt = `<div class="form-group">
        <label for="${question.options[index].name}">${question.options[index].name}</label>
        <div class="dec btn btn-primary up-down-btn">-</div>
        <input type="text" class="form-control user-event-input options-input qty-input" id="${question.options[index].name}" value="0">
    <div class="inc btn btn-primary up-down-btn">+</div>`;
        questionHtml += prompt;
        if (question.options[index].description) {
            var promptMisc = `<label class="sub-label" for="description">description</label><input type="text" class="form-control user-event-input options-input sub-options-input" id="description" value=" " placeholder="item description"></div>`;
            questionHtml += promptMisc;
        };
        questionHtml += `</div>`;
    };
    $('#event-guide-form').html(questionHtml);
    handleQty();
};


//
function handleQty() {
    $(".up-down-btn").on("click", function () {

        var $button = $(this);
        var oldValue = $button.parent().find(".qty-input").val();

        if ($button.text() == "+") {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }

        $button.parent().find(".qty-input").val(newVal);

    });
};

function renderQuestionHTML(question) {
    var questionHtml = `<h3>${question.question}</h3>`;
    var prompt = `<input type="text" class="form-control user-event-input" value=" " placeholder="">`;
    questionHtml += prompt;
    $('#event-guide-form').html(questionHtml);
};

function renderNextQuestion() {
    $('.btn-guide-next').on('click', function () {
        if (QUESTIONS.currentQuestion === QUESTIONS.questions.length) {
            $('.btn-guide-next').addClass('hide');
            $('.btn-save-event').removeClass('hide');
        }
        var question = QUESTIONS.questions[QUESTIONS.currentQuestion];
        if (QUESTIONS.currentQuestion !== 0) {
            getNewEventData();
        }
        if (question.options) {
            renderOptionsHTML(question);
        } else {
            renderQuestionHTML(question);
        }
        QUESTIONS.currentQuestion++;
    });
}



function getNewEventData() {
    var input = document.getElementsByClassName("user-event-input");

    for (i of input) {
        //extract the value of input elements
        var singleVal = i.value;
        if (singleVal !== "" && singleVal !== undefined) {
            QUESTIONS.manifest.push(singleVal);
        }
    }
    console.log(QUESTIONS.manifest);

}
//

function renderNewEvent() {
    $('.btn-save-event').on('click', function () {
        if (QUESTIONS.currentQuestion === QUESTIONS.questions.length) {
            $('table').append(
                `<tr>
                <td> ${QUESTIONS.manifest[0]} </td>
                <td> ${QUESTIONS.manifest[1]} </td>
                <td> ${QUESTIONS.manifest[2]} </td>
                <td> ${QUESTIONS.manifest[3]} </td>
                <td> ${QUESTIONS.manifest[4]} </td>
            </tr>`);
            console.log(QUESTIONS.manifest);
            saveNewEvent();
            $('#eventGuideModal').modal('hide');
            QUESTIONS.manifest = [];
            QUESTIONS.currentQuestion = 0;
            $('.btn-guide-next').removeClass('hide');
            $('.btn-save-event').addClass('hide');
        }
    });
}

function saveNewEvent() {
    NEW_EVENT.eventDate = QUESTIONS.manifest[0];
    NEW_EVENT.venueName = QUESTIONS.manifest[1];
    NEW_EVENT.venueAddress = QUESTIONS.manifest[2];
    NEW_EVENT.startTime = QUESTIONS.manifest[3];
    NEW_EVENT.soundCheckTime = QUESTIONS.manifest[4];
    NEW_EVENT.manifest = {
        "quarterInchCables": QUESTIONS.manifest[5],
        "xlrCables": QUESTIONS.manifest[6],
        "strings": QUESTIONS.manifest[7],
        "misc": {
            "qty": QUESTIONS.manifest[8],
            "description": QUESTIONS.manifest[9]
        }
    };
    NEW_EVENT.notes = QUESTIONS.manifest[15];
    NEW_EVENT.userId = '111111';
    console.log(NEW_EVENT);
    //MOCK_EVENTS.events.push(NEW_EVENT);
    //console.log(MOCK_EVENTS);
    $.ajax({
        type: "POST",
        url: '/api/event',
        data: NEW_EVENT,
        //success: success,
        //dataType: dataType
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

// LOAD NEW STAGE PLOT

function loadImageFileAsURL() {
    var filesSelected = document.getElementById("inputFileToLoad").files;
    if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];

        if (fileToLoad.type.match("image.*")) {
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
                var imageLoaded = document.getElementById("stage-plot-img")
                imageLoaded.src = fileLoadedEvent.target.result;
                document.body.append(imageLoaded.src);
            };
            fileReader.readAsDataURL(fileToLoad);
        };
    };
};

$('.btn-save-plot').on('click', function () {
    $('#upload-plot-modal').modal('hide');
});



// GET STAGE PLOT AT LOGIN

function getStagePlots(callbackFn) {
    setTimeout(function () {
        callbackFn(MOCK_STAGE_PLOT)
    }, 1);
}

// this function stays the same when we connect
// to real API later
function displayStagePlots(data) {
    for (index in data.stagePlots) {
        var imageLoaded = document.getElementById("stage-plot-img")
        imageLoaded.src = data.stagePlots[index].file;
        document.body.append(imageLoaded.src);
    };
};

function getAndDisplayStagePlots() {
    getStagePlots(displayStagePlots);

}


// GET MANIFEST AT LOGIN

function getManifest(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
    setTimeout(function () {
        callbackFn(MOCK_EVENTS)
    }, 1);
}

// this function stays the same when we connect
// to real API later
function displayManifest(data) {
    for (index in data.events) {
        $('#manifest-list').append(
            `<h3> ${data.events[index].venueName} </h3>
            <li class="manifest-item"> 1/4" cables: qty: ${data.events[index].manifest.quarterInchCables} </li>
            <li class="manifest-item"> XLR cables: qty: ${data.events[index].manifest.xlrCables} </li>
            <li class="manifest-item"> ${data.events[index].manifest.misc.description}: qty: ${data.events[index].manifest.misc.qty} </li>`
        );
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayManifest() {
    getManifest(displayManifest);

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

const handleLogout = function () {
    $('.btn-logout').click(function () {
        window.location.href = "index.html";
    })
};



//  on page load do this
$(document).ready(function () {
    handleLogin();
    handleSignUp();
    handleLogout();
    getAndDisplayStagePlots()
    getAndDisplayEvents();
    getAndDisplayManifest()
    renderNextQuestion();
    renderNewEvent();
});
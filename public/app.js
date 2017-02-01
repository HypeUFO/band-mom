
// using mock data until API is created
const MOCK_EVENTS = {
    "events": [{
        "eventDate": "February 2, 2017",
        "venueName": "The Rainbow Room",
        "venueAddress": "9015 W Sunset Blvd West Hollywood, CA 90069",
        "startTime": "9:00",
        "soundCheckTime": "8:00",
        "manifest": {
            "quarterInchCables": "2",
            "strings": "3",
            "xlrCables": "1",
            "dI": "1"
        },
        "userId": "111111" // The user id of the user that made the event
    }, {
        "eventDate": "March 2, 2017",
        "venueName": "Loaded",
        "venueAddress": "6377 Hollywood Blvd Los Angeles, CA 90028",
        "startTime": "8:00",
        "soundCheckTime": "7:00",
        "manifest": {
            "quarterInchCables": "1",
            "strings": "0",
            "xlrCables": "1",
            "dI": "2"
        },
        "userId": "333333"
    }, {
        "eventDate": "December 2, 2017",
        "venueName": "The Satellite",
        "venueAddress": "1717 Silver Lake Blvd Los Angeles, CA 90026",
        "startTime": "9:00",
        "soundCheckTime": "7:00",
        "manifest": {
            "quarterInchCables": "0",
            "strings": "0",
            "xlrCables": "0",
            "dI": "0"
        },
        "userId": "222222"
    }, {
        "eventDate": "February 2, 2017",
        "venueName": "The Rainbow Room",
        "venueAddress": "9015 W Sunset Blvd West Hollywood, CA 90069",
        "startTime": "9:00",
        "soundCheckTime": "7:00",
        "manifest": {
            "quarterInchCables": "4",
            "strings": "0",
            "xlrCables": "2",
            "dI": "0"
        },
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

const NEW_EVENT = {};

const QUESTIONS = {
    currentQuestion: 0,
    //manifest: [],
    questions: [{
        question: "What is the date of the event?",
        mapToField: "eventDate"
    }, {
        question: "What is the venue name?",
        mapToField: "venueName"
    }, {
        question: "What is the venue address?",
        mapToField: "venueAddress"
    }, {
        question: "What time does the event start?",
        mapToField: "startTime"
    }, {
        question: "What time is sound check?",
        mapToField: "soundCheckTime"
    }, {
        question: "Is there anything you need to purchase before the event?",
        isMultiLine: true,
        mapToField: "manifest",
        options: [{
            name: "quarterInchCables",
            quantity: ""
        }, {
            name: "xlrCables",
            quantity: ""
        }, {
            name: "strings",
            quantity: ""
        }, {
            name: "dIs",
            quantity: ""
        }]
    }, {
        question: "Are there any notes you want to add?",
        mapToField: "notes"
    }]
};

function renderOptionsHTML(question) {
    var questionHtml = `<h3>${question.question}</h3>`;
    for (index in question.options) {
        var prompt = `<div class="form-group">
        <label for="${question.options[index].name}">${question.options[index].name}</label>
        <div class="dec btn btn-primary up-down-btn">-</div>
        <input type="text" class="form-control user-event-input options-input qty-input" id="${question.options[index].name}" value="0">
    <div class="inc btn btn-primary up-down-btn">+</div></div>`;
        questionHtml += prompt;
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
    var prompt = `<input type="text" class="form-control user-event-input" placeholder="">`;
    questionHtml += prompt;
    $('#event-guide-form').html(questionHtml);
};

function renderFirstQuestion() {
    const question = QUESTIONS.questions[QUESTIONS.currentQuestion];
    $('.btn-guide-start').on('click', function () {
        renderQuestionHTML(question);
    });
}

function renderNextQuestion() {
    $('.btn-guide-next').on('click', function () {
        getNewEventData();
        QUESTIONS.currentQuestion++;
        const question = QUESTIONS.questions[QUESTIONS.currentQuestion];
        if (QUESTIONS.currentQuestion === QUESTIONS.questions.length) {
            renderLastQuestion();
            $('.btn-guide-next').addClass('hide');
            $('.btn-save-event').removeClass('hide');
        } else if (question.options) {
            renderOptionsHTML(question);
        } else {
            renderQuestionHTML(question);
        }
    });
}
function renderLastQuestion() {
    newEvent = NEW_EVENT;
    $('#event-guide-form').html(
        `<h3> Is this correct? </h3>
        <h4> Event Date: ${newEvent.eventDate} </h4>
        <h4> Venue Name: ${newEvent.venueName} </h4>
        <h4> Venue Address: ${newEvent.venueAddress} </h4>
        <h4> Start Time: ${newEvent.startTime} </h4>
        <h4> Soundcheck Time: ${newEvent.soundCheckTime} </h4>
        <h4> 1/4" cables: qty: ${newEvent.manifest.quarterInchCables} </h4>
        <h4> XLR cables: qty: ${newEvent.manifest.xlrCables} </h4>
        <h4> DI's: qty: ${newEvent.manifest.dIs} </h4>
        <h4> notes: ${newEvent.notes} </h4>`
    );
}
/*
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
*/

function getNewEventData() {
    const input = $(".user-event-input");
    const currentQuestion = QUESTIONS.questions[QUESTIONS.currentQuestion]
    const key = currentQuestion.mapToField;
    console.log(input);
    if (currentQuestion.isMultiLine) {
        NEW_EVENT[key] = {}
        for (let i = 0; i < input.length; i++) {
            let singleVal = input[i].value;
            //if (i < input.length) {
            //    NEW_EVENT[key][currentQuestion.options[i].name] = singleVal;
           // } else {
            NEW_EVENT[key][currentQuestion.options[i].name] = singleVal;
            //}
        }
    } else {
        let singleVal = input[0].value;
        NEW_EVENT[key] = singleVal;
    }
    console.log(NEW_EVENT);
};





//

function cancelNewEvent() {
    $('.btn-guide-cancel').on('click', function () {
            QUESTIONS.currentQuestion = 0;
            $('#eventGuideModal').modal('hide');
    });
}

function renderNewEvent() {
    $('.btn-save-event').on('click', function () {
            console.log(QUESTIONS.manifest);
            console.log(NEW_EVENT);
            saveNewEvent();
            QUESTIONS.currentQuestion = 0;
            $('.btn-guide-next').removeClass('hide');
            $('.btn-save-event').addClass('hide');
            $('#eventGuideModal').modal('hide');
            //NEW_EVENT = {};
    });
}

function saveNewEvent() {
    NEW_EVENT.dateCreated = new Date;
    NEW_EVENT.dateModified = new Date;
    NEW_EVENT.userId = User.userId;
    console.log(NEW_EVENT);

    $.ajax({
        type: "POST",
        url: '/api/event',
        data: NEW_EVENT,
        success: function(data) {
            $('table').append(
            `<tr>
                <td> ${data.eventDate} </td>
                <td> ${data.venueName} </td>
                <td> ${data.venueAddress} </td>
                <td> ${data.startTime} </td>
                <td> ${data.soundCheckTime} </td>
            </tr>`);
    },
        error: function() {
            alert('An error occured while processing your request');
        }
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
    $.ajax({
        type: "GET",
        url: '/api/event',
        data: {
            userId: User._id
        },
        success: function(data) {
            console.log(data);
            callbackFn(data);
        }
    });
        //console.log(data);
        //callbackFn(data)

};

// this function stays the same when we connect
// to real API later
function displayEvents(data) {
    for (index in data.events) {
        $('table').append(
            `<tr>
                <td>${data.events[index].eventDate} </td>
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
/*
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
*/


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

Dropzone.options.uploadPlot = {
  paramName: 'file',
  maxFilesize: 2, // MB
  maxFiles: 1,
  dictDefaultMessage: 'Drag an image here to upload, or click to select one',
  addRemoveLinks: true,
  dictCancelUpload: 'Cancel',
  dictCancelUploadConfirmation: 'Upload Cancelled',
  dictRemoveFile: 'Delete',
  headers: {
    //'x-csrf-token': document.querySelectorAll('meta[name=csrf-token]')[0].getAttributeNode('content').value,
  },
  acceptedFiles: 'image/*',
  init: function() {
    this.on('success', function( file, resp ){
      console.log( file );
      console.log( resp );
    });
    this.on('thumbnail', function(file) {
      if ( file.width < 640 || file.height < 480 ) {
        file.rejectDimensions();
      }
      else {
        file.acceptDimensions();
      }
    });
  },
  accept: function(file, done) {
    file.acceptDimensions = done;
    file.rejectDimensions = function() {
      done('The image must be at least 640 x 480px')
    };
  }
};

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
            <li class="manifest-item"> DI's: qty: ${data.events[index].manifest.dI} </li>`
        );
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayManifest() {
    getManifest(displayManifest);

}


// LOGIN AUTH

const handleLogin = function () {
    /*$('.btn-login').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: {
                username: $('.login-email').val(),
                password: $('.login-password').val()
            },
            success: function () {
                    //window.location.href = "/dashboard";
                    //getAndDisplayEvents();
                    //getAndDisplayStagePlots();
                    //getAndDisplayManifest();
            },
            //error: function
        });
    });*/
};

const handleSignUp = function () {
    $('#btn-signup').click(function () {
        validateSignUp();
        if ($('.signup-password').val() === $('.signup-password-confirm').val()) {
        $.ajax({
            type: 'POST',
            url: '/api/user',
            data: {
                userName: $('.signup-user-name').val(),
                firstName: $('.signup-first-name').val(),
                lastName: $('.signup-last-name').val(),
                phone: $('.signup-phone').val(),
                email: $('.signup-email').val(),
                password: $('.signup-password').val()
            },
            success: function () {
                    window.location.href = "login.html"
            },
            //error: function
        });
        } else {
        }
    });
};

function validateSignUp() {
    $('#signup-form').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            email: {
                validators: {
                    notEmpty: {
                        message: 'The email address is required'
                    },
                    emailAddress: {
                        message: 'The input is not a valid email address'
                    }
                }
            },
            userName: {
                validators: {
                    notEmpty: {
                        message: 'A username is required'
                    }
                }
            },
            /*firstName: {
                validators: {
                    notEmpty: {
                        message: 'The first name is required and cannot be empty'
                    }
                }
            },
            lastName: {
                validators: {
                    notEmpty: {
                        message: 'The last name is required and cannot be empty'
                    }
                }
            },*/
            password: {
                validators: {
                    notEmpty: {
                        message: 'The password is required'
                    }
                }
            },
            passwordConfirm: {
                validators: {
                    notEmpty: {
                        message: 'Please re-enter your password'
                    }
                }
            }
        }/*,
        submitHandler: function(validator, form, submitButton) {
            var fullName = [validator.getFieldElements('firstName').val(),
                            validator.getFieldElements('lastName').val()].join(' ');
            alert('Hello ' + fullName);
        }*/
    });
}

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
    renderFirstQuestion();
    renderNextQuestion();
    cancelNewEvent()
    renderNewEvent();
});
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
};

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
    console.log(NEW_EVENT);

    $.ajax({
        type: "POST",
        url: '/api/event',
        data: NEW_EVENT,
        success: function (data) {
            $('table').append(
                `<tr>
                <td>
                    <a href="#" class="eventDate" data-type="text" data-pk="1">${data.events[index].eventDate}</a>
                </td>
                <td>
                    <a href="#" class="venueName" data-type="text" data-pk="1">${data.events[index].venueName}</a>
                </td>
                <td>
                    <a href="#" class="venueAddress" data-type="text" data-pk="1">${data.events[index].venueAddress}</a>
                </td>
                <td>
                    <a href="#" class="startTime" data-type="text" data-pk="1">${data.events[index].startTime}</a>
                </td>
                <td>
                    <a href="#" class="soundcheckTime" data-type="text" data-pk="1">${data.events[index].soundCheckTime}</a>
                </td>
                <td><button class="btn" onclick="deleteEventRow(this)"><span class="glyphicon glyphicon-remove-circle"></span></button></td>
            </tr>`);
        },
        error: function () {
                alert('An error occured while processing your request');
            }
            //dataType: dataType
    });
}



function deleteEventRow(r) {
    var i = r.parentNode.parentNode;
    //console.log(id);
    if (confirm('Are you sure you want to delete this event?')) {
        $.ajax({
        type: "DELETE",
        url: '/api/event/' + i.id,
        success: function () {
            document.getElementById("event-table").deleteRow(i.rowIndex);
        },
        error: function () {
                alert('An error occured while processing your request');
            }
    });
    //var i = r.parentNode.parentNode.rowIndex;
            //document.getElementById("event-table").deleteRow(i);
} else {
    return;
    // Do nothing
}
};

function deleteManifestRow(r) {
    var i = r.parentNode.parentNode;
    if (confirm('Are you sure you want to delete this?')) {
        $.ajax({
        type: "DELETE",
        url: '/api/event/' + i.id,
        success: function () {
            document.getElementById("manifest-table").deleteRow(i.rowIndex);
        },
        error: function () {
                alert('An error occured while processing your request');
            }
    });
    //var i = r.parentNode.parentNode.rowIndex;
    
} else {
    return;
    // Do nothing
}
}


function bind_editable_to_column(table_selector,column_selector,ajax_url,title,options) {
  options = typeof options !== 'undefined' ? options : ''; //assigning source to empty when not specified. source is only used for select.
  $(table_selector).editable({
    selector: column_selector,
    url: ajax_url,
    title: title,
    ajaxOptions: {
      type: 'PUT',
      dataType: 'json'
    },
    source: options
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
            userId: this.id
        },
        success: function (data) {
            console.log(data);
            callbackFn(data);
        },
        //error:
    });
    //console.log(data);
    //callbackFn(data)

};






// this function stays the same when we connect
// to real API later
function displayEvents(data) {
    for (index in data.events) {
        $('#event-table').append(
            `<tr id="${data.events[index].id}">
                <td>
                    <a href="#" class="eventDate" data-type="text" data-pk="1">${data.events[index].eventDate}</a>
                </td>
                <td>
                    <a href="#" class="venueName" data-type="text" data-pk="1">${data.events[index].venueName}</a>
                </td>
                <td>
                    <a href="#" class="venueAddress" data-type="text" data-pk="1">${data.events[index].venueAddress}</a>
                </td>
                <td>
                    <a href="#" class="startTime" data-type="text" data-pk="1">${data.events[index].startTime}</a>
                </td>
                <td>
                    <a href="#" class="soundcheckTime" data-type="text" data-pk="1">${data.events[index].soundCheckTime}</a>
                </td>
                <td><button class="btn" onclick="deleteEventRow(this)"><span class="glyphicon glyphicon-remove-circle"></span></button></td>
            </tr>`);
            //return data;
    }
    for (index in data.events) {
        $('#manifest-table').append(
            `<tr>
                <td>
                    <a href="#" class="event" data-type="text" data-pk="1">${data.events[index].eventDate} @ ${data.events[index].venueName}</a>
                </td>
                <td>
                    <a href="#" class="quarterInchCables" data-type="text" data-pk="1">${data.events[index].manifest.quarterInchCables}</a>
                </td>
                <td>
                    <a href="#" class="xlrCables" data-type="text" data-pk="1">${data.events[index].manifest.xlrCables}</a>
                </td>
                <td>
                    <a href="#" class="dIs" data-type="text" data-pk="1">${data.events[index].manifest.dIs}</a>
                </td>
                <td><button class="btn" onclick="deleteManifestRow(this)"><span class="glyphicon glyphicon-remove-circle"></span></button></td>
            </tr>`);
    }
    bind_editable_to_column('#event-table', 'tr td a.eventDate', '/api/event/' + data.events[index].id, 'Event Date');
    bind_editable_to_column('#event-table', 'tr td a.venueName', '/api/event/' + data.events[index].id, 'Venue Name');
    bind_editable_to_column('#event-table', 'tr td a.venueAddress', '/api/event/' + data.events[index].id, 'Venue Address');
    bind_editable_to_column('#event-table', 'tr td a.startTime', '/api/event/' + data.events[index].id, 'Start Time');
    bind_editable_to_column('#event-table', 'tr td a.soundcheckTime', '/api/event/' + data.events[index].id, 'Soundcheck Time');

    bind_editable_to_column('#manifest-table', 'tr td a.event', '/api/event/' + data.events[index].id, 'Event');
    bind_editable_to_column('#manifest-table', 'tr td a.quarterInchCables', '/api/event/' + data.events[index].id, '1/4" Cables');
    bind_editable_to_column('#manifest-table', 'tr td a.xlrCables', '/api/event/' + data.events[index].id, 'XLR Cables');
    bind_editable_to_column('#manifest-table', 'tr td a.dIs', '/api/event/' + data.events[index].id, 'DIs');
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayEvents() {
    getEvents(displayEvents);

}
/*
$('.btn-delete-event').on('click', function(rowid) {
    var row = document.getElementById(rowid);
    row.parentNode.removeChild(row);
})
*/
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


$('.btn-done-plot').on('click', function () {
    $('#upload-plot-modal').modal('hide');
});



// GET STAGE PLOT AT LOGIN

function getStagePlots(callbackFn) {
    $.ajax({
        type: "GET",
        url: '/api/stage-plot',
        success: function (data) {
            console.log(data);
            callbackFn(data);
        },
        //error:
    });
}

// this function stays the same when we connect
// to real API later
function displayStagePlots(data) {
    console.log(data);
    for (const stagePlot of data.stageplots) {
        var imageLoaded = document.getElementById("stage-plot-img")
        imageLoaded.src = '/stage-plots/' + stagePlot.img;
        document.body.append(imageLoaded.src);
    };
};

function getAndDisplayStagePlots() {
    getStagePlots(displayStagePlots);

}

Dropzone.options.uploadPlot = {
    paramName: 'stageplot',
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
    init: function () {
        this.on('success', function (file, resp) {
            console.log(file);
            console.log(resp);
        });
        this.on('thumbnail', function (file) {
            if (file.width < 640 || file.height < 480) {
                file.rejectDimensions();
            } else {
                file.acceptDimensions();
                $('.btn-done-plot').removeClass('hide')
                $('.btn-cancel-plot').addClass('hide')
            }
        });
    },
    accept: function (file, done) {
        console.log(file);
        file.acceptDimensions = done;
        file.rejectDimensions = function () {
            done('The image must be at least 640 x 480px')
        };
    }
};


const handleLogout = function () {
    $('.btn-logout').click(function () {
        $.ajax({
            type: 'GET',
            url: '/api/logout'
        });
    })
};

const greeting = function () {
    $('#dashboard-greeting').append(`Hello`);
}

//turn to inline mode
$.fn.editable.defaults.mode = 'inline';




$(document).ready(function () {
    greeting();
    getAndDisplayEvents();
    getAndDisplayStagePlots();
    //getAndDisplayManifest();
    renderFirstQuestion();
    renderNextQuestion();
    cancelNewEvent();
    renderNewEvent();
    handleLogout();
});
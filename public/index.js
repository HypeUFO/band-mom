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
/*
const handleLogout = function () {
    $('.btn-logout').click(function () {
        $.ajax({
            type: 'GET',
            url: '/api/logout'
        });
    })
};
*/
/*
const handleLogin = function () {
    $('.login-form').on('submit', function (e) {
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
    });
};
*/


//  on page load do this
$(document).ready(function () {
    handleSignUp();
    //handleLogin();
    //handleLogout();
});
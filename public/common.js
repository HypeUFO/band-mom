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
            error: function() {
                alert('There was an error processing your request')
            }
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
        }
    });
}

function validateLogin() {
    $('.login-form').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: 'A username is required'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'The password is required'
                    }
                }
            }
        }
    });
}




$(document).ready(function () {
    handleSignUp();
    validateLogin()
});
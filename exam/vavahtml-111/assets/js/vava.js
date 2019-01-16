/*!
 * Vava
 * Project Website: http://vava.pimmey.com
 * @version 1.0
 * @author Yegor Borisenco <pimmey@pimmey.com>
 */

'use strict';

var App = {};

App = {
    /*
    * Injecting the data from config.js
    * */
    CONFIG: CONFIG === 'undefined' ? console.error('Missing config file') : CONFIG,

    /*
    * Global variables used throughout the app
    * */
    GLOBAL: {
        activeToasts: 0,
        progress: {
            show: function show () {
                $('.pace').show();
                $('.pace-progress').hide();
            },
            hide: function hide () {
                $('.pace').hide();
            }
        }
    },

    /*
    * Initing side nav for medium and smaller devices
    * */
    initSideNav: function sinitSideNav () {
        $('#sidenav-toggle').sideNav({
            closeOnClick: true
        });
    },

    /*
     Contact form handling
     @param String suffix helps differentiate between human and classic form modes
     Constricted to human and classic
     */
    initContactForm: function initContactForm () {
        var $name = $('#name');
        var $email = $('#email');
        var $message = $('#message');
        var $sendButton = $('#send-message');
        var initialMessage = $message.html();

        $sendButton.on('click', function (e) {
            e.preventDefault();
            App._sendMessage($name, $email, $message, initialMessage, $sendButton);
        });
    },

    /*
     A private function that sends the message, once everything is cool
     @param Obj $name the object that contains name value
     Obj $email the object that contains contact value
     Obj $message the object that contains message value
     String initialMessage initial message value
     Obj $sendButton the button that submits the form
     */
    _sendMessage: function _sendMessage ($name, $email, $message, initialMessage, $sendButton) {
        // Creating the conditions of the form's validity
        var isNameValid = App._verifyField($name, App.CONFIG.toastMessages.nameMissing);
        var isEmailValid = App._verifyField($email, App.CONFIG.toastMessages.contactMissing);
        var isMessageValid = App._verifyField($message, App.CONFIG.toastMessages.messageMissing, initialMessage);

        if (isNameValid && isEmailValid && isMessageValid) {
            App.GLOBAL.progress.show();

            // Disabling the button while we're waiting for the response
            $sendButton.attr('disabled', true);
            $.ajax({
                url: '/mailer/mailer.php',
                type: 'POST',
                data: {
                    name: $name.html() || $name.val(),
                    email: $email.html() || $email.val(),
                    message: $message.html() || $message.val()
                }
            }).done(function (res) {
                // res should return 1, if PHPMailer has done its job right
                if (res == true) {
                    Materialize.toast(App.CONFIG.toastMessages.messageSent, App.CONFIG.toastSpeed, 'success');

                    // Resetting the form
                    $name.html('') && $name.val('');
                    $email.html('') && $email.val('');
                    $message.html(initialMessage) && $message.val(initialMessage);

                    // Removing active class from label
                    $name.next().removeClass('active');
                    $email.next().removeClass('active');
                    $message.next().removeClass('active');
                } else {
                    Materialize.toast(App.CONFIG.toastMessages.somethingWrong + res, App.CONFIG.toastSpeed, 'error');
                }
            }).error(function (error) {
                console.error(error);
                Materialize.toast(App.CONFIG.toastMessages.somethingWrong + error, App.CONFIG.toastSpeed, 'error');
            }).complete(function () {
                App.GLOBAL.progress.hide();

                // Re-enabling the button on request complete
                $sendButton.attr('disabled', false);
            });
        }
    },

    /*
     A private function that handles field verifying
     @param Obj $field the object that contains selected field
     String errorMessage error message relevant to the selected field
     String initialMessage initial message value
     */
    _verifyField: function _verifyField ($field, errorMessage, initialMessage) {
        var fieldValue = $field.html() || $field.val();
        var isFieldInvalid;
        var isFieldLengthInvalid = fieldValue.length === 0;

        if (initialMessage !== 'undefined') {
            isFieldInvalid = isFieldLengthInvalid || (fieldValue === initialMessage);
        } else {
            isFieldInvalid = isFieldLengthInvalid;
        }

        if ($field.attr('type') === 'email' && ! /.+\@.+\..+/.test(fieldValue)) {
            Materialize.toast(App.CONFIG.toastMessages.enterValidEmail, App.CONFIG.toastSpeed, 'error', function () {
                App.GLOBAL.activeToasts--;
            });
            App.GLOBAL.activeToasts++;
            return false;
        }

        if (isFieldInvalid) {
            Materialize.toast(errorMessage, App.CONFIG.toastSpeed, 'error', function () {
                App.GLOBAL.activeToasts--;
            });
            App.GLOBAL.activeToasts++;
            return false;
        } else {
            return true;
        }
    },

    /*
    * NavIcon initialisation
    * */
    initNavIcon: function initNavIcon () {
        /*
        * Adding certain classes to the elements in order to make
        * overlay menu appear
        * */
        $('.nav-icon-container').on('click', function () {
            $('.nav-icon').toggleClass('transformed');
            $('#nav-overlay').toggleClass('visible');
            $('body').toggleClass('locked');
            $('main').toggleClass('blurry');
        });

        /*
        * Closing overlay menu on ESC
        * */
        $(document).on('keyup', function (e) {
            if (e.keyCode === 27 && $('#nav-overlay').hasClass('visible')) {
                $('.nav-icon-container').click();
            }
        });
    },

    /*
    * Preloader for the demo choosing page
    * */
    initLoadDemos: function initLoadDemos () {
        $(window).on('load', function () {
            $('#screens').addClass('loaded');
            $('#pace').hide();
        });
    },

    /*
    * Canvas loader initialisation
    * */
    initCanvasLoader: function initCanvasLoader () {
        var canvasLoader = function() {
            var self = this;

            window.requestAnimFrame = function() {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a) {
                        window.setTimeout(a, 1E3 / 60)
                    }
            }();

            var strokeStyleColor = '0, 0, 0';
            if (document.getElementsByTagName('body')[0].className.indexOf('dark') > 0) {
                strokeStyleColor = '255, 255, 255';
            }

            self.init = function() {
                self.canvas = document.getElementById('spinner');
                self.ctx = self.canvas.getContext('2d');
                self.ctx.lineWidth = .5;
                self.ctx.strokeStyle = 'rgba(' + strokeStyleColor + ', .75)';
                self.count = 75;
                self.rotation = 270 * (Math.PI / 180);
                self.speed = 6;
                self.canvasLoop();
            };

            self.updateLoader = function() {
                self.rotation += self.speed / 100;
            };

            self.renderLoader = function() {
                self.ctx.save();
                self.ctx.globalCompositeOperation = 'source-over';
                self.ctx.translate(125, 125);
                self.ctx.rotate(self.rotation);
                var i = self.count;
                while (i--) {
                    self.ctx.beginPath();
                    self.ctx.arc(0, 0, i + (Math.random() * 35), Math.random(), Math.PI / 3 + (Math.random() / 12), false);
                    self.ctx.stroke();
                }
                self.ctx.restore();
            };

            self.canvasLoop = function() {
                requestAnimFrame(self.canvasLoop, self.canvas);
                self.ctx.globalCompositeOperation = 'destination-out';
                self.ctx.fillStyle = 'rgba(0, 0, 0, .03)';
                self.ctx.fillRect(0, 0, 250, 250);
                self.updateLoader();
                self.renderLoader();
            };
        };

        var loader = new canvasLoader();
        loader.init();
    }
};

$(document).ready(function () {
    App.initSideNav();
    App.initNavIcon();
    App.initLoadDemos();

    if ( ! $('body').hasClass('demos')) {
        App.initCanvasLoader();
    }
});

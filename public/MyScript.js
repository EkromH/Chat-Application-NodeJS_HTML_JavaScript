/// <reference path="jquery-3.3.1.slim.min.js" />
/// <reference path="socket.io.js" />

var socket;
$(document).ready(function () {
    socket = io.connect('http://localhost:8909');
    socket.on('connect', addUser);
    socket.on('updatechat', processMessage);
    socket.on('updateusers', updateUserList);
    $('#send').click(sendMessage);
});
function addUser() {
    socket.emit('adduser', prompt("Type Your Name!!"));
}
function processMessage(username, data) {
    document.querySelector('#feedback').innerHTML = '';
    document.querySelector('#output_msg').innerHTML += '<b>' + username + ': </b>' + data + '<br>';
}
function updateUserList(data) {
    $('#users').empty();
    $.each(data, function (key, value) {
        $('#users').append('<li>' + key + '</li>');
    });
}
function sendMessage() {
    var message = $('#message').val();
    var fileInput = document.getElementById('fileInput');
    if (message != "") {
        $('#message').val('');
        socket.emit('sendchat', message);
        $('#message').focus();
        $('#message').val('');
    }
     else if (fileInput.files.length > 0) {
        var file = fileInput.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            socket.emit('image', reader.result);
        };
        reader.readAsDataURL(file);
    }
    else {
        $('#message').val('');
        $('#message').focus();
    }
}


var socket = io('https://diepchatdemo.herokuapp.com');
$(function(){
   // socket.emit("client-send-connect", "A Connect!!");

   $(document).on('click', '.panel-heading span.icon_minim', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('focus', '.panel-footer input.chat_input', function (e) {
    var $this = $(this);
    if ($('#minim_chat_window').hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $('#minim_chat_window').removeClass('panel-collapsed');
        $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('click', '#new_chat', function (e) {
    var size = $( ".chat-window:last-child" ).css("margin-left");
     size_total = parseInt(size) + 400;
    alert(size_total);
    var clone = $( "#chat_window_1" ).clone().appendTo( ".container" );
    clone.css("margin-left", size_total);
});
$(document).on('click', '.icon_close', function (e) {
    //$(this).parent().parent().parent().parent().remove();
    $( "#chat_window_1" ).remove();
});

//s1
var me = {};
me.avatar = "images/hotboy.jpg";

var you = {};
you.avatar = "images/hotgirl.jpg";

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}            

//-- No use time. It is a javaScript effect.
function insertChat(who, text, time = 0){
    var control = "";
    var date = formatAMPM(new Date());
    
    if (who == "me"){                     
        control = '<div class="row msg_container base_sent">'+
                     '<div class="col-md-10 col-xs-10">' +
                        '<div class="messages msg_sent">' +
                            '<p>'+ text + '</p>' +
                            '<time>' + date + '</time>' +
                        '</div>'+
                     '</div>'+
                     '<div class="col-md-2 col-xs-2 avatar">' +
                        '<img src="'+ me.avatar +'" class=" img-responsive ">'+
                        '</div>'+
                    '</div>'
    }else{
        control = '<div class="row msg_container base_receive">'+
                        '<div class="col-md-2 col-xs-2 avatar">' +
                            '<img src="'+ you.avatar +'" class=" img-responsive ">'+
                        '</div>'+                
                        '<div class="col-md-10 col-xs-10">' +
                        '<div class="messages msg_receive">' +
                            '<p>'+ text + '</p>' +
                            '<time>' + date + '</time>' +
                        '</div>'+
                        '</div>'+
                        
                    '</div>'
    }
    setTimeout(
        function(){                        
            $(".panel-body.msg_container_base").append(control);

        }, time);
    
}

function resetChat(){
    $(".panel-body.msg_container_base").empty();
}

$("#txtMessage").on("keyup", function(e){
    if (e.which == 13){
        var text = $(this).val();
        if (text !== ""){
            insertChat("me", text);              
            $(this).val('');
        }
    }
});

//-- Clear Chat
resetChat();

//-- Print Messages
insertChat("me", "Hello Tom...", 0);  
insertChat("you", "Hi, Pablo", 1500);
insertChat("me", "What would you like to talk about today?", 3500);
insertChat("you", "Tell me a joke",7000);
insertChat("me", "Spaceman: Computer! Computer! Do we bring battery?!", 9500);
insertChat("you", "LOL", 12000);
//e1

//s2 //show hide div
//e2

//s3 
$("#divSayHi").hide();

$("#btnRegister").click(function(){
    let username = $("#txtUserName").val().trim();
    if(username != ''){
         socket.emit("client-send-userName", $("#txtUserName").val());
         $("#lblMessage").removeClass("alert alert-danger");
         $("#lblMessage").text("");
         console.log("client-send-userName")
    }
    else{
       $("#lblMessage").addClass("alert alert-danger");
       $("#lblMessage").text("Please enter user name...");
    }
});

//listen send-fail-register
socket.on("server-send-fail-register", data =>{
    $("#lblMessage").addClass("alert alert-danger");
    $("#lblMessage").text(data);
})
socket.on("server-send-success-register", data =>{
    $("#lblMessage").removeClass("alert alert-danger");
    $("#lblMessage").text("");
    $("#currentUser").text(data);
    $("#divSayHi").show(1000);
    $("#divLogin").hide(1000);       
})
socket.on("server-send-manageUsers", data =>{
    $('ul.nav.nav-sidebar').html("");
    data.forEach(function(element) {
         $('ul.nav.nav-sidebar').append("<li class='userOnline'><a>" +element+ "</a></li>");
    });
})
socket.on("server-send-message-newmember", data =>{
    $("#lblTypping").html(`${data} is joining, chat now !! `);
    setTimeout(()=>{
        $("#lblTypping").html('');
    }, 3000);
});

//user logout
//user click logout
$("#btnLogout").click(function(){
    debugger;
    socket.emit("client-send-logout");
    $("#divSayHi").hide(1000);
    $("#divLogin").show(1000);
});

////client type text
// $("#btnSendMessage").click(function(){
//     socket.emit("client-send-chat", $("#txtMessage").val());
// });

$("#txtMessage").focusin(function() {
    socket.emit("client-stypping");
});

$("#txtMessage").focusout(function() {
    socket.emit("client-stypping-out");
});

socket.on("server-message-typping", data =>{
    if(data){
        $("#lblTypping").html("<img src='images/typing05.gif' style='width:20px; height='18px' > "+ data +" is typping..");
    }    
});

socket.on("server-message-typping-out", function(){
    $("#lblTypping").html("");
});

//e3

//s4
//add group
$('[data-toggle="addGroupToolTip"]').tooltip();
$("#addGroup").click()
//e4
   
})

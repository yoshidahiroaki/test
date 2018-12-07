$(function () {
    $(window).load(function () {
        if(localStorage.getItem("auth") !== null){
            $("#login").addClass("hide");
            $("#content").removeClass("hide");
        }
    })
    //auth---------------------------------------------------------
    $("#auth_btn").click(function () {
        $("#auth_btn").attr("disabled", true);
        $.ajax({
            url: "auth",
            type: 'POST',
            dataType: 'json',
            data: getAuthJson(),
            contentType: "application/json; charset=utf-8"
        })
        .done(function(j_data){
            if(j_data["auth"]){
                localStorage.setItem("auth",true)
                $("#login").addClass("hide");
                $("#content").removeClass("hide");
            }
        })
        .fail(function(){
            alert("error")
        })
        .complete(function(){
            $("#auth_btn").attr("disabled", false)
        });
    });
    function getAuthJson(){
        return JSON.stringify({auth:$("#auth_password").val()});
    }
    $("#logout").click(function () {
        localStorage.removeItem("auth")
    });
    //regist---------------------------------------------------------
    $("#create").click(function () {
        $("#create").attr("disabled", true);
        $.ajax({
            url: "word",
            type: 'POST',
            dataType: 'json',
            data: getCreateJson(),
            contentType: "application/json; charset=utf-8"
        })
        .done(function(j_data){
            if(j_data["status"] == 200){
                $("#message").removeClass("emsg")
                $("#message").text("created!")
            }else{
                $("#message").addClass("emsg")
                $("#message").text("400 Bad Request")
            }
        })
        .fail(function(){
            $("#message").addClass("emsg")
            $("#message").text("error")
        })
        .complete(function(){
            $("#create").attr("disabled", false)
        });
    });
    function getCreateJson(){
        let data = {
            en:$("#en").val(),
            ja:$("#ja").val(),
            note:$("#note").val()
        }
        return JSON.stringify(data);
    }
    //get---------------------------------------------------------
    $("#next").click(function () {
        $("#message").text("")
        $("#next").attr("disabled", true);
        $.ajax({
            url: "word",
            type: 'GET',
            contentType: "application/json; charset=utf-8"
        })
        .done(function(j_data){
            $("#en").val(j_data["en"])
            $("#ja").val(j_data["ja"])
            $("#note").val(j_data["note"])
            $("#remember").prop('checked', j_data["remember"])
        })
        .fail(function(){
            $("#message").addClass("emsg")
            $("#message").text("error")
        })
        .complete(function(){
            $("#next").attr("disabled", false);
        });
    });
    //update---------------------------------------------------------
    $("#update").click(function () {
        $("#update").attr("disabled", true);
        $.ajax({
            url: "word",
            type: 'PUT',
            dataType: 'json',
            data: getPutJson(),
            contentType: "application/json; charset=utf-8"
        })
        .done(function(j_data){
            if(j_data["status"] == 200){
                $("#message").removeClass("emsg")
                $("#message").text("updated!")
            }else{
                $("#message").addClass("emsg")
                $("#message").text("400 Bad Request")
            }
        })
        .fail(function(){
            $("#message").addClass("emsg")
            $("#message").text("error")
        })
        .complete(function(){
            $("#update").attr("disabled", false);
        });
    });
    function getPutJson(){
        let data = {
            en:$("#en").val(),
            ja:$("#ja").val(),
            note:$("#note").val(),
            remember:$("#remember").prop('checked')
        }
        return JSON.stringify(data);
    }
    //delete---------------------------------------------------------
    $("#delete").click(function () {
        $("#delete").attr("disabled", true);
        $.ajax({
            url: "word",
            type: 'DELETE',
            dataType: 'json',
            data: getDeleteJson(),
            contentType: "application/json; charset=utf-8"
        })
        .done(function(j_data){
            $("#message").addClass("emsg")
            if(j_data["status"] == 200){
                $("#message").text("deleted!")
            }else{
                $("#message").text("400 Bad Request")
            }
        })
        .fail(function(){
            $("#message").addClass("emsg")
            $("#message").text("error")
        })
        .complete(function(){
            $("#delete").attr("disabled", false);
        });
    });
    function getDeleteJson(){
        return JSON.stringify({en:$("#en").val()});
    }
    //---------------------------------------------------------
});

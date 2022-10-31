function reset(json) {

    $.getJSON("employees.json", function (json) {
        localStorage.setItem("employees", JSON.stringify(json));
        window.location.reload()
    });

}
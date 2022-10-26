
function inputData(json) {

    $.getJSON("employees.json", function (json) {

        inputID = document.getElementById("ID").value;
        inputFN = document.getElementById("firstName").value;
        inputLN = document.getElementById("lastName").value;
        inputPN = document.getElementById("phoneNumber").value;

        if (inputID == "" || inputID == undefined || isNaN(inputID)) {
            return;
        }
        //console.log(json);
        //console.log(json.employees.employee.length)

        emps = JSON.parse(localStorage.getItem("employees"));
        // console.log(emps);

        newEmployee = { id: inputID, firstname: inputFN, lastname: inputLN, phone: inputPN }

        //length = json.employees.employee.length;

       // console.log(json.employees.employee[length])

       // console.log(emps)

        emps.employees.employee[length] = newEmployee;

        //console.log(emps.employees.employee[length])

        localStorage.setItem("employees", JSON.stringify(emps))

        window.location.reload()
    });


}

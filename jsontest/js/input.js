function inputData(json) {

    $.getJSON("employees.json", function (json) {

        inputID = document.getElementById("ID").value;
        inputFN = document.getElementById("firstName").value;
        inputLN = document.getElementById("lastName").value;
        inputPN = document.getElementById("phoneNumber").value;

        if (inputID == "" || undefined) {

            return;
        }



        console.log(json); // this will show the info it in firebug console
        console.log(json.employees.employee.length)

        emps = JSON.parse(localStorage.getItem("employees"));
        console.log(emps); // this will show the info it in firebug console

        newEmployee = { id: inputID, firstname: inputFN, lastname: inputLN, phone: inputPN }



        //length = json.employees.employee.length;

        console.log(json.employees.employee[length])

        console.log(emps)


        jsonString = JSON.stringify(json);


        emps.employees.employee[length] = newEmployee;

        console.log(emps.employees.employee[length])

        localStorage.setItem("employees", JSON.stringify(emps))

        window.location.reload()
    });


}

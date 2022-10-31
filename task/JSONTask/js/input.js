
function inputData(json) {

    $.getJSON("employees.json", function (json) {

       let inputID = document.getElementById("ID").value;
       let inputFN = document.getElementById("firstName").value;
       let inputLN = document.getElementById("lastName").value;
       let inputPN = document.getElementById("phoneNumber").value;

        if (inputID == "" || inputID == undefined || isNaN(inputID)) {
            
            return;
        }
        //console.log(json);
        //console.log(json.employees.employee.length)

       let emps = JSON.parse(localStorage.getItem("employees"));
        // console.log(emps);

       let newEmployee = { id: inputID, firstname: inputFN, lastname: inputLN, phone: inputPN }

       let length = emps.employees.employee.length;

       // console.log(json.employees.employee[length])

       // console.log(emps)

        emps.employees.employee[length] = newEmployee;

        //console.log(emps.employees.employee[length])

        localStorage.setItem("employees", JSON.stringify(emps))
        
        window.location.reload()
    });


}

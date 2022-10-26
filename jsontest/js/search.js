function searchJSON(json) {

    $.getJSON("employees.json", function (json) {
        var table = ""


        emps = JSON.parse(localStorage.getItem("employees"));
        // console.log(emps.employees.employee.length);
        length = emps.employees.employee.length;
        input = document.getElementById("search").value;
        // console.log(emps.employees.employee[0]);
        // x=JSON.stringify(emps.employees.employee[9])
        search = "";
        // console.log(search.includes(input));

        for (let i = 0; i < length; i++) {
            // x=JSON.stringify(emps.employees.employee[i])
            // if(x.includes(input))
            search = emps.employees.employee[i].id +
                emps.employees.employee[i].firstname +
                emps.employees.employee[i].lastname +
                emps.employees.employee[i].phone
            search = search.toLowerCase();

            if (search.includes(input.toLowerCase())) {
                table += "<tr><td>" +
                    emps.employees.employee[i].id + "</td><td>" +
                    emps.employees.employee[i].firstname + "</td><td>" +
                    emps.employees.employee[i].lastname + "</td><td>" +
                    emps.employees.employee[i].phone + "</td><td>"
            }



        }

        document.getElementById("tablebody").innerHTML = table;
    });


}

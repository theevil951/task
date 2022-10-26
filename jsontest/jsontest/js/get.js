function getJSON(json)
            {

                $.getJSON("employees.json", function(json) {
                    var table=""
                    // console.log(json);
                    // console.log(json.employees.employee.length)
                    
                   //emps=JSON.parse(localStorage.getItem("employees"));
                  //  console.log(emps.employees.employee);
                  emps=JSON.parse(localStorage.getItem("employees"));
                    //console.log(emps.employees.employee.length);
                   length = emps.employees.employee.length;
            //console.log(length);
                    for(let i = 0 ; i<length ; i++){
                        table += "<tr><td>" +
                    emps.employees.employee[i].id + "</td><td>" +
                    emps.employees.employee[i].firstname+ "</td><td>" +
                    emps.employees.employee[i].lastname  + "</td><td>" +
                    emps.employees.employee[i].phone  + "</td><td>"
                    }
                    
                    document.getElementById("tablebody").innerHTML = table;
                });
                

            } 
            
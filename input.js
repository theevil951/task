// function inputXML() {
//     var xmlhttp = new XMLHttpRequest();
//     xmlhttp.onreadystatechange = function () {

//         if (this.readyState == 4 && this.status == 200) {
//             inputData(this);
//         }
//     };

//     xmlhttp.open("GET", "employees.xml", true);
//     xmlhttp.send();
//     input = document.getElementById("search").value="";
// }

var xml;
if (window.ActiveXObject) {
    xml = new ActiveXObject("Microsoft.XMLHTTP");
} else {
    xml = new XMLHttpRequest();
}
xml.open("GET", "employees.xml", true);
xml.send();

function inputData(){
    
    inputID = document.getElementById("ID").value;
    inputFN = document.getElementById("firstName").value;
    inputLN = document.getElementById("lastName").value;
    inputPN = document.getElementById("phoneNumber").value;

var xmlDoc=xml.responseXML;
 var employee = xmlDoc.createElement("employee");
 
 var idNode = xmlDoc.createElement("id");
 idNode.appendChild(xmlDoc.createTextNode(inputID));

 var fnNode = xmlDoc.createElement("firstname");
  fnNode.appendChild(xmlDoc.createTextNode(inputFN));

 var lnNode = xmlDoc.createElement("lastname");
 lnNode.appendChild(xmlDoc.createTextNode(inputLN));

 var phoneNode = xmlDoc.createElement("phone");
 phoneNode.appendChild(xmlDoc.createTextNode(inputPN));

 employee.appendChild(idNode);
 employee.appendChild(fnNode);
 employee.appendChild(lnNode);
 employee.appendChild(phoneNode);
 
  console.log(employee)


  
xmlDoc.getElementsByTagName("employees")[0].appendChild(employee);

var table="<table>";
var x = xmlDoc.getElementsByTagName("employee");
console.log(x)   
// Start to fetch the data by using TagName 
for (var i = 0; i < x.length; i++) {
    table += "<tr><td>" +
    x[i].getElementsByTagName("id")[0]
        .childNodes[0].nodeValue+"</td><td>"+
        x[i].getElementsByTagName("firstname")[0]
        .childNodes[0].nodeValue + "</td><td>" +
        x[i].getElementsByTagName("lastname")[0]
        .childNodes[0].nodeValue + "</td><td>" +
        x[i].getElementsByTagName("phone")[0]
        .childNodes[0].nodeValue + "</td></tr>";
}

    console.log();

document.getElementById("tablebody").innerHTML = table;

// var reference = window.open();
// reference.document.write(table)

 console.log(xmlDoc)


 
 //xml.responseXML.appendChild(employee);

 inputID = document.getElementById("ID").value = "";
 inputFN = document.getElementById("firstName").value = "";
 inputLN = document.getElementById("lastName").value = "";
 inputPN = document.getElementById("phoneNumber").value = "";

     
    }

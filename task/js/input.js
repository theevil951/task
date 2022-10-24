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
    
    // inputID = document.getElementById("ID").value;
    // inputFN = document.getElementById("firstName").value;
    // inputLN = document.getElementById("lastName").value;
    // inputPN = document.getElementById("phoneNumber").value;

var xmlDoc=xml.responseXML;
 var employee = xmlDoc.createElement("employee");
 
 var idNode = xmlDoc.createElement("id");
 idNode.appendChild(xmlDoc.createTextNode("1515"));

 var fnNode = xmlDoc.createElement("firstname");
  fnNode.appendChild(xmlDoc.createTextNode("testfn"));

 var lnNode = xmlDoc.createElement("lastname");
 lnNode.appendChild(xmlDoc.createTextNode("testln"));

 var phoneNode = xmlDoc.createElement("phonenumber");
 phoneNode.appendChild(xmlDoc.createTextNode("123123123"));

 employee.appendChild(idNode);
 employee.appendChild(fnNode);
 employee.appendChild(lnNode);
 employee.appendChild(phoneNode);
 
  console.log(employee)

  
xmlDoc.getElementsByTagName("employees")[0].appendChild(employee);

 console.log(xmlDoc)


     
    }

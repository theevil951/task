function getXML() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {

        // Request finished and response 
        // is ready and Status is "OK"
        if (this.readyState == 4 && this.status == 200) {
            empDetails(this);
        }
    };

    // employee.xml is the external xml file
    xmlhttp.open("GET", "employees.xml", true);
    xmlhttp.send();
    input = document.getElementById("search").value="";
}

function empDetails(xml) {
    
    var xmlDoc = xml.responseXML;
    var table="";
    var x = xmlDoc.getElementsByTagName("employee");
    console.log(xmlDoc)   
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

    // Print the xml data in table form
    document.getElementById("tablebody").innerHTML = table;
}
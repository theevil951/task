function searchXML(xml)
            {
                if (window.XMLHttpRequest)
                {
                    xhttp=new XMLHttpRequest();
                }
                else
                {
                    xhttp=new ActiveXObject("Microsoft.XMLHTTP");
                }
                xhttp.open("GET",xml,false);
                xhttp.send();
                return xhttp.responseXML;
            } 
            
            function search()
            {
                xmlDoc=searchXML("employees.xml");
                x=xmlDoc.getElementsByTagName("id");
                
                input = document.getElementById("search").value;
                size = input.length;
                var id;
                var firstname;
                var lastname;
                var phone;
                var divText="";
                if (input == null || input == "")
                {
                    document.getElementById("tablebody").innerHTML= "<h2>Please enter an ID !</h2>";
                    
                    return false;
                }
               
                for (i=0;i<x.length;i++)
                {
                    id = xmlDoc.getElementsByTagName("id")[i].childNodes[0].nodeValue;
                    startString = id//.substring(0,size);
                  
                    if (startString.toLowerCase() == input.toLowerCase())
                    
                    {
                        id=xmlDoc.getElementsByTagName("id")[i].childNodes[0].nodeValue;
                        firstname=xmlDoc.getElementsByTagName("firstname")[i].childNodes[0].nodeValue;
                        lastname=xmlDoc.getElementsByTagName("lastname")[i].childNodes[0].nodeValue;
                        phone=xmlDoc.getElementsByTagName("phone")[i].childNodes[0].nodeValue;
                        divText += "<tr><td>" +id+"</td><td>"+ firstname + "</td><td>" + lastname + "</td><td>" + phone + "</td></tr>";
                    
                    }
                   //else
                   //{
                   //    divText = "<h2>No contact with this ID exists.</h2>";
                   //}
                }
                document.getElementById("tablebody").innerHTML= divText;
            }
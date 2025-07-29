**choosing Nodejs as our back-end , because of its robustness to connect or handle multiple connections without waiting for one to finish
**
```Javascript
mkdr simple-api-server
cd simple-api-server
npm init -y
npm install express
```

### what is Express.js

this is a framework used to design the web appplications

it is useful for supproting and responding to HTTP request

Error codes:

200 OK - Sucess
201 OK - rousource created
400 Bad Request - Not logged in
403 - Access denied
404 - Not Found
500 - server crash

Registering a user 

curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"molomojacob8@gmail.com","password":"123456"}'

curl -X POST http://localhost:5000/api/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IjA1dUd0clVXbno0bWsxbnkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3Z3aWVmamZzb2tremdqZ3N3c3ZqLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzZmM0MjllNC02MzRhLTQ3ZjMtYTYwNi03MThmNmRlY2I5NmQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzUzODAwNzgyLCJpYXQiOjE3NTM3OTcxODIsImVtYWlsIjoibW9sb21vamFjb2I4QGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJtb2xvbW9qYWNvYjhAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiM2ZjNDI5ZTQtNjM0YS00N2YzLWE2MDYtNzE4ZjZkZWNiOTZkIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NTM3OTcxODJ9XSwic2Vzc2lvbl9pZCI6IjM1MmMzNzgxLWFiYjctNDRiZi04ZjJkLTUzYzk2ZDk0NjVjNCIsImlzX2Fub255bW91cyI6ZmFsc2V9.JiRuUvDKPgpU1PRHIBEdKODfvdCsX3wCoB_EcnujNbQ" \
  -H "Content-Type: application/json" \
  -d '{
    "Gender": "Male",
    "Age": 30,
    "ID": "123456789",
    "BloodType": "O+",
    "PhoneNumber": "555-1234",
    "Height": 180,
    "weight": 75,
    "SugarLevel": 90,
    "Address": "123 Main St"
  }'


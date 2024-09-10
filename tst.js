function parseJwt(token) {
  const base64Url = token.split(".")[1]
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join("")
  )
  return JSON.parse(jsonPayload)
}

// Function to check if the token is expired
function isTokenExpired(token) {
  if (!token) {
    return true
  }
  const decodedToken = parseJwt(token)
  const currentTime = Math.floor(Date.now() / 1000)
  return decodedToken.exp < currentTime
}

function remove_expired_token_from_localStorage() {
  if (isTokenExpired(localStorage.getItem("token"))) {
    console.log("Token is expired, removing token from localStorage.")
    localStorage.removeItem("token")
  }
}

remove_expired_token_from_localStorage()
let token = localStorage.getItem("token") || ""
const api_url = "http://127.0.0.1:8000"
// Login function
function login() {
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value

  fetch(`${api_url}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `username=${username}&password=${password}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.access_token) {
        token = data.access_token
        localStorage.setItem("token", token)
        document.getElementById("loginStatus").innerText = "Login successful!"
        fetchEmployees()
      } else {
        document.getElementById("loginStatus").innerText = "Login failed"
      }
    })
    .catch((err) => console.error("Error:", err))
}

// Create a new user
function createUser() {
  const username = document.getElementById("newUsername").value
  const fullName = document.getElementById("newFullName").value
  const password = document.getElementById("newPassword").value

  fetch(`${api_url}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      full_name: fullName,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.username) {
        document.getElementById(
          "createUserStatus"
        ).innerText = `User ${data.username} created successfully!`
      } else {
        document.getElementById("createUserStatus").innerText =
          "User creation failed"
      }
    })
    .catch((err) => console.error("Error:", err))
}

// Fetch and display all employees
function fetchEmployees() {
  fetch(`${api_url}/employees/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const employeesDiv = document.getElementById("employees")
      employeesDiv.innerHTML = ""
      data.forEach((emp) => {
        employeesDiv.innerHTML += `<div>ID: ${emp.id}, Name: ${emp.name}, Position: ${emp.position}, Salary: ${emp.salary}</div>`
      })
    })
    .catch((err) => console.error("Error:", err))
}

// Create a new employee
function createEmployee() {
  const name = document.getElementById("empName").value
  const position = document.getElementById("empPosition").value
  const salary = document.getElementById("empSalary").value

  fetch(`${api_url}/employees/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: name,
      position: position,
      salary: salary,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById(
        "actionStatus"
      ).innerText = `Employee ${data.name} created successfully!`
      fetchEmployees()
    })
    .catch((err) => console.error("Error:", err))
}

// Update an employee
function updateEmployee() {
  const empId = document.getElementById("updateEmpId").value
  const name = document.getElementById("updateEmpName").value
  const position = document.getElementById("updateEmpPosition").value
  const salary = document.getElementById("updateEmpSalary").value

  fetch(`${api_url}/employees/${empId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: name,
      position: position,
      salary: salary,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById(
        "actionStatus"
      ).innerText = `Employee ${data.name} updated successfully!`
      fetchEmployees()
    })
    .catch((err) => console.error("Error:", err))
}

// Delete an employee
function deleteEmployee() {
  const empId = document.getElementById("deleteEmpId").value

  fetch(`${api_url}/employees/${empId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(() => {
      document.getElementById(
        "actionStatus"
      ).innerText = `Employee ID ${empId} deleted successfully!`
      fetchEmployees()
    })
    .catch((err) => console.error("Error:", err))
}
if (token) {
  fetchEmployees()
}

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li>
          <a href="#application-screen-transition-diagram">Application screen transition diagram</a>
          <ul>
            <li><a href="#login-screen">Login screen</a></li>
            <li><a href="#task-management-screen">Task management screen</a></li>
            <li><a href="#edit-screen">Edit screen</a></li>
          </ul>
        </li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</li>
<!--     <li><a href="#contributing">Contributing</a></li> -->
<!--     <li><a href="#license">License</a></li> -->
    <li><a href="#contact">Contact</li>
    <li><a href="#acknowledgments">Ackowledgments</a></li>
  </ol>
</details>
      
## About The Project

- [x] [TODO]: [product-screenshot]

Demonstration of a simple employee management system consisting of a login screen, task screen, edit screen, etc.

### Built with 
- Express(.js)
- MySQL

### Application screen transition diagram
Simple three-screen employee management system.
#### Login screen

- [x] ID/Password Authentication

- [x] Character limit validation

#### Task management screen

- [x] View a list of employees

- [x] UI for adding employee information

- [x] Go to edit screen from any employee information

- [x] Search by employee name

#### Edit screen

- [x] Ability to update and delete employee information

## Getting Started
### Prerequisites
- Docker
### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/matsunori39/Employee-Management-System.git
   ```
2. Change directory
   ```sh
   cd Employee-Management-System
   ```
3. Docker Compose up
   ```sh
   docker compose up -d
   ```
## Usage
1. Load [http://localhost:3000/](http://localhost:3000/) in a browser.
2. Enter "guest@example.com" in the E-mail address field and "password" in the Password field, then press the Login button.

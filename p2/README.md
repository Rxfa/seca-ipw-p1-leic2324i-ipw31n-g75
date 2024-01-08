# Shows & Events Chelas Application API Development Report

````
By: Rafael Nicolau [A50546]
````

The following document describes the API developed for the Shows & Events Chelas Application. 
This API was developed in the context of the Introduction to Web Programming course of the Computer Science and 
Engineering BsC degree of the Instituto Superior de Engenharia de Lisboa.

The API was developed using Node.js and Express.js and the database used is Elasticsearch.

## Table of Contents
- [Shows & Events Chelas Application API Report](#shows--events-chelas-application-api-report)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
    - [Server Architecture](#server-architecture)
    - [Client Architecture](#client-architecture)
  - [Technologies](#technologies)
  - [Data Model](#data-model)
  - [Object-Relational Mapping](#object-relational-mapping)
  - [API Endpoints](#api-endpoints)
  - [Setup](#setup)
  - [Usage](#usage)
  
## Description
The Shows & Events Chelas Application is a web application that allows users to search for shows and events and 
later add them to groups that they have the ability to create and edit. 

Each group has an owner(who is the only one with access to the information of the group), a title and description(that can be edited by the 
owner of the group), and a list in which the 
shows and events are stored.

The information of the shows and events is retrieved from the [Ticketmaster API](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/).


There is no limit of the number of events per group, the only restriction is that the same event cannot be added 
more than once to that same group

### Server Architecture
    The Shows & Events Chelas Application API follows a simple, dependency injection based design, 
    which is structured in 4 major layers, each one with its own responsibilities: 

- **Server Layer**: The entry point of the API. It is the layer that is responsible for the initialization of the 
  API and the server and the injection of the dependencies between the layers. 


- **Web API Layer**: This layer is responsible for the communication with the client. It receives the requests 
  from the client and sends the responses back. 
It also handles the errors that may occur during the processing of the requests and sends the appropriate responses 
  to the client. It is where all the endpoints of the API are defined.


- **Service Layer**: This layer is responsible for the processing of the requests received from the client. 
  It is where the business logic of the API lies.
  It is also responsible for the validation of the data received from the client and the conversion of the data
    received from the data layer to the data that is sent to the client.


- **Data Layer**: This layer is responsible for the storage and retrieval of data. In the first version of the 
  API,
the data for both the groups and users was stored in memory, being in the current version of the API, the data for 
  those two entities are stored in Elasticsearch, a document-oriented database.
The data for the shows and events is
was not, at any point, stored in the API, as it was being retrieved directly from the Ticketmaster API.
### Client Architecture
    The Shows & Events Chelas Application Client consists of a single layer, the Web Client Layer, 
    which is responsible for the rendering of the web pages and the communication with the API.
    It sits at the same level as the Web API Layer of the API, being initialized by the Server layer, at the same time as 
    the layers of the API are initialized.

## Technologies
- Client
    - [HTML](https://www.w3schools.com/html/default.asp)
    - [CSS](https://www.w3schools.com/css/default.asp)
    - [JavaScript](https://www.w3schools.com/js/default.asp)
    - [Bootstrap](https://getbootstrap.com/docs/5.0/getting-started/introduction/)
    - [Handlebars](https://handlebarsjs.com/guide/#what-is-handlebars)
- API
    - [Node.js](https://nodejs.org/en/)
    - [Express.js](https://expressjs.com/)
    - [Elasticsearch](https://www.elastic.co/)
    - [Mocha](https://mochajs.org/)
    - [Chai](https://www.chaijs.com/)
    - [Passport](https://www.passportjs.org/)
    - [Nodemon](https://nodemon.io/)
## Data Model
    The data model of the Shows & Events Chelas Application API comprises 3 entities:
 

- **User**: The user entity represents the users of the API. It is composed of the following fields:
    - **id**: The id of the user, like the username and token is unique to each user and can be used thus it can be 
      used to identify a user. It is a UUID.
    - **username**: The username of the user. It is a string.
    - **password**: The password of the user. It is a string.
    - **token**: The token of the user. It is a string.


- **Group**: The group entity represents the groups of the API. It is composed of the following fields:
  - **id**: The id of the group. It is a UUID and it is unique.
  - **title**: The title of the group. It is a string.
  - **description**: The description of the group. It is a string.
  - **owner**: The owner of the group. It is a User object.
  - **events**: The list of events of the group. It is a list of Event objects.


- **Event**: The event entity represents the events of the API. It is composed of the following fields:
    - **id**: The id of the event. It is a string composed.
    - **name**: The name of the event. It is a string.
    - **date**: The date of the show. It is a string.
    - **imageurl**: The url of the image of the event. It is a string.
    - **segment**: The segment of the event. It is a string.
    - **genre**: The genre of the event. It is a string.
    - **subgenre**: The subgenre of the event. It is a string.

## Object-Relational Mapping
    Elasticsearch is a document-oriented database, which means that it stores data in documents, 
    and the format of the data is JSON. Since the SECA API is developed in Node.js, a JavaScript runtime,
    we have to convert the data from the API to JSON before storing it in Elasticsearch and convert it back to
    JavaScript objects when retrieving it from Elasticsearch. This known as Serialization and Deserialization.
## API Endpoints

The API has the following endpoints:

### Users
- **Create User**
    - Endpoint: `POST /api/seca/users`
    - Description: Adds a new user to the system

### Groups
- **List Groups**
    - Endpoint: `GET /api/seca/groups`
    - Description: Returns all groups owned by the user

- **Create Group**
    - Endpoint: `POST /api/seca/groups`
    - Description: Adds a group to the system

- **Get Group by ID**
    - Endpoint: `GET /api/seca/groups/:GroupId`
    - Description: Get a group given its ID

- **Add Event to Group**
    - Endpoint: `POST /api/seca/groups/:GroupId`
    - Description: Adds an event to a group

- **Update Group**
    - Endpoint: `PUT /api/seca/groups/:GroupId`
    - Description: Updates a group in the system

- **Delete Group**
    - Endpoint: `DELETE /api/seca/groups/:GroupId`
    - Description: Delete a group by ID

### Events
- **Get All Events**
    - Endpoint: `GET /api/seca/events`
    - Description: Gets all events within specified criteria and pagination

- **Get Event by Name**
    - Endpoint: `GET /api/seca/events/:name`
    - Description: Gets events whose names match the given name, within specified criteria and pagination

- **Delete Event by ID**
    - Endpoint: `DELETE /api/seca/groups/:GroupId/:eventId`
    - Description: Delete an event by ID

### Components
- **Security Scheme:**
    - Bearer Token Authentication: `bearerAuth`

- **Schemas:**
    - `NewGroup`: Represents a new group to be created
    - `Group`: Represents a group with additional properties like `id`, `ownerId`, and `events`
    - `NewUser`: Represents a new user to be created
    - `Event`: Represents an event with `id`, `name`, and `date`
    - Other custom response schemas for different HTTP status codes

## Setup
In order to run the application, you'll need to have the following technologies installed:
    
- Git ([download](https://git-scm.com/downloads))
- Node.js ([download](https://nodejs.org/en/)
- npm - Node Package Manager, comes with node ([download](https://nodejs.org/en/) separately)
- Elasticsearch ([download](https://www.elastic.co/downloads/elasticsearch))
- A code editor of your choice (VSCode, Atom, Sublime Text, etc.)
- A web browser of your choice (Firefox, Chrome, Edge, etc.)
- A Ticketmaster API key ([download](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/))

After installing all the technologies, you can proceed to the installation of the application.
    
1. Clone the repository to your machine
    ````
    git clone https://github.com/isel-leic-ipw/seca-ipw-p1-leic2324i-ipw31n-g75.git
    ````
2. Navigate to the root directory of the project
   ````
   cd seca-ipw-p1-leic2324i-ipw31n-g75
   ````
3. Install the dependencies
   ````
   npm install
   ````
4. Create a .env file in the root directory of the project and add the following variables to it:
   ````
   API_KEY=<YOUR_TICKETMASTER_API_KEY>
   ELASTIC_URL=<YOUR_ELASTICSEARCH_URL>
   ELASTIC_PASSWORD=<YOUR_ELASTICSEARCH_PASSWORD>
   KIBANA_TOKEN=<YOUR_KIBANA_TOKEN>
   PORT=<YOUR_PORT>
   ````
## Usage 
Running the application is simple, just follow the steps below:
1. Start Elasticsearch
    ````
    ./bin/elasticsearch
    ````
2. Start the API
   1. Production
      ````
      npm start
      ````
    2. Development
        ````
        npm run dev
        ````
    3. Tests
        ````
        npm test
        ````
4. Open your browser and navigate to http://localhost:<PORT> (replace <PORT> with the port you defined in the .env file)
5. Enjoy the application!

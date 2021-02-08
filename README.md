# XMeme - Manas Acharya 

XMeme is a meme directory made for [Crio Winter of doing Stage 2 phase B](https://www.crio.do/). Purpose was to execute a list of REST API requirements specified by Crio and integrate it with a frontend. Publicly hosted [here](https://xmeme-manas.herokuapp.com/) with heroku. Let's dive into the project.

## Tech Stack

**Backend** : Flask (Python)

**Frontend** : React

**Database** : MongoDb

**Deployment** : Heroku (Https) 

## Backend: Flask API

Flask microframework was a goto for this project as it is lightweight and enables rapid development of REST APIs. As a requirement the Swagger documentation was built using the [flask restx library](https://flask-restx.readthedocs.io/en/latest/). It has been hosted [here](https://xmeme-manas-api.herokuapp.com/) with heroku.

### Features:

1. **Post memes** with Owner name, Meme url and caption
2. **Edit meme** url and caption
3. Get meme data with **Pagination service built into the api**
4. **URL verification** to check if content at meme url is of image type (Disabled for assessment as Fetch requests on EC2 requires access to aws console. Feature will work on public api endpoint.)
5. Get information on all meme contributors: Name, Number of submission
6. Document Count api to count number of documents matching passed params
7. Incorrect Endpoint 404 handling
8. Duplicate data (409), Invalid Inputs (422), Resource not found (404) error handling
9. [Swagger-UI](https://xmeme-manas-api.herokuapp.com/)
10. Unit Tests Framework

### API

- /memes

| Method | Description                                                  | Parameters                                                   | Error Handling                                               |
| ------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| GET    | Endpoint to fetch the latest 100 memes : Optionally can enable pagination by passing page and limit value. Default limit if not passed is taken as 100. | Query Params:<br />page : indicates pagination page number<br />limit: number of memes per page | 500: Internal Server Error                                   |
| POST   | Endpoint to send a meme to the backend. Returns Unique ID for the uploaded meme. | POST Body Raw JSON Data:<br />name: MemeOwner name<br />url: Meme Url<br />caption: Post caption | 400: Empty POST Body<br />409: Duplicate Entry<br />Error<br />422: Invalid  URL input |

- /memes/<id>

| Method | Description                                                | Parameters                                                   | Error Handling                                        |
| ------ | ---------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| GET    | Endpoint to fetch a particular Meme with passed ID         | -                                                            | 404: Specified meme doesn't exist                     |
| PATCH  | Endpoint to update the caption or url for an existing meme | PATCH Body Raw JSON Data:<br />url: New Meme Url<br />caption: New Post caption | 409: Update Field values identical to Existing Values |

- /contributors

| Method | Description                                                  | Parameters | Error Handling             |
| ------ | ------------------------------------------------------------ | ---------- | -------------------------- |
| GET    | Endpoint to get all Meme Owner names with number of Submissions | -          | 500: Internal Server Error |

- /memecount

| Method | Description                                                  | Parameters                                                   | Error Handling             |
| ------ | ------------------------------------------------------------ | ------------------------------------------------------------ | -------------------------- |
| GET    | Endpoint to get Count of documents in db by name or url or caption as params | Query Params:<br />name: MemeOwner name<br />url: Meme Url<br />caption: Post caption | 500: Internal Server Error |

### Project Structure

```
backend
|   app.py
|   Procfile
|   requirements.txt
|   tests.py
|
+---utils
|   |   dao.py
|   |   image_url_validation.py
```

- app.py : Flask API definitions

- tests.py : api unit testing

- utils : Utilities Directory

- dao : Contains Abstraction class for all db operations

- image_url_validation.py : Contains functions for url validation

- Procfile : Heroku deployment file for gunicorn

- requirements.txt : python environment for project

  

### Development Environment

#### <u>UNIT TESTS</u>

Written unit tests to test major API endpoints with pythons unittest framework. Test file is located in root as tests.py.

#### <u>Code Formatting</u>

All code written is formatted according to PEP8 standards enforced with the autopep8 code format library.



## Frontend: React-App

React with its powerful component based system, state handling and virtual dom-rendering engine is one of the best front end frameworks out there and is my choice for this project. Developed with **YARN** as package manager of choice. The frontend is completely **RESPONSIVE** and therefore has smooth UI/UX for mobile users as well.

### Features

- Add Memes with **Post Preview**
- Edit Memes with **Edit Preview**
- Edit Meme Data With **No Reloads** for Smooth UX
- Implemented the legendary UI/UX **Infinite Scrolling** model (Pagination on meme sites is archaic)
- Contributors Appreciation Page
- Completely **Responsive Design**
- Effortless Scroll To Top
- 404 Page Handling
- Submission **URL Validation**
- Display **Time Since Posted**

### Project Structure

```
frontend
|   package.json
|   README.md
|   yarn.lock
|   .gitignore
+--- public
|   | React index.html and favicon related files
+--- src
|   |   App.css
|   |   App.js
|   |   index.css
|   |   index.js
|   |   reportWebVitals.js
|   |
|   +---components
|   |   +---layouts
|   |   |       EditMemeModal.js
|   |   |       Footer.js
|   |   |       FormModal.js
|   |   |       Header.js
|   |   |       Posts.js
|   |   |       ScrollToTopButton.js
|   |   |       ScrollToTopButton2.js
|   |   |
|   |   +---pages
|   |   |       Contributors.js
|   |   |       ImageGrid.js
|   |   |       Page404.js
|   |   |
|   |   \---utils
|   |           checkUrlIsImage.js
|   |           GetMemePagination.js
|   |           timeSince.js
|   |           validUrl.js
|   |
|   \---static
|       \---images
|               logo192.png
```

#### Modularity:

With the component based development I was able to separate UI elements which enables faster rendering of the site along with rapid development and easier maintenance. 

##### Project Components:-

- layouts: Includes individual elements of page like Header, Footer, etc
- pages: Includes components that render entire site pages ImageGrid (main app page), Contributors Page and 404 Landing Page
- utils: Utilities for carrying out repetitive logic and reused react hooks

## Development Environment

#### <u>Code Formatting</u>

Used VSCode plugin Prettier for auto formatting of code thereby having a standardized global format

#### <u>Package Manager</u>

Used [Yarn](https://yarnpkg.com/) to as package manager primarily due to its greater speed compared to npm

#### <u>API Calls</u> 

Used the [Axios](https://yarnpkg.com/package/axios) package with its promise framework being much better and easy to use over fetch api.



# Database: MongoDb

First choice due to its comfortable document based structure. Used [Pymongo](https://pymongo.readthedocs.io/en/stable/) as client for MongoDb in backend project. Public deployment done on Mongo Atlas Cloud service. 





Author: Manas Acharya 
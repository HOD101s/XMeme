# XMeme - Manas Acharya 

XMeme is a meme directory made for [Crio Winter of doing Stage 2 phase B](https://www.crio.do/). Purpose was to execute a list of REST API requirements specified by Crio and integrate it with a frontend. Publicly hosted [here](https://xmeme-manas.herokuapp.com/) with heroku. Let's dive into the project.

## Tech Stack

**Backend** : Flask (Python)

**Frontend** : ReactJs

**Deployment**: Heroku (Https) 

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

- utils : Utilities

- dao : Contains Abstraction class for all db operations

- image_url_validation.py : Contains functions for url validation

- Procfile : Heroku deployment

- requirements.txt : python environment for project

  

### Development Environment

#### <u>UNIT TESTS</u>

Written unit tests to test major API endpoints with pythons unittest framework. Test file is located in root as tests.py.

#### <u>Code Formatting</u>

All code written is formatted according to PEP8 standards enforced with the autopep8 code format library.
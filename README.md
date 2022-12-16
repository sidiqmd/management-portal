# Demo Project(Management Portal)

## Description

This project demonstrates backend service using serverless framework with NodeJS and ExpressJS on AWS Lambda.
sing the traditional Serverless Framework.

## Anatomy of the template

This template configures a single function, `api`, which is responsible for handling all incoming requests thanks to the `httpApi` event.

### Code Structure

This project mainly 4 sub folders:-

1. `db` - files related to database config and connection
2. `middleware` - files related to services used before api logic called.
3. `service` - files keep all the logic for all the api
4. `handlers` - file to be invoked by lambda function

> **\*Note**:\* > _Deployed in AWS Lambda_
> Lambda Endpoint: https://ciqddmcspj.execute-api.ap-southeast-1.amazonaws.com/

## Stack and lib used

- NodeJS
- ExpressJS
- JWT
- BcryptJS
- Axios
- MySQL(using AWS RDS)
- serverless-offline(for local development and testing)

## Requirement

- Node
- AWS Account
- AWS CLI
- Serverless Framework CLI
- RDS - MySQL

## Usage

### Deployment

Install dependencies with:

```
npm install
```

and then deploy with:

```
serverless deploy
```

After running deploy, you should see output similar to:

```bash
Deploying management-portal to stage dev (ap-southeast-1)

✔ Service deployed to stack management-portal-dev (49s)

endpoint: ANY - https://ciqddmcspj.execute-api.ap-southeast-1.amazonaws.com
functions:
  api: management-portal-dev-api (55 MB)
```

### Invocation

After successful deployment, you can call the created application via HTTP:

```bash
curl https://ciqddmcspj.execute-api.us-east-1.amazonaws.com/
```

Which should result in the following response:

```
{"message":"Hello from root!"}
```

```bash
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/nonexistent
```

You should receive the following response:

```bash
{"error":"Not Found"}
```

Below are list of API routes in this project:-
| No. | Method | Path                  | Remark                                               |
|-----|--------|-----------------------|------------------------------------------------------|
| 1   | GET    | /                     | Root & used to test connection                       |
| 2   | GET    | /hello                | Used for testing                                     |
| 3   | POST   | /register             | Register new user                                    |
| 4   | POST   | /login                | User login                                           |
| 5   | POST   | /refresh              | Get new access token                                 |
| 6   | GET    | /category             | Get all category                                     |
| 7   | GET    | /category/:categoryId | Get single category by category id                   |
| 8   | POST   | /category             | Create new category                                  |
| 9   | PUT    | /category             | Update category by category id                       |
| 10  | DELETE | /category             | Delete category by category id                       |
| 11  | GET    | /post                 | Get all post                                         |
| 12  | GET    | /post/:postId         | Get single post by category id                       |
| 13  | POST   | /post                 | Create new post                                      |
| 14  | PUT    | /post                 | Update post by post id                               |
| 15  | DELETE | /post                 | Delete post by post id                               |
| 16  | POST   | /purchase-membership  | To upgrade to Premium membership                     |
| 17  | POST   | /billplz-callback     | For Billplz server to call once the payment complete |

> **\*Note**:\* > Do test all the endpoint by importing `Management Portal.postman_collection.json` file into postman

### Local development

It is also possible to emulate API Gateway and Lambda locally by using `serverless-offline` plugin. In order to do that, execute the following command:

```bash
serverless plugin install -n serverless-offline
```

It will add the `serverless-offline` plugin to `devDependencies` in `package.json` file as well as will add it to `plugins` in `serverless.yml`.

After installation, you can start local emulation with:

```
serverless offline
```

## License

[MIT licensed](LICENSE).

This is demo project and not meant to be used for `production`.

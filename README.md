![alt text][logo]

[logo]: https://github.com/MagnumOpuses/project-meta/blob/master/img/jobtechdev_black.png?raw=true "JobTech dev logo"
[A JobTech Project]( https://www.jobtechdev.se)

# Jobbometern

- [Introduction]()
  - [What can you do with it?](#what-can-you-do-with-it?)
- [Getting started](#getting-started)
  - [Using Docker](#docker)


## Introduction
This is an **experimental** application built on top of the **[Employers API](https://github.com/simonbe/employers-api)**.

Jobbometern lets you search and show predictions for **all** Swedish employers (excl micro companies): If an employer is likely to hire, when it will hire and what occupations it is interested in hiring. Use cases:

- Job seekers can find suitable employers to contact.
- Organizations doing matching between job seekers and employers can use it to find relevant employers to contact.


#### What can you do with it?

1.	Find employers which likely will increase their workforce in the near future. Search by occupation, region, industry and name.

2.	For every employer show:
    - Prognosis on workforce growth in the coming year<sup>1</sup>.
    - Estimation on relevant occupations for the employer.
    - Recent activity on the labor market<sup>2</sup>.
    - Statistics on when an employer is likely to hire (seasonal variations).
    - Competences and soft skills the employer historically has been interested in<sup>3</sup>.
    - Contact information.


<sup>1</sup> Statistically estimated from a regression-model on the history of an employer's paid payroll taxes (so **not** self-reported or based on published job ads)

<sup>2</sup> Based on job ads from Sweden's largest job board [Platsbanken](https://arbetsformedlingen.se/platsbanken/)

<sup>3</sup> Mined from their job ads, see [taxonomy API](https://github.com/JobTechSwe/taxonomy-api)

## Getting started

### Prerequisites
This is an Angular application (https://angular.io/), to change or further develop you need to set up a development environment, it is beyond the purpose of this document.We give instructions to be able to run the project in a docker container. Feel free to contact us if you want more information or are interested in a collaboration.
* Git clone from https://github.com/JobtechSwe/Jobbometern
* You need an API key for Job search API from [https://apirequest.jobtechdev.se/](https://apirequest.jobtechdev.se/) to give the application access to jobtech developments API that are used in the Jobbometern      

# Install 
* Download and install Node.js, https://nodejs.org/en/download/ - choose version 14.16.1 if possible (LTS-version). Version 15 of node.js will give an error at the next step.  
* Open a terminal and run:
cd to <root>/frontend  
npm install  

If succesful, go on to the next step  
* In a terminal, run:   
npm run config
...to create the `<root>/src/environments/environment.ts` file
* In a terminal, run: npm install -g @angular/cli
* In a terminal, cd to <root>/frontend, run:   
ng serve  
* Open a browser and go to: http://localhost:4200/

_TODO: Redo/rewrite instructions for the creation of `<root>/src/environments/environment.ts`. Should be easier to create that file directly on localhost (not for Openshift/Docker)_
  
  
### Config
Create and add configuration to  `<root>/frontend/.env`, use file `<root>/frontend/.env-example` as template.

Example .env file content:
   
` PRODUCTION = true
  
  EMPLOYERS_API = "http://jobbjakt-api.northeurope.cloudapp.azure.com/api"

  JOBSEARCH_API =  "https://jobsearch.api.jobtechdev.se"
  
  JOBSEARCH_APIKEY = "xxx"
`
### Run the code
`npm run config` to generate the enviroment `<root>/src/environments/environment.ts`, and use `ng serve` to start the develop server.   
or   
`npm run start` - build enviroment.ts and start the develop server 


### Docker
You might need to run with `sudo` on Mac and Linux

1. goto folder in project `<root>/frontend`, where dockerfile exists.
2. Configure the API endpoints and api keys.  
    Create  `<root>/.env` file and add the endpoints and api key, use `<root>/.env-example` as template.
3. run: `docker build -t jobbometern:latest .`It will take several minutes to build, be patient
4. run: `docker run -p 8080:8080 jobbometern`
5. open a browser of your choice and goto: `http://localhost:8080/`
# MicroArray Dev Environment Setup

## Prerequisite System Packages

| Component          | Version            | Note                                                                                                           |
| ------------------ | ------------------ | -------------------------------------------------------------------------------------------------------------- |
| R                  | v3.4.4             | Download on official website: https://www.r-project.org/                                                       |
| devtools           | latest             | R -e "install.packages('devtools', repo='http://cran.r-project.org')"                                          |
| Node.js (with npm) | v.8.11.3 or latest |
| forever            | latest             | npm install forever -g                                                                                         |
| xvfb               | latest             | X virtual framebuffer is a display server implementing the X11 display server protocol (for microarray plots). |

### Node Modules

Server: To install server dependencies, navigate to the root of the project and execute:

<pre>$ npm install</pre>

Client: To install client dependencies, navigate to the /client folder and run the same command

Forever Module: Install the forever module globally:

<pre>$ npm install forever -g</pre>

### R Dependencies

All required R dependencies are defined in `setup.R`.

To install the R dependencies, navigate to /setup/setup.R and execute:

<pre>$ Rscript setup.R</pre>

### Configuaration

Navigate to /config/index.js and update the setting variable path to `microarray_setting-local.json`, which is also found in the same folder.

Modify server settings in `microarray_setting-local.json` if needed.

From the project root, navigate one directory up to the /data folder. Create folder if it doesn't exist.

Place files from https://github.com/CCBR/MicroArrayPipeline/tree/master/mpstr_configuration_files into the /data folder.

### Start

To start server, navigate to root of project and execute:

<pre>$ node index.js</pre>

To start the client, navigate to the /client folder and execute:

<pre>$ npm start</pre>

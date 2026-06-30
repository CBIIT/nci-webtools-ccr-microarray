# MicroArray Dev Environment Setup

## Updated Instructions

### Prerequisites
- Docker Desktop installed and running

### Setup

**1. Config files (not in repo — gitignored)**

Create `.env` in the project root (copy from `.env.example`):
```bash
cp .env.example .env
```
AWS credentials are optional for local testing (queue/S3 features won't work but GEO loading and CEL uploads will).

**2. Data directory**

Create `data/`, `tmp/`, `log/` directories in the project root (gitignored):
```bash
mkdir -p data tmp log
```
The `data/` directory holds GMT reference files. For local testing, this can be empty — it's only needed for the contrast/pathway analysis steps.

**3. Build and run both containers**
```bash
docker compose build
docker compose up
```
This starts the backend (port 9220) and the Next.js frontend (port 3000).

Verify the backend is running:
```bash
curl http://localhost:9220/ping
# Should return: true
```

Frontend available at `http://localhost:3000`

You can also build/run them individually:
```bash
docker compose build backend
docker compose up backend        # backend only
```

**4. Dev mode (optional — hot reload for frontend development)**

If you're actively developing the frontend and want hot reload instead of the container:
```bash
cd client
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:9220/api/analysis" > .env.local
npm run dev
```
This runs the Next.js dev server at `http://localhost:3000` against the containerized backend. Stop the frontend container first if it's running to free port 3000.

**5. Run the legacy frontend (optional, for comparison)**
```bash
cd client
npm install
NODE_OPTIONS=--openssl-legacy-provider npm start
```
Legacy frontend available at `http://localhost:3001` (CRA auto-picks next available port)

### Testing

- Go to `http://localhost:3000/analysis`
- Enter a GEO accession code (e.g. `GSE781`) and click Load
- A spinner shows while R processes the data
- GSM Data table should populate with sample metadata
- CEL file upload: switch to "CEL Files" mode, select `.CEL` files, click Load

---

## Legacy Instructions

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

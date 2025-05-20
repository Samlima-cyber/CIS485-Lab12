const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let candidates = JSON.parse(fs.readFileSync('candidates.json', 'utf8'));

// Homepage
app.get('/', (req, res) => {
  res.send(`<h1>Welcome to the Fictitious Political Candidates Server</h1>
  <p><a href="/add-candidate">Add a Candidate</a> | <a href="/candidates">View All Candidates</a></p>`);
});

// Form route (unchanged)
app.get('/add-candidate', (req, res) => {
  res.send(`
    <html>
    <head><title>Add New Candidate</title></head>
    <body>
      <h1>Add a New Political Candidate</h1>
      <form action="/add-candidate" method="POST">
        <label>Name:</label><br><input type="text" name="name" required><br>
        <label>Party:</label><br><input type="text" name="party" required><br>
        <label>Platform:</label><br><input type="text" name="platform" required><br>
        <label>Slogan:</label><br><input type="text" name="slogan" required><br><br>
        <input type="submit" value="Submit">
      </form>
    </body>
    </html>
  `);
});

// 400 Validation for form POST
app.post('/add-candidate', (req, res) => {
  const { name, party, platform, slogan } = req.body;

  if (!name || !party || !platform || !slogan) {
    return res.status(400).send(`
      <html><body>
      <h1>400 Bad Request</h1>
      <p>All fields (name, party, platform, and slogan) must be filled out.</p>
      <a href="/add-candidate">Go back to the form</a>
      </body></html>
    `);
  }

  const newCandidate = {
    id: candidates.length + 1,
    name, party, platform, slogan
  };

  candidates.push(newCandidate);
  fs.writeFileSync('candidates.json', JSON.stringify(candidates, null, 2));
  res.redirect('/candidates');
});

// Display all candidates
app.get('/candidates', (req, res) => {
  const candidatesHtml = candidates.map(c => `
    <div class="candidate-box">
      <h2>${c.name}</h2>
      <p><strong>Party:</strong> ${c.party}</p>
      <p><strong>Platform:</strong> ${c.platform}</p>
      <p><strong>Slogan:</strong> ${c.slogan}</p>
      <a href="/candidate/${c.id}">View Details</a>
    </div>
  `).join('');

  res.send(`
    <html><head><title>Candidate List</title>
    <style>
      body { font-family: Arial; padding: 20px; }
      .candidate-box { border: 1px solid #ccc; padding: 15px; margin: 10px 0; border-radius: 5px; background: #f9f9f9; }
    </style>
    </head><body>
      <h1>All Political Candidates</h1>
      ${candidatesHtml}
      <p><a href="/add-candidate">Add Another Candidate</a></p>
    </body></html>
  `);
});

// Task 2: GET /candidate/:id
app.get('/candidate/:id', (req, res) => {
  const candidateId = parseInt(req.params.id);

  if (isNaN(candidateId)) {
    return res.status(400).send(`
      <html><body>
      <h1>400 Bad Request</h1>
      <p>Invalid candidate ID. Please use a valid numeric ID.</p>
      <a href="/candidates">Go back to the candidate list</a>
      </body></html>
    `);
  }

  const candidate = candidates.find(c => c.id === candidateId);
  if (!candidate) {
    return res.status(404).send(`
      <html><body>
      <h1>404 Not Found</h1>
      <p>Candidate with ID ${candidateId} was not found.</p>
      <a href="/candidates">Go back to the candidate list</a>
      </body></html>
    `);
  }

  res.send(`
    <html><body>
    <h1>Candidate Details</h1>
    <h2>${candidate.name}</h2>
    <p><strong>Party:</strong> ${candidate.party}</p>
    <p><strong>Platform:</strong> ${candidate.platform}</p>
    <p><strong>Slogan:</strong> ${candidate.slogan}</p>
    <a href="/candidates">Go back to the candidate list</a>
    </body></html>
  `);
});

// Task 3: Global 500 error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`
    <html><body>
    <h1>500 Internal Server Error</h1>
    <p>Something went wrong on the server.</p>
    <a href="/candidates">Go back to the candidate list</a>
    </body></html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
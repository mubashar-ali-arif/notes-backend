const http = require('http');
const express = require('express')
const cors = require('cors')

const PORT = process.env.PORT || 3001

const app = express();
app.use(express.json());

app.use(cors());

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]
  
app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>');
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(x => x.id === id);
    if(note)
        response.json(note)
    else
        response.status(400).send("note not found");
});

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(x => x.id === id);
    if(note){
        notes = notes.filter(x => x.id !== id);    
        response.status(204).end("note deleted");
    }else{
        response.status(400).send("note not found");
    }
});

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;
    return maxId + 1;
}

app.post('/api/notes/', (request, response) => {
    const body = request.body;
    if(!body.content){
        return response.status(400).json({ error: "content missing "});
    }
    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId()
    }
    notes = notes.concat(note);
    response.json(note);
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}  
app.use(unknownEndpoint)

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
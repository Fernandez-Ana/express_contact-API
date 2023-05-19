import express from "express";
import fs from 'node:fs/promises'

const app = express();
app.use(express.json());
const port = 3000;

const checkFile = async () => {
    let error;
    let data;

    try {
        data = await fs.readFile('./contacts.json', 'utf8')
        data = JSON.parse(data)
    } catch (error) {
        console.log(error);
        error = 'Oooh ohhhhh!!'
    }
    return [error, data]
}

app.get('/', (req, res) => {
    res.status(200).send('Welcome')
});

app.get('/contacts', async (req, res) => {
    const [error, data] = await checkFile()

    res.send(data)
    if (error) {
        console.log(error);
        return res.status(500).send('connection failed')
    }
})

app.get('/contacts/:id', async (req, res) => {
    const [error, data] = await checkFile()

    const { id } = req.params;
    const filterId = data.filter((element) => {
        return element.id === Number(id)
    })
    res.send(filterId)
    if (error) {
        return res.status(500).send('connection failed')
    }
})

app.post('/contacts', async (req, res) => {
    const [error, data] = await checkFile()
    let newContact = req.body;
    // newContact.id = data[data.length - 1].id + 1
    data.push(newContact)
    res.send({ message: 'Thank you', result: data })
    if (error) {
        return res.status(500).send('connection failed')
    }
})

app.put('/contacts/:id', async (req, res) => {
    const [error, data] = await checkFile()
    let changeContact = req.body
    let contactId = req.params.id
    const index = data.findIndex((element) => {
        return element.id === Number(contactId)
    })
    data[index] = changeContact
    res.send(data)
    if (error) {
        return res.status(500).send('connection failed')
    }
})



app.listen(port, () => {
    console.log(`Listening on ${port}`);
})
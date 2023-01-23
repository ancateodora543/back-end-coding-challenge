import express from 'express'
import routes from './routes'
import { readFiles } from './middlewares'

const app = express()
const port = 3000;

app.use(readFiles)
app.use(routes)

app.listen(port, () => {
    console.log(`Server listening at port ${port}.`)
});
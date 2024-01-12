import { request, response } from "express"
import app from "./app.js"


const PORT = process.env.PORT || 3001;

app.get("/", (request, response) => {
    return response.send("<h1>WORKSHIFT</h1>")
})

app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`)
})
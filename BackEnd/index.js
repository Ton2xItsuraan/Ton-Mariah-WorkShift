import { request, response } from "express"
import app from "./app.js"
import config from "./utils/config.js";

const PORT = config.PORT || 3000;

app.get("/", (request, response) => {
    return response.send("<h1>WORKSHIFT</h1>")
})

app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`)
})
export default function unknownEndpoint (request, response) {
    return response.status(404).send({ error: "unknown endpoint" })
};
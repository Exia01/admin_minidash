import { response } from "express"

export const notFound = (req, res) =>{
    return  res.status(404).send("Resource does not exists")
}
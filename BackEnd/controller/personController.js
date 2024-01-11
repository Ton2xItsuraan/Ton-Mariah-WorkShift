import Person from '../models/Person.js';
import jwt from "jsonwebtoken";
import getTokenFrom from "../utils/getTokenFrom.js";
import config from "../utils/config.js";
import User from "../models/User.js";





async function getPersonInfo (_, response, next) {

    try{
        const persons = await Person.find({});
        const personsCount = await persons.length;

        console.log(personsCount);  

        return response.send(`<h1>Phonebook has info for ${personsCount} people</h1>`);
    } catch(error) {
        next(error);
    }
    
}

async function getPersons (request, response, next) {
    try{
        const decodedToken = jwt.verify(getTokenFrom(request), config.JWT_SECRET);

        const persons = await Person.find({ userId: decodedToken.id }).populate("userId", {username: 1, firstname: 1, lastname:1});

        return response.json(persons);
    } catch(error) {
        next(error);
    }
    
}

async function getPerson(request, response, next) {
    const id = request.params.id;

    try {
        const person = await Person.findById(id);

        if (!person) {
            return response.status(404).json({ error: "Person not found" });
        }

        return response.status(200).json(person);
    } catch (error) {
        next(error);
    }
}



async function deletePerson(request, response, next) {
   try {
       const id = request.params.id; 
       if (!mongoose.Types.ObjectId.isValid(id)) {
           return response.status(400).json({ error: "Invalid ObjectId format" });
       }
 
       const result = await Person.findByIdAndDelete(id);
 
       if (!result) {
           return response.status(404).json({ error: "Person not found" });
       }
 
       return response.status(204).end();
   } catch (error) {
       next(error);
   }
}

 

async function createPerson(request, response, next) {
    try {
      const body = request.body;

      const decodedToken = jwt.verify(getTokenFrom(request), config.JWT_SECRET);
  
      if (!decodedToken.id) {
        return response.status(401).json({ error: "Token invalid" });
      }
  
      // Find the user based on the decoded token
      const user = await User.findById(decodedToken.id);
  
      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }
  
      if (!body.name || !body.number) {
        if (!body.name) {
          return response.status(400).json({ error: "no name" });
        }
  
        if (!body.number) {
          return response.status(400).json({ error: "no number" });
        }
      }
  
      const person = new Person({
        name: body.name,
        number: body.number,
        status: body.status || false,
        userId: user.id,
      });
  
      const savedPerson = await person.save();
      user.persons = user.persons.concat(savedPerson._id);
      await user.save();
  
      return response.status(201).json(savedPerson);
    } catch (error) {
      next(error);
    }
  }
  


async function updatePerson(request, response, error) {
    const id = request.params.id;

    try {
        
        const existingPerson = await Person.findById(id);

        if (!existingPerson) {
            return response.status(404).json({ error: "Person not found" });
        }

        const { name, number, status } = request.body;

        const updatedPerson = {
            name: name || existingPerson.name,
            number: number || existingPerson.number,
            status: status !== undefined ? status : existingPerson.status,
        };

       
        const updatedPersonInDB = await Person.findByIdAndUpdate(id, updatedPerson, { 
            new: true,
            runValidators: true,
             context: "query"
        });

        return response.status(200).json(updatedPersonInDB);
    } catch (error) {
        next(error);
    }
}


export default {
    getPersonInfo,
    getPersons,
    getPerson,
    deletePerson,
    createPerson,
    updatePerson
};
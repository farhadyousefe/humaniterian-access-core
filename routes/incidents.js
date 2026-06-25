import express from 'express';
// import dotenv from 'dotenv';
// dotenv.config({path: "../.env"});
import debug from 'debug';
import { incident, validateIncident } from '../models/incident.js';

//2. Initialize debuggers (namespaced for modular logging)
const dbDebug = debug('app:db');
const appDebug = debug('app:startup');
const httpDebug = debug('app:http'); // lowercase helps
// select debug color manually
dbDebug.color = 2;
appDebug.color = 3;
httpDebug.color = 5;

const router = express.Router();

//-----------------------------------------------------------------------------
// router to get limited number of incidents, default to 10 if not specified
router.get('/', async (req, res) => {
  httpDebug('GET request received at /incident');
  let limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not provided
  try {
      const incidents = await incident.find().sort({ createdAt: -1 }).limit(limit);
      if(incidents.length === 0) {
        dbDebug('No incidents found in the database');
        return res.status(404).send('No incidents found');
      }
      res.status(200).json(incidents);
  } catch (error) {
      dbDebug(`Error fetching incidents: ${error.message}`);
      res.status(500).send('Internal Server Error');
  }
  httpDebug('Response sent for GET request at /incident');
});

//-----------------------------------------------------------------------------
// router.post to create a new incident
router.post('/', async (req, res) => {
    httpDebug('POST request received at /incident');
    const { error, value } = validateIncident(req.body);
    if (error) {
        dbDebug(`Validation error: ${error.details[0].message}`);
        return res.status(400).send(error.details[0].message);
    };

     let newIncident = new incident(value);
    try {
        newIncident = await newIncident.save();
        dbDebug(`New incident created with ID: ${newIncident._id}`);
        res.status(201).send(newIncident);
        httpDebug('Response sent for POST request at /incident');

    } catch (error) {
        dbDebug(`Error creating incident: ${error.message}`);
        return res.status(500).send('Internal Server Error');
    }
})
//-----------------------------------------------------------------------------
// router to update an specific incident by ID and return the updated incident
router.put("/:id", async (req, res) => {
    httpDebug('PUT/update request received at /incident');
    try {
        const {error, value} = validateIncident(req.body)
            if (error) {
            dbDebug(`Validation error: ${error.details[0].message}`);
            return res.status(400).send(error.details[0].message);
        };
        const singleIncident = await incident.findByIdAndUpdate(req.params.id, value,
            {
                new: true
            }
        )
        if(!singleIncident) {
            return res.status(404).send("The entered incident id is not found")
        }
    return res.status(200).json(singleIncident)
    } catch (error) {
        dbDebug(`Error updating incident: ${error.message}`);
        return res.status(500).send('Internal Server Error');
    }
})













export default router;

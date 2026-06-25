import mongoose from 'mongoose';
import Joi from 'joi';

const incidentSchema = new mongoose.Schema(
    {
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['bureaucratic', 'infrastructure', 'security', 'natural-disaster', 'other'],
        default: 'security'
    },
    impactLevel: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    location: {
        province: { type: String, required: true, trim: true },
        district: { type: String, required: true, trim: true },
        coordinates: {
            lat: { type: Number, default: null },
            lng: { type: Number, default: null }
        },
    },
        reportedBy: {
            type: String,
            required: true,
            default: 'IOM-Field-Office' // it will be linked to a user id
        },
        status: {
            type: String,
            required: true,
            trim: true,
            enum: ['active', 'resolved', 'investigating', 'closed'],
            default: 'active'
        },
    },
    {
        timestamps: true // This will automatically add createdAt and updatedAt fields
    });

function validateIncident(incident) {
    const schema = Joi.object({
        title: Joi.string().max(100).required(),
        description: Joi.string().required(),
        category: Joi.string().valid('bureaucratic', 'infrastructure', 'security', 'natural-disaster', 'other').required(),
        impactLevel: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
        location: Joi.object({
            province: Joi.string().required(),
            district: Joi.string().required(),
            coordinates: Joi.object({
                lat: Joi.number(),
                lng: Joi.number()
            })
        }).required(),
        reportedBy: Joi.string().default('IOM-Field-Office'),
        status: Joi.string().valid('active', 'resolved', 'investigating', 'closed').required()
    });

    return schema.validate(incident);
}

export { incidentSchema, validateIncident };

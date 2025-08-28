const mongoose = require('mongoose');

// Lowercase field names as requested
const LeadSchema = new mongoose.Schema(
    {
        state: { type: String, trim: true, index: true },
        first_name: { type: String, trim: true, required: true },
        last_name: { type: String, trim: true, required: true },
        address: { type: String, trim: true },
        city: { type: String, trim: true },
        email: { type: String, trim: true, lowercase: true, match: /.+\@.+\..+/ },
        zip: { type: String, trim: true, index: true },
        dob: { type: String, trim: true },           // e.g. MM/DD/YYYY if you store full
        ssn: { type: String, trim: true },           // consider encryption/tokenization
        ssn_1: { type: String, trim: true },
        ssn_2: { type: String, trim: true },
        ssn_3: { type: String, trim: true },
        license_number: { type: String, trim: true },
        license_state: { type: String, trim: true },
        employer_name: { type: String, trim: true },
        job_title: { type: String, trim: true },
        phone: { type: String, trim: true },
        employer_phone: { type: String, trim: true },
        bank_name: { type: String, trim: true },
        routing_number: { type: String, trim: true },
        account_number: { type: String, trim: true },
        sitename: { type: String, trim: true, index: true } // Added field
    },
    { timestamps: true }
);

// Helpful indexes
LeadSchema.index({ email: 1 });
LeadSchema.index({ phone: 1 });
LeadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Lead', LeadSchema);

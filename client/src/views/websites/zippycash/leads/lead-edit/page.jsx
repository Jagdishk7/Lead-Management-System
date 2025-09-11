import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Stack, TextField, Button, MenuItem, Grid } from '@mui/material';
import ProductsData from '../../../../../components/websites/zippycash/leads/ProductsData';

export default function LeadEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Get from local ProductsData by id (fallback to title/slug)
  const item = React.useMemo(() => {
    const key = decodeURIComponent(id || '');
    const byId = ProductsData.find((r) => String(r.id) === String(key));
    if (byId) return byId;
    return ProductsData.find((r) => String(r.slug || r.title) === key);
  }, [id]);

  const [form, setForm] = React.useState(
    () =>
      item || {
        state: '',
        loan_amount: '',
        first_name: '',
        last_name: '',
        address: '',
        city: '',
        email: '',
        zip: '',
        dob: '',
        ssn: '',
        ssn_1: '',
        ssn_2: '',
        ssn_3: '',
        license_number: '',
        license_state: '',
        employer_name: '',
        job_title: '',
        phone: '',
        employer_phone: '',
        bank_name: '',
        routing_number: '',
        account_number: '',
        sitename: '',
      },
  );

  const loanAmounts = [500, 1000, 1500, 2000, 2500, 5000, 10000];
  const states = [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' },
  ];

  const handle = (key) => (e) => {
    const val = e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((old) => ({ ...old, [key]: val }));
  };

  const onSave = () => {
    // TODO: replace with API PUT/PATCH(`/leads/${id}`, form)
    console.log('Saving lead', id, form);
    navigate(`/zippycash/leads/${encodeURIComponent(id)}`);
  };

  if (!item) {
    return (
      <Box p={3}>
        <Typography variant="h6">Lead not found</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }} variant="outlined">
          Back
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Edit Lead
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              required
              label="First Name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handle('first_name')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              required
              label="Last Name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handle('last_name')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              label="State"
              value={form.state}
              onChange={handle('state')}
              fullWidth
            >
              {states.map(({ code, name }) => (
                <MenuItem key={code} value={code}>{name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Loan Amount"
              placeholder="Select Amount"
              value={form.loan_amount}
              onChange={handle('loan_amount')}
              fullWidth
            >
              {loanAmounts.map((amt) => (
                <MenuItem key={amt} value={amt}>{`$${amt.toLocaleString()}`}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="ZIP Code"
              placeholder="ZIP Code"
              value={form.zip}
              onChange={handle('zip')}
              inputMode="numeric"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              type="email"
              label="Email"
              placeholder="Email Address"
              value={form.email}
              onChange={handle('email')}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField label="Address" value={form.address} onChange={handle('address')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="City" value={form.city} onChange={handle('city')} fullWidth />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField label="DOB" placeholder="MM/DD/YYYY" value={form.dob} onChange={handle('dob')} fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="SSN" value={form.ssn} onChange={handle('ssn')} fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField label="SSN 1" value={form.ssn_1} onChange={handle('ssn_1')} fullWidth />
              </Grid>
              <Grid item xs={4}>
                <TextField label="SSN 2" value={form.ssn_2} onChange={handle('ssn_2')} fullWidth />
              </Grid>
              <Grid item xs={4}>
                <TextField label="SSN 3" value={form.ssn_3} onChange={handle('ssn_3')} fullWidth />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField label="Driver's License" value={form.license_number} onChange={handle('license_number')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField select label="License State" value={form.license_state} onChange={handle('license_state')} fullWidth>
              {states.map(({ code, name }) => (
                <MenuItem key={code} value={code}>{name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField label="Employer Name" value={form.employer_name} onChange={handle('employer_name')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Job Title" value={form.job_title} onChange={handle('job_title')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Phone" placeholder="Phone Number" value={form.phone} onChange={handle('phone')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Employer Phone" value={form.employer_phone} onChange={handle('employer_phone')} fullWidth />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField label="Bank Name" value={form.bank_name} onChange={handle('bank_name')} fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Routing" placeholder="Routing Number" value={form.routing_number} onChange={handle('routing_number')} inputMode="numeric" fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Bank Account" placeholder="Bank Account Number" value={form.account_number} onChange={handle('account_number')} inputMode="numeric" fullWidth />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField label="Site Name" value={form.sitename} onChange={handle('sitename')} fullWidth />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={1.5} mt={3}>
          <Button variant="contained" onClick={onSave}>
            Save
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

import * as React from 'react';
import { useParams, useNavigate } from 'react-router';
import { Box, Paper, Typography, Stack, Button, Divider, Grid, Avatar } from '@mui/material';
import AchData from '../../../../../components/websites/zippycash/ach/AchData';

export default function AchView() {
  const { id } = useParams();
  const navigate = useNavigate();

  // In production: GET(`/ach/${id}`)
  const item = React.useMemo(() => {
    const key = decodeURIComponent(id || '');
    const byId = AchData.find((r) => String(r.id) === String(key));
    if (byId) return byId;
    return AchData.find((r) => String(r.slug || r.title) === key);
  }, [id]);

  const fullName = `${item?.first_name || ''} ${item?.last_name || ''}`.trim() || item?.title || 'Lead';
  const initials = `${(item?.first_name || item?.title || 'L')[0]}${(item?.last_name || '')[0] || ''}`.toUpperCase();
  const mask = (v = '') => (v ? `•••• ${String(v).slice(-4)}` : '—');
  const present = (v) => v !== undefined && v !== null && String(v).trim() !== '';

  // US states for displaying full name
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
  const stateName = (code) => states.find((s) => s.code === code)?.name || code || '—';

  const ssnMasked = () => {
    if (present(item?.ssn)) return mask(item?.ssn);
    if (present(item?.ssn_3)) return `***-**-${String(item.ssn_3).slice(-4)}`;
    return '—';
  };

  const InfoItem = ({ label, value }) => {
    if (!present(value)) return null;
    return (
      <Grid item xs={12} sm={6}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1">{value}</Typography>
      </Grid>
    );
  };

  if (!item) {
    return (
      <Box p={3}>
        <Typography variant="h6">ACH Lead not found</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }} variant="outlined">
          Back
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main' }}>{initials}</Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item?.email}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5}>
            <Button size="small" variant="contained" onClick={() => navigate(`/zippycash/ach/${id}/edit`)}>
              Edit
            </Button>
            <Button size="small" variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Simple details grid */}
        <Grid container spacing={2}>
          {(() => {
            const addressLine = [
              item?.address,
              item?.city,
              present(item?.state) ? `${stateName(item.state)} (${item.state})` : '',
              item?.zip,
            ]
              .filter(Boolean)
              .join(', ');

            return (
              <>
                <InfoItem label="Loan Amount" value={present(item?.loan_amount) ? `$${Number(item.loan_amount).toLocaleString()}` : ''} />
                <InfoItem label="Email" value={item?.email} />
                <InfoItem label="Phone" value={item?.phone} />
                <InfoItem label="First Name" value={item?.first_name} />
                <InfoItem label="Last Name" value={item?.last_name} />
                <InfoItem label="DOB" value={item?.dob} />
                <InfoItem label="SSN" value={ssnMasked()} />
                <InfoItem label="State" value={present(item?.state) ? `${stateName(item.state)} (${item.state})` : ''} />
                <InfoItem label="ZIP Code" value={item?.zip} />
                <InfoItem label="Address" value={addressLine} />
                <InfoItem label="Driver's License" value={item?.license_number} />
                <InfoItem label="License State" value={present(item?.license_state) ? `${stateName(item.license_state)} (${item.license_state})` : ''} />
                <InfoItem label="Employer Name" value={item?.employer_name} />
                <InfoItem label="Employer Phone" value={item?.employer_phone} />
                <InfoItem label="Bank Name" value={item?.bank_name} />
                <InfoItem label="Routing Number" value={mask(item?.routing_number)} />
                <InfoItem label="Account Number" value={mask(item?.account_number)} />
                <InfoItem label="Site" value={item?.sitename} />
              </>
            );
          })()}
        </Grid>
      </Paper>
    </Box>
  );
}

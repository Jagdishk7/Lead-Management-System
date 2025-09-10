import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';

const emptyFilters = {
  status: 'all', // all | instock | outofstock
  category: 'all',
  range: 'all', // all | today | last7 | last30 | thismonth | custom
  dateFrom: '',
  dateTo: '',
  minPrice: '',
  maxPrice: '',
};

export default function LeadFilterModal({
  open,
  onClose,
  onApply,
  onReset,
  categories = ['all'],
  value,
  onChange,
}) {
  const f = { ...emptyFilters, ...(value || {}) };
  const [rangeOpen, setRangeOpen] = React.useState(false);
  const [tmpFrom, setTmpFrom] = React.useState(f.dateFrom || '');
  const [tmpTo, setTmpTo] = React.useState(f.dateTo || '');

  const handle = (key) => (e) => {
    onChange({ ...f, [key]: e.target.value });
  };

  const formatDate = (d) => {
    try {
      const iso = new Date(d).toISOString();
      return iso.slice(0, 10);
    } catch (e) {
      return '';
    }
  };

  const setRange = (val) => {
    const today = new Date();
    let from = '', to = '';
    if (val === 'today') {
      from = formatDate(today);
      to = formatDate(today);
    } else if (val === 'last7') {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      from = formatDate(d);
      to = formatDate(today);
    } else if (val === 'last30') {
      const d = new Date();
      d.setDate(d.getDate() - 29);
      from = formatDate(d);
      to = formatDate(today);
    } else if (val === 'thismonth') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      from = formatDate(start);
      to = formatDate(end);
    } else if (val === 'custom') {
      from = f.dateFrom || '';
      to = f.dateTo || '';
    } else {
      // all
      from = '';
      to = '';
    }
    onChange({ ...f, range: val, dateFrom: from, dateTo: to });
  };

  const openRangeDialog = () => {
    setTmpFrom(f.dateFrom || '');
    setTmpTo(f.dateTo || '');
    setRangeOpen(true);
  };
  const closeRangeDialog = () => setRangeOpen(false);
  const applyRangeDialog = () => {
    onChange({ ...f, dateFrom: tmpFrom, dateTo: tmpTo });
    setRangeOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filter Leads</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={f.status} onChange={handle('status')}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="instock">In Stock</MenuItem>
              <MenuItem value="outofstock">Out of Stock</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select label="Category" value={f.category} onChange={handle('category')}>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select label="Date Range" value={f.range} onChange={(e) => setRange(e.target.value)}>
              <MenuItem value="all">All Dates</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="last7">Last 7 days</MenuItem>
              <MenuItem value="last30">Last 30 days</MenuItem>
              <MenuItem value="thismonth">This month</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>

          {f.range === 'custom' && (
            <TextField
              label="Date Range"
              placeholder="YYYY-MM-DD → YYYY-MM-DD"
              value={f.dateFrom && f.dateTo ? `${f.dateFrom} → ${f.dateTo}` : ''}
              onClick={openRangeDialog}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              type="number"
              label="Min Price"
              value={f.minPrice}
              onChange={handle('minPrice')}
              fullWidth
            />
            <TextField
              type="number"
              label="Max Price"
              value={f.maxPrice}
              onChange={handle('maxPrice')}
              fullWidth
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onReset} color="secondary" variant="outlined">
          Reset
        </Button>
        <Button onClick={onApply} variant="contained">
          Apply
        </Button>
      </DialogActions>
      {/* Single range picker dialog */}
      <Dialog open={rangeOpen} onClose={closeRangeDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Select Date Range</DialogTitle>
        <DialogContent dividers>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              type="date"
              label="Start"
              InputLabelProps={{ shrink: true }}
              value={tmpFrom}
              onChange={(e) => setTmpFrom(e.target.value)}
              fullWidth
            />
            <TextField
              type="date"
              label="End"
              InputLabelProps={{ shrink: true }}
              value={tmpTo}
              onChange={(e) => setTmpTo(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRangeDialog}>Cancel</Button>
          <Button onClick={applyRangeDialog} variant="contained">Done</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}

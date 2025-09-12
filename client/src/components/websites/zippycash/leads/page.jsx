import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { format } from 'date-fns';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  IconButton,
  Tooltip,
  FormControlLabel,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Stack,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import CustomCheckbox from '../../../forms/theme-elements/CustomCheckbox';
import CustomSwitch from '../../../forms/theme-elements/CustomSwitch';
import {
  IconDotsVertical,
  IconFilter,
  IconSearch,
} from '@tabler/icons';

import LeadFilterModal from './components/LeadFilterModal';
import LeadActionMenu from './components/LeadActionMenu';
import { useNavigate } from 'react-router-dom';
import useZippyLeadsTable from './useZippyLeadsTable';

// -------- helpers: sorting (client-side on current page only) ----------
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
  const stabilized = array.map((el, index) => [el, index]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'phone', numeric: false, disablePadding: false, label: 'Phone' },
  { id: 'state', numeric: false, disablePadding: false, label: 'State' },
  { id: 'zip', numeric: false, disablePadding: false, label: 'ZIP' },
  { id: 'amount', numeric: true, disablePadding: false, label: 'Loan Amount' },
  { id: 'created', numeric: false, disablePadding: false, label: 'Date' },
  { id: 'action', numeric: false, disablePadding: false, label: 'Action', sortable: false },
];

function LeadTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }) {
  const createSortHandler = (property) => (event) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <CustomCheckbox
            color="primary"
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputprops={{ 'aria-label': 'select all rows' }}
          />
        </TableCell> */}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable === false ? (
              headCell.label
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
LeadTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function LeadToolbar({ numSelected, search, handleSearch, onOpenFilter }) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        gap: 1.5,
        flexWrap: 'wrap',
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 auto' }} color="inherit" variant="subtitle2">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 auto' }} variant="h6">
          Zippy Cash Leads
        </Typography>
      )}

      <TextField
        value={search}
        onChange={handleSearch}
        size="small"
        placeholder="Search name, email, phone, state, zip…"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconSearch size="1.1rem" />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 280 }}
      />

      {numSelected > 0 ? null : (
        <Tooltip title="Open filters">
          <IconButton onClick={onOpenFilter}>
            <IconFilter size="1.2rem" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

// Debounce hook for search
function useDebounced(value, delay = 500) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function LeadTable() {
  const navigate = useNavigate();
  const {
    // data
    rows, total, loading, error,
    // sorting
    order, orderBy, handleRequestSort,
    // selection
    selected, handleSelectAllClick, handleRowSelect,
    // paging & density
    page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, dense, handleChangeDense,
    // search
    search, handleSearch,
    // filters
    filterOpen, openFilter, closeFilter, resetFilters, applyFilterAndClose, filters, setFilters, categories,
  } = useZippyLeadsTable({ websiteCode: 'zippy_cash' });
  const isSelected = (id) => selected.indexOf(id) !== -1;

  // -------------- actions --------------
  const idOf = (r) => r._id;
  const handleView = (e, r) => {
    e.stopPropagation();
    navigate(`/zippycash/leads/${encodeURIComponent(idOf(r))}`);
  };
  const handleEdit = (e, r) => {
    e.stopPropagation();
    navigate(`/zippycash/leads/${encodeURIComponent(idOf(r))}/edit`);
  };
  const [actionAnchor, setActionAnchor] = React.useState(null);
  const [actionRow, setActionRow] = React.useState(null);
  const actionOpen = Boolean(actionAnchor);
  const openActionMenu = (e, r) => { e.stopPropagation(); setActionAnchor(e.currentTarget); setActionRow(r); };
  const closeActionMenu = () => { setActionAnchor(null); setActionRow(null); };

  // No client-side emptyRows calculation needed with server-side pagination

  return (
    <Box>
      <LeadToolbar
        numSelected={selected.length}
        search={search}
        handleSearch={handleSearch}
        onOpenFilter={openFilter}
      />

      <Paper variant="outlined" sx={{ mx: 2, mt: 1 }}>
        <TableContainer sx={{ maxHeight: '60vh' }}>
          <Table
            stickyHeader
            sx={{ minWidth: 900 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <LeadTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={9}>Loading…</TableCell></TableRow>
              ) : error ? (
                <TableRow><TableCell colSpan={9} style={{ color: 'red' }}>{error}</TableCell></TableRow>
              ) : rows.length === 0 ? (
                <TableRow><TableCell colSpan={9}>No leads found</TableCell></TableRow>
              ) : (
                stableSort(rows, getComparator(order, orderBy))
                  .map((row) => {
                    const isItemSelected = isSelected(row._id);
                    const labelId = `enhanced-table-checkbox-${row._id}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleRowSelect(event, row._id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row._id}
                        selected={isItemSelected}
                      >
                        {/* <TableCell padding="checkbox">
                          <CustomCheckbox
                            color="primary"
                            checked={isItemSelected}
                            inputprops={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell> */}
                        <TableCell>
                          <Typography variant="subtitle1" fontWeight={600}>{row.name || '—'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{row.email || '—'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{row.phone || '—'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{row.state || '—'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{row.zip || '—'}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={600}>${row.amount ?? 0}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{row.created ? format(new Date(row.created), 'E, MMM d yyyy') : '—'}</Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={(e) => openActionMenu(e, row)}>
                            <IconDotsVertical size="1.1rem" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Box ml={2} mt={1}>
        <FormControlLabel
          control={<CustomSwitch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Box>

      {/* Filter Modal */}
      <LeadFilterModal
        open={filterOpen}
        onClose={closeFilter}
        onApply={applyFilterAndClose}
        onReset={resetFilters}
        categories={categories}
        value={filters}
        onChange={setFilters}
      />

      {/* Three-dot Popover menu */}
      <LeadActionMenu
        open={actionOpen}
        anchorEl={actionAnchor}
        onClose={closeActionMenu}
        onView={(e) => { if (actionRow) handleView(e || new Event('click'), actionRow); }}
        onEdit={(e) => { if (actionRow) handleEdit(e || new Event('click'), actionRow); }}
        onDelete={() => { /* TODO: call DELETE /leads/:id */ closeActionMenu(); }}
      />
    </Box>
  );
}

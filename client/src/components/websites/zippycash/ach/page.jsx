import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { format, isBefore, isAfter } from 'date-fns';
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

import AchData from './AchData';
import CustomCheckbox from '../../../forms/theme-elements/CustomCheckbox';
import CustomSwitch from '../../../forms/theme-elements/CustomSwitch';
import { IconDotsVertical, IconFilter, IconSearch, IconTrash } from '@tabler/icons';

import LeadFilterModal from '../leads/components/LeadFilterModal';
import LeadActionMenu from '../leads/components/LeadActionMenu';
import { useNavigate } from 'react-router';

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
  { id: 'amount', numeric: true, disablePadding: false, label: 'Amount' },
  { id: 'created', numeric: false, disablePadding: false, label: 'Date' },
  { id: 'action', numeric: false, disablePadding: false, label: 'Action', sortable: false },
];

function AchTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }) {
  const createSortHandler = (property) => (event) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <CustomCheckbox
            color="primary"
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputprops={{ 'aria-label': 'select all rows' }}
          />
        </TableCell>
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
AchTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function AchToolbar({ numSelected, search, handleSearch, onOpenFilter }) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
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
          Zippy Cash ACH
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

      {numSelected > 0 ? (
        <Tooltip title="Delete selected">
          <IconButton>
            <IconTrash width="18" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Open filters">
          <IconButton onClick={onOpenFilter}>
            <IconFilter size="1.2rem" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export default function AchTable() {
  const navigate = useNavigate();

  // table state
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // data
  const originalRows = React.useMemo(
    () =>
      (AchData || []).map((r) => ({
        ...r,
        name:
          (r.first_name || r.last_name)
            ? `${r.first_name || ''} ${r.last_name || ''}`.trim()
            : r.title || '',
        amount: r.loan_amount ?? r.price ?? '',
      })),
    [],
  );
  const [rows, setRows] = React.useState(originalRows);
  const [search, setSearch] = React.useState('');

  // categories for filter modal (placeholder)
  const categories = React.useMemo(() => ['all', 'ach'], []);

  // filter modal
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    status: 'all',
    category: 'all',
    range: 'all',
    dateFrom: '',
    dateTo: '',
    minPrice: '',
    maxPrice: '',
  });

  // action popover
  const [actionAnchor, setActionAnchor] = React.useState(null);
  const [actionRow, setActionRow] = React.useState(null);
  const actionOpen = Boolean(actionAnchor);

  const applyFilters = React.useCallback(
    (baseRows, searchText, f) => {
      const s = (searchText || '').toLowerCase().trim();
      const { status, category, dateFrom, dateTo, minPrice, maxPrice } = f;

      return baseRows.filter((row) => {
        const hay = `${row.name ?? ''} ${row.email ?? ''} ${row.phone ?? ''} ${row.state ?? ''} ${row.zip ?? ''}`.toLowerCase();
        if (s && !hay.includes(s)) return false;

        if (status === 'instock' && !row.stock) return false;
        if (status === 'outofstock' && row.stock) return false;
        if (category !== 'all' && row.category !== category) return false;

        if (dateFrom) {
          const from = new Date(dateFrom);
          if (isBefore(row.created ? new Date(row.created) : new Date(0), from)) return false;
        }
        if (dateTo) {
          const to = new Date(dateTo);
          if (isAfter(row.created ? new Date(row.created) : new Date(0), to)) return false;
        }

        const p = Number(row.amount ?? 0);
        if (filters.minPrice !== '' && p < Number(minPrice)) return false;
        if (filters.maxPrice !== '' && p > Number(maxPrice)) return false;

        return true;
      });
    },
    [filters.minPrice, filters.maxPrice],
  );

  const handleSearch = (event) => {
    const val = event.target.value;
    setSearch(val);
    setPage(0);
    setRows(applyFilters(originalRows, val, filters));
  };

  const openFilter = () => setFilterOpen(true);
  const closeFilter = () => setFilterOpen(false);
  const resetFilters = () => {
    const f = {
      status: 'all',
      category: 'all',
      range: 'all',
      dateFrom: '',
      dateTo: '',
      minPrice: '',
      maxPrice: '',
    };
    setFilters(f);
    setSearch('');
    setRows(originalRows);
    setPage(0);
  };
  const applyFilterAndClose = () => {
    setRows(applyFilters(originalRows, search, filters));
    setPage(0);
    closeFilter();
  };

  // sorting/selection
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleRowSelect = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) newSelected = newSelected.concat(selected, name);
    else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1));
    else if (selectedIndex === selected.length - 1)
      newSelected = newSelected.concat(selected.slice(0, -1));
    else if (selectedIndex > 0)
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    setSelected(newSelected);
  };
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeDense = (event) => setDense(event.target.checked);
  const isSelected = (name) => selected.indexOf(name) !== -1;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // actions
  const idOf = (r) => r.id ?? r.slug ?? r.title ?? r.name;
  const handleView = (e, r) => {
    e.stopPropagation();
    navigate(`/zippycash/ach/${encodeURIComponent(idOf(r))}`);
  };
  const handleEdit = (e, r) => {
    e.stopPropagation();
    navigate(`/zippycash/ach/${encodeURIComponent(idOf(r))}/edit`);
  };
  const handleDelete = (e, r) => {
    e.stopPropagation();
    const ok = window.confirm('Delete this record?');
    if (ok) {
      setRows((prev) => prev.filter((x) => idOf(x) !== idOf(r)));
      setSelected((prev) => prev.filter((t) => t !== r.title));
    }
    closeActionMenu();
  };

  const openActionMenu = (e, r) => {
    e.stopPropagation();
    setActionAnchor(e.currentTarget);
    setActionRow(r);
  };
  const closeActionMenu = () => {
    setActionAnchor(null);
    setActionRow(null);
  };

  return (
    <Box>
      <AchToolbar
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
            <AchTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleRowSelect(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={idOf(row)}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <CustomCheckbox
                          color="primary"
                          checked={isItemSelected}
                          inputprops={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>

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
                        <Typography>
                          {row.created ? format(new Date(row.created), 'E, MMM d yyyy') : '—'}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton size="small" onClick={(e) => openActionMenu(e, row)}>
                            <IconDotsVertical size="1.1rem" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={rows.length}
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
        onClose={() => setFilterOpen(false)}
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
        onView={(e) => {
          if (actionRow) handleView(e || new Event('click'), actionRow);
        }}
        onEdit={(e) => {
          if (actionRow) handleEdit(e || new Event('click'), actionRow);
        }}
        onDelete={(e) => {
          if (actionRow) handleDelete(e || new Event('click'), actionRow);
        }}
      />
    </Box>
  );
}

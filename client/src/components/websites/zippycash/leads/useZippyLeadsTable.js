import { useCallback, useEffect, useMemo, useState } from 'react';
import { listLeads } from 'src/api/leads';

function useDebounced(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function useZippyLeadsTable({ websiteCode = 'zippy_cash' } = {}) {
  // Sorting
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  // Selection (store row._id)
  const [selected, setSelected] = useState([]);

  // Paging + density
  const [page, setPage] = useState(0); // 0-based UI
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dense, setDense] = useState(true);

  // Data
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Search
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search, 500);

  // Filters (modal)
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    range: 'all',
    dateFrom: '',
    dateTo: '',
    minPrice: '',
    maxPrice: '',
  });

  // categories for modal (UI metadata only)
  const categories = useMemo(() => ['all'], []);

  // Build params
  const params = useMemo(() => {
    const p = {
      page: page + 1,
      limit: rowsPerPage,
      website_code: websiteCode,
    };
    if (debouncedSearch) p.q = debouncedSearch;
    if (filters.dateFrom) p.created_from = filters.dateFrom;
    if (filters.dateTo) p.created_to = filters.dateTo;
    return p;
  }, [page, rowsPerPage, websiteCode, debouncedSearch, filters.dateFrom, filters.dateTo]);

  // Fetch
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await listLeads(params);
        if (cancelled) return;
        setRows((data.items || []).map((r) => ({
          ...r,
          name: (r.first_name || r.last_name)
            ? `${r.first_name || ''} ${r.last_name || ''}`.trim()
            : r.title || '',
          amount: r.loan_amount ?? '',
          created: r.createdAt,
          zip: r.zip,
        })));
        setTotal(data.total || 0);
        setSelected([]);
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.message || 'Failed to load leads');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [params]);

  // Handlers
  const handleRequestSort = useCallback((event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [order, orderBy]);

  const handleSelectAllClick = useCallback((event) => {
    if (event.target.checked) { setSelected(rows.map((r) => r._id)); return; }
    setSelected([]);
  }, [rows]);

  const handleRowSelect = useCallback((event, id) => {
    const selectedIndex = selected.indexOf(id);
    let next = [];
    if (selectedIndex === -1) next = next.concat(selected, id);
    else if (selectedIndex === 0) next = next.concat(selected.slice(1));
    else if (selectedIndex === selected.length - 1) next = next.concat(selected.slice(0, -1));
    else if (selectedIndex > 0) next = next.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    setSelected(next);
  }, [selected]);

  const handleChangePage = useCallback((_, newPage) => setPage(newPage), []);
  const handleChangeRowsPerPage = useCallback((e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }, []);
  const handleChangeDense = useCallback((e) => setDense(e.target.checked), []);

  const handleSearch = useCallback((e) => { setSearch(e.target.value); setPage(0); }, []);

  const openFilter = useCallback(() => setFilterOpen(true), []);
  const closeFilter = useCallback(() => setFilterOpen(false), []);
  const resetFilters = useCallback(() => {
    setFilters({ status: 'all', category: 'all', range: 'all', dateFrom: '', dateTo: '', minPrice: '', maxPrice: '' });
    setSearch('');
    setPage(0);
  }, []);
  const applyFilterAndClose = useCallback(() => { setPage(0); setFilterOpen(false); }, []);

  return {
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

    // filters modal/state
    filterOpen, openFilter, closeFilter, resetFilters, applyFilterAndClose, filters, setFilters,

    // UI metadata
    categories,
  };
}

import React, {
  ChangeEvent,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  Table,
  Box,
  Typography,
  FlexGrid,
  Spinner,
  Button,
  Select,
  Checkbox,
} from 'components';
import {useTheme} from 'styled-components';
import {Columns, Sort} from 'icons';
import {useOutsideClick} from 'components/useOutsideClick';
import {Props} from './types';

export const DataTable: React.FC<Props> = ({
  isLoading,
  onEmptyMessage = 'Keine Einträge',
  columns,
  data,
  totalCount,
  totalPages,
  currentPage,
  onPrev,
  onNext,
  onRowsPerPageChange,
  rowsPerPage = 10,
  actions,
  onAction,
  id,
  onOrderByChange,
  orderBy,
}) => {
  const {spacing, colors} = useTheme();
  const localStorageKey = `data-table-${id}`;

  const [cols, setCols] = useState([]);
  const _visibleCols = columns.filter((_val, index) =>
    cols.includes(`${index}`),
  );
  const _columns = columns.map(({title}, index) => ({
    title,
    index: `${index}`,
  }));

  const [showSortPopup, setShowSortPopup] = useState(false);
  const [showColsPopUp, setShowColsPopup] = useState(false);

  useEffect(() => {
    const key = localStorageKey + 'columns';
    let data = localStorage.getItem(key);


    if (data) {
      const cols = JSON.parse(data);
      setCols(cols);
      return;
    }

    setCols(_columns.map(({index}) => index));
  }, [columns, localStorageKey]);

  const colsPopupRef = useRef<HTMLDivElement>();
  useOutsideClick(colsPopupRef, () => {
    if (!showColsPopUp) return;
    setShowColsPopup(false);
    if (!id) return;
    const key = localStorageKey + 'columns';
    localStorage.setItem(key, JSON.stringify(cols));
  });

  const sortPopupRef = useRef<HTMLDivElement>();
  useOutsideClick(sortPopupRef, () => {
    if (!showSortPopup) return;
    setShowSortPopup(false);
  });

  const showPagination =
    totalCount !== undefined &&
    totalPages !== undefined &&
    currentPage !== undefined;

  const _onRowsPerPageChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const {value} = event.target;
    let asInt = parseInt(value, 10);
    if (isNaN(asInt)) asInt = 1;
    if (asInt < 1) asInt = 1;
    onRowsPerPageChange(asInt);
  };

  const [state, dispatch] = useReducer((state, action) => {
    if (action.value === 'masterCheckbox') {
      if (!action.checked) return {}; // uncheck all

      return {
        masterCheckbox: action.value,
        ...Array(data?.length)
          .fill(0)
          .reduce(
            (acc, _curr, idx) => ({...acc, [idx.toString()]: idx.toString()}),
            {},
          ),
      };
    }

    if (action.checked) {
      const _state = {...state, [action.value]: action.value};
      if (!_state.masterCheckbox) {
        if (Object.keys(_state).length === data.length) {
          _state.masterCheckbox = 'masterCheckbox';
        }
      }

      return _state;
    }

    delete state[action.value];

    if (state.masterCheckbox) {
      delete state.masterCheckbox;
    }

    return {...state};
  }, {});

  const onCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {value, checked} = event.target;
    dispatch({value, checked});
  };

  const [action, setAction] = useState('');
  const _onAction = () => {
    const {masterCheckbox, ...indices} = state;
    const mapper = (idx: string) => parseInt(idx, 10);
    const selectedIndices = Object.keys(indices).map(mapper);
    onAction && onAction(action, selectedIndices);
  };

  return (
    <>
      {actions?.length && (
        <FlexGrid
          alignItems="center"
          flexGap={spacing.scale200}
          marginBottom={spacing.scale200}
        >
          {actions?.length && (
            <Box
              display="grid"
              gridAutoFlow="column"
              alignItems="center"
              columnGap={spacing.scale200}
            >
              <Select
                options={[{label: '-- Aktion --', value: ''}, ...actions]}
                onChange={({target}) => {
                  setAction(target.value);
                }}
              />
              <Button
                kind="minimal"
                onClick={_onAction}
                disabled={!(action && Object.keys(state).length)}
              >
                durchführen
              </Button>
            </Box>
          )}
          <Box
            margin="0 0 0 auto"
            display="grid"
            gridAutoFlow="column"
            columnGap={spacing.scale200}
            position="relative"
          >
            <Box position="relative" display="flex" alignItems="center">
              <Button
                kind="minimal"
                onClick={() => setShowSortPopup((curr) => !curr)}
              >
                <Sort />
              </Button>
              {showSortPopup && (
                <div ref={sortPopupRef}>
                  <Box
                    position="absolute"
                    right={0}
                    top={spacing.scale600}
                    background="white"
                    padding={spacing.scale400}
                    boxShadow="1px 1px 5px 0px rgba(64, 64, 64, 0.3)"
                    display="flex"
                    zIndex={30}
                    minWidth={200}
                  >
                    <Select
                      options={
                        isLoading
                          ? [{label: '-'.repeat(10), value: ''}]
                          : _columns.map(({title}) => ({
                              label: title,
                              value: title,
                            }))
                      }
                      onChange={(event) => {
                        const {value} = event.target;
                        onOrderByChange(value);
                      }}
                      value={orderBy}
                    />
                  </Box>
                </div>
              )}
            </Box>
            {actions?.length && (
              <Box position="relative" display="flex" alignItems="center">
                <Button
                  kind="minimal"
                  onClick={() => setShowColsPopup((curr) => !curr)}
                >
                  <Columns />
                </Button>
                {showColsPopUp && (
                  <div ref={colsPopupRef}>
                    <Box
                      position="absolute"
                      right={0}
                      top={spacing.scale600}
                      background="white"
                      padding={spacing.scale400}
                      boxShadow="1px 1px 5px 0px rgba(64, 64, 64, 0.3)"
                      display="flex"
                      zIndex={30}
                      minWidth={200}
                    >
                      <Checkbox
                        options={_columns.map(({title, index}) => ({
                          label: title,
                          value: index,
                        }))}
                        value={cols}
                        onChange={(event) => {
                          const {value} = event.target;
                          if (cols.includes(value)) {
                            setCols((cols) =>
                              cols.filter((val) => val !== value),
                            );
                          } else {
                            setCols((cols) => [...cols, value]);
                          }
                        }}
                      />
                    </Box>
                  </div>
                )}
              </Box>
            )}
          </Box>
        </FlexGrid>
      )}
      <Box overflow="scroll" width="100%" display="flex">
        <Table style={{zIndex: 1}}>
          <thead>
            <tr>
              {actions && (
                <th>
                  <Checkbox
                    options={[{label: '', value: 'masterCheckbox'}]}
                    onChange={onCheckboxChange}
                    value={state.masterCheckbox}
                    indeterminate={
                      Object.keys(state).length > 0 && !state.masterCheckbox
                    }
                    disabled={data.length === 0}
                  />
                </th>
              )}
              {_visibleCols.map(({title}, idx) => (
                <th
                  key={idx}
                  style={{whiteSpace: 'nowrap', overflowX: 'scroll'}}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              data.map((row, idx) => (
                <tr key={idx}>
                  {actions && (
                    <td>
                      <Checkbox
                        name={idx.toString()}
                        options={[{label: '', value: idx.toString()}]}
                        onChange={onCheckboxChange}
                        value={state[idx.toString()] || []}
                      />
                    </td>
                  )}
                  {_visibleCols.map((column, idx) => (
                    <td
                      data-label={column.title}
                      key={idx}
                      style={{whiteSpace: 'nowrap', overflow: 'scroll'}}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </Table>
      </Box>
      {(isLoading || !data.length) && (
        <Box display="flex" marginTop={20} justifyContent="center">
          {isLoading ? <Spinner /> : <Typography>{onEmptyMessage}</Typography>}
        </Box>
      )}
      {showPagination && !isLoading && (
        <FlexGrid
          justifyContent="space-between"
          flexGap={spacing.scale600}
          padding={spacing.scale200}
        >
          <section>
            <FlexGrid alignItems="center" flexGap={spacing.scale200}>
              <Typography>Zeilen pro Seite: </Typography>
              <Select
                onChange={_onRowsPerPageChange}
                defaultValue={rowsPerPage.toString()}
                options={[10, 50, 100, 500, 1000].map((val) => ({
                  label: `${val}`,
                  value: `${val}`,
                }))}
              />
            </FlexGrid>
          </section>
          <section>
            <FlexGrid
              justifyContent="flex-end"
              flexGap={spacing.scale600}
              padding={spacing.scale200}
            >
              <Button
                kind="minimal"
                disabled={currentPage! <= 1}
                onClick={onPrev}
              >
                Vorherige
              </Button>
              <Box
                display="grid"
                gridAutoFlow="column"
                columnGap={spacing.scale200}
                alignItems="center"
              >
                <Typography>
                  Seite: {currentPage} aus {totalPages}
                </Typography>
                <span
                  style={{
                    width: 0.5,
                    height: 16,
                    background: colors.typographyPrimary,
                  }}
                />
                <Typography>
                  Zeilen: {(currentPage - 1) * data.length + 1}-
                  {currentPage * data.length} aus {totalCount}
                </Typography>
              </Box>
              <Button
                kind="minimal"
                disabled={currentPage! >= totalPages!}
                onClick={onNext}
              >
                Nächste
              </Button>
            </FlexGrid>
          </section>
        </FlexGrid>
      )}
    </>
  );
};

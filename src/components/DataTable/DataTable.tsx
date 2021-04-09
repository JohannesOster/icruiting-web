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
  Flexgrid,
  Spinner,
  Button,
  Select,
  Checkbox,
} from 'components';
import styled, {useTheme} from 'styled-components';
import {Input} from 'components/Input'; // for some reason sc crashes if Input is imported from components folder and not directly from Input folder
import {Columns} from 'icons';
import {useOutsideClick} from 'components/useOutsideClick';

export type TColumn = {
  title: string;
  cell: (row: {[key: string]: any}) => React.ReactNode;
};

const StyledInput = styled(Input)`
  width: 80px;
`;

type Props = {
  isLoading?: boolean;
  onEmptyMessage?: string;
  columns: TColumn[];
  data: {[key: string]: any}[];
  getRowStyle?: (row: {[key: string]: any}) => React.CSSProperties;
  totalPages?: number;
  currentPage?: number;
  totalCount?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onRowsPerPageChange?: (rows: number) => void;
  rowsPerPage?: number;
  actions?: {label: string; value: string}[];
  onAction?: (action: string, selectedIndices: number[]) => void;
};

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
  getRowStyle = (_row) => ({}),
  onRowsPerPageChange,
  rowsPerPage = 10,
  actions,
  onAction,
}) => {
  const {spacing, colors} = useTheme();

  const [showColsPopUp, setShowColsPopup] = useState(false);
  const _columns = columns.map(({title}, index) => ({
    title,
    index: index.toString(),
  }));
  const [cols, setCols] = useState(_columns.map(({index}) => index));
  const _visibleCols = columns.filter((_val, index) =>
    cols.includes(index.toString()),
  );

  const ref = useRef<HTMLDivElement>();
  useOutsideClick(ref, () => {
    if (!showColsPopUp) return;
    setShowColsPopup(false);
  });

  const showPagination =
    totalCount !== undefined &&
    totalPages !== undefined &&
    currentPage !== undefined;

  const _onRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
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
        <Flexgrid
          justifyContent="space-between"
          alignItems="center"
          marginBottom={spacing.scale200}
        >
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
          <Box position="relative">
            <Button
              kind="minimal"
              onClick={() => setShowColsPopup((curr) => !curr)}
            >
              <Columns />
            </Button>
            {showColsPopUp && (
              <div ref={ref}>
                <Box
                  position="absolute"
                  right={0}
                  background="white"
                  padding={spacing.scale400}
                  boxShadow="1px 1px 5px 0px rgba(64, 64, 64, 0.3)"
                  display="flex"
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
                        setCols((cols) => cols.filter((val) => val !== value));
                      } else {
                        setCols((cols) => [...cols, value]);
                      }
                    }}
                  />
                </Box>
              </div>
            )}
          </Box>
        </Flexgrid>
      )}
      <Table>
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
              <th key={idx}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!isLoading &&
            data.map((row, idx) => (
              <tr key={idx} style={getRowStyle(row)}>
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
                  <td data-label={column.title} key={idx}>
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </Table>
      {(isLoading || !data.length) && (
        <Box display="flex" marginTop={20} justifyContent="center">
          {isLoading ? <Spinner /> : <Typography>{onEmptyMessage}</Typography>}
        </Box>
      )}
      {showPagination && !isLoading && (
        <Flexgrid
          justifyContent="space-between"
          flexGap={spacing.scale600}
          padding={spacing.scale200}
        >
          <section>
            <Flexgrid alignItems="center" flexGap={spacing.scale200}>
              <Typography>Zeilen pro Seite: </Typography>
              <StyledInput
                defaultValue={rowsPerPage.toString()}
                type="number"
                onChange={_onRowsPerPageChange}
              />
            </Flexgrid>
          </section>
          <section>
            <Flexgrid
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
            </Flexgrid>
          </section>
        </Flexgrid>
      )}
    </>
  );
};

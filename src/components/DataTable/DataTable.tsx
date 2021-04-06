import React, {ChangeEvent} from 'react';
import {Table, Box, Typography, Flexgrid, Spinner, Button} from 'components';
import styled, {useTheme} from 'styled-components';
import {Input} from 'components/Input';

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
}) => {
  const {spacing, colors} = useTheme();

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

  return (
    <>
      <Table>
        <thead>
          <tr>
            {columns.map(({title}, idx) => (
              <th key={idx}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!isLoading &&
            data.map((row, idx) => (
              <tr key={idx} style={getRowStyle(row)}>
                {columns.map((column, idx) => (
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

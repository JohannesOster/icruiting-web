import React from 'react';
import {Table, Box, Typography, Flexgrid, Spinner, Button} from 'components';
import {useTheme} from 'styled-components';

export type TColumn = {
  title: string;
  cell: (row: {[key: string]: any}) => React.ReactNode;
};

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
  getRowStyle = (row) => ({}),
}) => {
  const {spacing} = useTheme();

  const showPagination =
    totalCount !== undefined &&
    totalPages !== undefined &&
    currentPage !== undefined;

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
      {isLoading || !data.length ? (
        <Box display="flex" marginTop={20} justifyContent="center">
          {isLoading ? <Spinner /> : <Typography>{onEmptyMessage}</Typography>}
        </Box>
      ) : (
        showPagination && (
          <Flexgrid
            justifyContent="space-between"
            flexGap={spacing.scale300}
            padding={spacing.scale200}
          >
            <Button
              kind="minimal"
              disabled={currentPage! <= 1}
              onClick={onPrev}
            >
              Vorherige
            </Button>
            <Typography>
              Seite: {currentPage} aus {totalPages}
            </Typography>
            <Typography>
              Zeilen: {(currentPage - 1) * data.length + 1}-
              {currentPage * data.length} aus {totalCount}
            </Typography>
            <Button
              kind="minimal"
              disabled={currentPage! >= totalPages!}
              onClick={onNext}
            >
              Nächste
            </Button>
          </Flexgrid>
        )
      )}
    </>
  );
};

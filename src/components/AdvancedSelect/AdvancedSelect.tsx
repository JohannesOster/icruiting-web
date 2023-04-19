import React, {FC} from 'react';
import {SelectProps} from './types';
import {useTheme} from 'styled-components';
import {Box} from 'components/Box';
import {SelectSymbol} from 'icons';
import {Container, ConentContainer, Label, Select} from './AdvancedSelect.sc';

const AdvancedSelect: FC<SelectProps> = ({
  label,
  description,
  options,
  icon,
  errors = [],
  ...props
}) => {
  const {spacing} = useTheme();

  const getSelectedOption = (options: Array<{label: string; value: string}>, value: string) => {
    let selectedOption = options.find((option) => value === option.value);
    if (selectedOption === undefined) selectedOption = options[0];
    return selectedOption || {value: '', label: ''};
  };

  return (
    <Container>
      <Select {...props}>
        {options.map(({label, value}, idx) => {
          return (
            <option key={idx} value={value}>
              {label}
            </option>
          );
        })}
      </Select>
      <ConentContainer>
        <Box display="flex" gap={spacing.scale200}>
          <Label>
            {icon} {label}
          </Label>
          <span>{getSelectedOption(options, props.value).label}</span>
        </Box>
        <SelectSymbol />
      </ConentContainer>
    </Container>
  );
};

export {AdvancedSelect};

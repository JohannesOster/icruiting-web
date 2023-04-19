import React from 'react';
import {useTheme} from 'styled-components';
import {Box} from 'components/Box';
import {Clear, SelectSymbol} from 'icons';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  border: 1px solid ${({theme}) => theme.colors.inputBorder};
  border-radius: ${({theme}) => theme.borders.radius100};
  background: white;

  overflow: hidden;

  ${({theme}) => theme.typography.bodySmall};
`;

const SelectContainer = styled.div`
  position: relative;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${({theme}) => `${theme.spacing.scale200} ${theme.spacing.scale300}`};
`;

const ConentContainer = styled.div`
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.scale400};
  width: 100%;
  padding: ${({theme}) => `${theme.spacing.scale200} ${theme.spacing.scale300}`};
  background: ${({theme}) => theme.colors.surfaceSubdued};
`;

const Input = styled.input`
  border: none;
  background: none;
  padding-left: ${({theme}) => theme.spacing.scale300};
  padding-right: 0;
  outline: none;
`;

const Select = styled.select`
  ${({theme}) => theme.typography.bodySmall};
  position: absolute;
  top: 0;
  left: 0;
  z-index: 30;
  width: 100%;
  height: 100%;
  opacity: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
`;

const Label = styled.label`
  ${({theme}) => theme.typography.bodySmall};
  color: ${({theme}) => theme.colors.textSubdued};
`;

const Searchbox = () => {
  const {spacing} = useTheme();

  const value = 'option1';

  const options = [
    {label: 'Option 1', value: 'option1'},
    {label: 'Option 2', value: 'option2'},
  ];

  const getSelectedOption = (options: Array<{label: string; value: string}>, value: string) => {
    let selectedOption = options.find((option) => value === option.value);
    if (selectedOption === undefined) selectedOption = options[0];
    return selectedOption || {value: '', label: ''};
  };

  return (
    <Container>
      <SelectContainer>
        <Select>
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
            <span>{getSelectedOption(options, value).label}</span>
          </Box>
          <SelectSymbol />
        </ConentContainer>
      </SelectContainer>
      <Input placeholder="Suchen ..." />

      <IconContainer>
        <Clear />
      </IconContainer>
    </Container>
  );
};

export {Searchbox};

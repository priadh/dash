import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaFilter } from 'react-icons/fa';
import theme from '../../styles/theme';

const FilterContainer = styled.div`
  margin-bottom: ${theme.spacing[6]};
`;

const FilterForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[3]};
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;

  ${theme.mediaQuery.below.md} {
    flex-basis: 100%;
  }
`;

const InputGroup = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: ${theme.spacing[3]};
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.colors.secondary};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[8]};
  border: 1px solid #e2e8f0;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.font.size.md};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[8]};
  border: 1px solid #e2e8f0;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.font.size.md};
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${theme.spacing[3]} center;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
  }
`;

const SubmitButton = styled.button`
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.font.weight.medium};
  cursor: pointer;
  transition: background-color ${theme.transitions.fast};

  &:hover {
    background-color: #0062d6;
  }

  ${theme.mediaQuery.below.md} {
    width: 100%;
  }
`;

const AdvancedFilters = styled.div`
  margin-top: ${theme.spacing[4]};
  padding-top: ${theme.spacing[4]};
  border-top: 1px solid #e2e8f0;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`;

const JobFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    advanced: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters); // Pass the updated filters back to the parent component (JobList)
  };

  return (
    <FilterContainer>
      <FilterForm onSubmit={handleSubmit}>
        <FilterGroup>
          <InputGroup>
            <FaSearch />
            <Input
              type="text"
              name="keyword"
              placeholder="Search by job title"
              value={filters.keyword}
              onChange={handleChange}
            />
          </InputGroup>
        </FilterGroup>

        <FilterGroup>
          <InputGroup>
            <FaMapMarkerAlt />
            <Input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleChange}
            />
          </InputGroup>
        </FilterGroup>

        <FilterGroup>
          <Select
            name="jobType"
            value={filters.jobType}
            onChange={handleChange}
          >
            <option value="">All job types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <SubmitButton type="submit">Apply Filters</SubmitButton>
        </FilterGroup>
      </FilterForm>

      <AdvancedFilters isVisible={filters.advanced}>
        {/* Additional advanced filters can go here */}
      </AdvancedFilters>
    </FilterContainer>
  );
};

export default JobFilter;

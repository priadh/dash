// src/components/postjob/PlanCard.jsx
import React from 'react';
import styled from 'styled-components';

const PlanCardContainer = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  width: 280px;
  margin: 1rem;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const PlanName = styled.h2`
  color: #0070f3;
  font-size: 1.6rem;
  font-weight: bold;
`;

const PlanPrice = styled.p`
  color: #333;
  font-size: 1.4rem;
  font-weight: 500;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  font-size: 1rem;
  text-align: left;
`;

const FeatureItem = styled.li`
  color: #555;
  margin-bottom: 0.5rem;
`;

const SelectButton = styled.button`
  background-color: #0070f3;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 4px;
  margin-top: 1rem;

  &:hover {
    background-color: #0050a0;
  }
`;

const PlanCard = ({ plan, onSelect }) => (
  <PlanCardContainer onClick={() => onSelect(plan)}>
    <PlanName>{plan.name}</PlanName>
    <PlanPrice>${plan.price}</PlanPrice>
    <FeatureList>
      {plan.features.map((feature, idx) => (
        <FeatureItem key={idx}>{feature}</FeatureItem>
      ))}
    </FeatureList>
    <SelectButton>Select Plan</SelectButton>
  </PlanCardContainer>
);

export default PlanCard;

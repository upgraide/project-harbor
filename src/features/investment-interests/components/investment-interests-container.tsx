"use client";

import { EntityContainer } from "@/components/entity-components";
import { InvestmentInterestsHeader } from "./investment-interests-header";

type Props = {
  children: React.ReactNode;
};

export const InvestmentInterestsContainer = ({ children }: Props) => (
  <EntityContainer header={<InvestmentInterestsHeader />}>
    {children}
  </EntityContainer>
);

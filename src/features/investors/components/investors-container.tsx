"use client";

import { EntityContainer } from "@/components/entity-components";
import { InvestorsHeader } from "./investors-header";

type Props = {
  children: React.ReactNode;
};

export const InvestorsContainer = ({ children }: Props) => (
  <EntityContainer header={<InvestorsHeader />}>{children}</EntityContainer>
);

// @flow
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/currencies";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import { useMarketCapSort } from "../../countervalues";

export type DataTypeCryptoCurrency = {
  type: "cryptocurrency",
  default: CryptoCurrency
};

type Props = {
  value: ?CryptoCurrency,
  onChange: (?CryptoCurrency) => void,
  filterFamilies?: string[]
};

const TokenSelect = ({ value, onChange, filterFamilies }: Props) => {
  let currencies = listCryptoCurrencies(true);
  if (filterFamilies) {
    currencies = currencies.filter(c => filterFamilies.includes(c.family));
  }
  currencies = useMarketCapSort(currencies);
  return (
    <Select
      value={value}
      options={currencies}
      onChange={onChange}
      placeholder="Select a crypto currency"
      getOptionLabel={token => `${token.name} (${token.ticker})`}
      getOptionValue={token => token.ticker}
    />
  );
};

export default TokenSelect;

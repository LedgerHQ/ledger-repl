// @flow

import { useEffect, useState } from "react";
import axios from "axios";
import { implementCountervalues } from "@ledgerhq/live-common/lib/countervalues";

implementCountervalues({
  network: axios,
  log: (...args) => console.log(...args), // eslint-disable-line no-console
  getAPIBaseURL: () => "https://countervalues.api.live.ledger.com",
  storeSelector: state => state.countervalues,
  pairsSelector: () => [],
  setExchangePairsAction: () => ({})
});

export const useMarketCapSort = <T: { ticker: string }>(items: T[]): T[] => {
  const [tickers, setTickers] = useState([]);

  useEffect(() => {
    countervalues.fetchTickersByMarketcap().then(setTickers);
  }, []);

  const rank = token => {
    const i = tickers.indexOf(token.ticker);
    if (i === -1) return Infinity;
    return i;
  };

  if (tickers.length === 0) return items;
  return items.slice(0).sort((a, b) => rank(a) - rank(b));
};

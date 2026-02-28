import { Service, BalanceResponse } from "./types";

export const MOCK_SERVICES: Service[] = [
  {
    service: "101",
    name: "Facebook Page Likes [Real & High Quality]",
    type: "Default",
    category: "Facebook Services",
    rate: "1.50",
    min: "100",
    max: "50000",
    dripfeed: false,
    refill: true,
    cancel: false
  },
  {
    service: "102",
    name: "Facebook Post Reactions [Mixed]",
    type: "Default",
    category: "Facebook Services",
    rate: "0.80",
    min: "50",
    max: "100000",
    dripfeed: false,
    refill: false,
    cancel: false
  },
  {
    service: "201",
    name: "Instagram Followers [Instant]",
    type: "Default",
    category: "Instagram Services",
    rate: "2.10",
    min: "100",
    max: "200000",
    dripfeed: false,
    refill: true,
    cancel: true
  },
  {
    service: "202",
    name: "Instagram Likes [Real]",
    type: "Default",
    category: "Instagram Services",
    rate: "0.50",
    min: "50",
    max: "500000",
    dripfeed: false,
    refill: false,
    cancel: false
  },
  {
    service: "301",
    name: "YouTube Views [Non-Drop]",
    type: "Default",
    category: "YouTube Services",
    rate: "3.50",
    min: "500",
    max: "1000000",
    dripfeed: true,
    refill: true,
    cancel: false
  }
];

export const MOCK_BALANCE: BalanceResponse = {
  balance: "500.00",
  currency: "USD"
};

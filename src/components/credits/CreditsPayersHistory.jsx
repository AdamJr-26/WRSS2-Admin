import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/api/useFetch";
import { Icon } from "@iconify/react";
import transformDate from "../../utils/date.toString";
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
} from "@chakra-ui/react";
import ListSkeletonLoading from "../general/ListSkeletonLoading";

function CreditsPayersHistory() {
  // set initial value of current page, total_pages, and limit per page.
  // if current page value is greater then limit then add anohter page to fetch else do not create.
  //
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState();
  const [limitItems, setLimitItems] = useState(5);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const {
    data,
    error,
    mutate: mutatePagination,
    isValidating,
  } = useFetch({
    url: `/api/credits/history/pagination/${limitItems}/${
      limitItems * currentPage - limitItems
    }/${fromDate}/${toDate}`,
  });

  console.log("date", data);
  const onPressnext = () => {
    if (data?.data.length >= limitItems) {
      setCurrentPage(currentPage + 1);
    }
  };
  const onPressPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const onChangeFrom = (value) => {
    setFromDate(value);
  };
  const onChangeTo = (value) => {
    const from_date_unix = Math.floor(new Date(fromDate).valueOf() / 1000);
    if (Math.floor(new Date(value).valueOf() / 1000) > from_date_unix) {
      setToDate(value);
    } else {
      console.log("Select date from 1 day apart.");
    }
  };
  const clearDate = () => {
    setFromDate(null);
    setToDate(null);
  };
  useEffect(() => {
    const from_date_unix = Math.floor(new Date(fromDate).valueOf() / 1000);
    const to_date_unix = Math.floor(new Date(toDate).valueOf() / 1000);
    console.log("to_date_unix", to_date_unix);
    if (to_date_unix > from_date_unix) {
      setCurrentPage(1);
      mutatePagination();
      console.log("mutating.......");
    } else {
    }
  }, [fromDate, toDate]);

  return (
    <div className="transactions-wrapper">
      <div className="transactions-wrapper--header">
        <div>
          <p className="transactions-wrapper--header__title">History</p>
        </div>
        <div className="transactions-wrapper--header__query-dates">
          <div>
            <p>From: </p>
            <input
              type="date"
              value={fromDate ? fromDate : ""}
              onChange={(e) => onChangeFrom(e.target.value)}
            />
          </div>
          <div>
            <p>To: </p>
            <input
              type="date"
              value={toDate ? toDate : ""}
              onChange={(e) => onChangeTo(e.target.value)}
            />
          </div>
        </div>
      </div>
      {fromDate && toDate ? (
        <div className="transactions-wrapper--date-from-results">
          <p>
            You are seeing the result of your selected range of dates.
            <button onClick={() => clearDate()}>Clear</button>
          </p>
        </div>
      ) : null}
      {isValidating ? (
        <ListSkeletonLoading num_lines={limitItems} />
      ) : (
        data?.data.map((credit, index) => (
          <div className="transactions-wrapper--item" key={index}>
            <div className="transactions-wrapper--item__image-wrapper">
              <img src={credit?.customer[0]?.display_photo} alt="" srcSet="" />
            </div>
            <div className="transactions-wrapper--item__person-info">
              <span className="name">
                {credit?.customer[0]?.firstname || ""}{" "}
                {credit?.customer[0]?.lastname || ""}
              </span>
              <span className="address">
                {credit?.customer[0]?.address?.street}{" "}
                {credit?.customer[0]?.address?.barangay}{" "}
                {credit?.customer[0]?.address?.municipal_city}{" "}
                {credit?.customer[0]?.address?.province}
              </span>
              <div className="regular-date-wrapper">
                <span className="role">
                  {credit?.customer[0]?.customer_type}
                </span>
                <span className="date">
                  Date: {transformDate(credit.date.utc_date).string_date}
                </span>
              </div>
            </div>
            <div className="transactions-wrapper--item__amount-buttons">
              <div>
                <p>Count</p>
                <p>{credit?.gallon_count}</p>
              </div>
              <div>
                <p>Paid</p>
                <p>₱ {credit?.amount_paid}</p>
              </div>
            </div>
          </div>
        ))
      )}
      {data?.data.length >= limitItems ? (
        <div className="transactions-wrapper--pagination-buttons">
          {currentPage > 1 ? (
            <div
              onClick={() => onPressPrev()}
              className="transactions-wrapper--pagination-buttons__back"
            >
              <p>
                <Icon icon="ic:sharp-navigate-before" />
              </p>
              <p>
                <Icon icon="ic:sharp-navigate-before" />
              </p>
              <p>Prev</p>
            </div>
          ) : null}
          <p className="transactions-wrapper--pagination-buttons__current-page">
            {currentPage}
          </p>
          {data?.data.length >= limitItems ? (
            <div
              onClick={() => onPressnext()}
              className="transactions-wrapper--pagination-buttons__next"
            >
              <p>Next</p>
              <p>
                <Icon icon="ic:sharp-navigate-next" />
              </p>
              <p>
                <Icon icon="ic:sharp-navigate-next" />
              </p>{" "}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default CreditsPayersHistory;

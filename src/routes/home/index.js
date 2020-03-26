import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { format, isSameDay, isSameWeek } from "date-fns";

import Logo from "../../assets/logo.png";
import Clip from "../../assets/icon_clip.svg";
import Search from "../../assets/icon_search.svg";
import Arrow from "../../assets/icon_arrow01.svg";

import style from "./style";
import { testDb } from "../../api/";

const Home = () => {
  const [emails, setEmails] = useState([]);
  const [sort, setSort] = useState(new Map());

  useEffect(() => {
    setEmails(testDb());
  }, []);

  function handleSort(e) {
    const el = e.srcElement.id;
    if (sort.get(el) === "asc") {
      sort.set(el, "desc");
    } else if (sort.get(el) === "desc") {
      sort.delete(el);
    } else sort.set(el, "asc");
    sortArray();
  }

  function sortArray() {
    let newArr = emails;

    // We must reset to its default, by date
    if (sort.size <= 0) {
      newArr = newArr.sort(
        (a, b) => (b.date === a.date && 0) || (b.date < a.date && -1) || 1
      );
      setEmails([...newArr]);
      return;
    }

    // For each key (in the order or the columns) sort it out
    for (const [key, value] of sort.entries()) {
      const currKey = key.split("-")[0];
      if (value === "desc") {
        newArr = newArr.sort(
          (a, b) =>
            (b[currKey] === a[currKey] && 0) ||
            (b[currKey] < a[currKey] && -1) ||
            1
        );
      } else {
        newArr = newArr.sort(
          (a, b) =>
            (b[currKey] === a[currKey] && 0) ||
            (b[currKey] > a[currKey] && -1) ||
            1
        );
      }
    }
    setEmails([...newArr]);
  }

  return (
    <div class={style.home}>
      <div class={style.searchContainer}>
        <input type="date" />
        <input type="date" />
        <button>
          <img style={{ width: "1em" }} src={Search} alt="Search" />
        </button>
      </div>
      <p>
        Results: <span class={style.counterSpan}>{emails.length}</span> mail(s)
      </p>
      <hr />
      {(emails.length > 0 && (
        <Table emails={emails} handleSort={handleSort} sort={sort} />
      )) || (
        <div class={style.logoContainer}>
          <img src={Logo} alt="Logo" />
        </div>
      )}
    </div>
  );
};

const Table = props => (
  <table>
    <caption style={{ display: "none" }}>Email list</caption>
    <thead>
      <tr>
        <TdHead
          id="from-sort"
          onClick={props.handleSort}
          text="From"
          sorted={props.sort}
        />
        <TdHead
          id="to-sort"
          onClick={props.handleSort}
          text="To"
          sorted={props.sort}
        />
        <TdHead
          id="subject-sort"
          onClick={props.handleSort}
          text="Subject"
          sorted={props.sort}
        />
        <TdHead id="attachments-sort" sorted={props.sort} />
        {/* Attachments */}
        <TdHead
          id="date-sort"
          onClick={props.handleSort}
          text="Date"
          sorted={props.sort}
        />
      </tr>
    </thead>
    <tbody>
      {props.emails.map((email, k) => (
        <Row data={email} key={k} />
      ))}
    </tbody>
  </table>
);

const TdHead = props => {
  const sortedType = props.sorted.get(props.id);
  return (
    <td id={props.id} onClick={props.onClick}>
      {props.text}{" "}
      {sortedType && (
        <img
          style={{
            width: "0.5em",
            transform: sortedType === "desc" && "rotate(180deg)"
          }}
          src={Arrow}
        />
      )}
    </td>
  );
};

const Row = props => {
  let fields = Object.keys(props.data).map(key => {
    let value;
    if (key === "date") {
      const { date } = props.data;
      const formatToday = "hh:mm";
      const formatWeek = "MMM dd";
      const formatElse = "yyyy-MM-dd";

      value = format(
        date,
        (isSameDay(Date.now(), date) && formatToday) ||
          (isSameWeek(Date.now(), date) && formatWeek) ||
          formatElse
      );
    } else if (key === "hasAttachments") {
      value = props.data.hasAttachments && (
        <img src={Clip} style={{ width: "0.75em" }} />
      );
    } else {
      value = props.data[key];
    }
    return <td>{value}</td>;
  });

  return (
    <tr key={props.key} class={style.rowContainer}>
      {fields.map(f => f)}
    </tr>
  );
};

export default Home;

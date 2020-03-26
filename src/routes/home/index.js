import { h } from "preact";
import { format, isSameDay, isSameWeek } from "date-fns";
import { useEffect, useState } from "preact/hooks";

import Logo from "../../assets/logo.png";
import Clip from "../../assets/icon_clip.svg";
import Search from "../../assets/icon_search.svg";
import Arrow from "../../assets/icon_arrow01.svg";

import style from "./style";
import { testDb } from "../../api/";

const Home = () => {
  const [emails, setEmails] = useState([]);
  const [sort] = useState(new Map());

  useEffect(() => {
    setEmails(testDb());
  }, [emails]);

  function handleSort(e) {
    const el = e.srcElement.id;
    if (sort.get(el) === "asc") {
      sort.set(el, "desc");
      return;
    }

    if (sort.get(el) === "desc") {
      sort.delete(el);
      return;
    }

    sort.set(el, "asc");
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
        <table>
          <caption style={{ display: "none" }}>Email list</caption>
          <thead>
            <tr>
              <TdHead
                id="from-sort"
                onClick={handleSort}
                text="From"
                sorted={sort}
              />
              <TdHead
                id="to-sort"
                onClick={handleSort}
                text="To"
                sorted={sort}
              />
              <TdHead
                id="subject-sort"
                onClick={handleSort}
                text="Subject"
                sorted={sort}
              />
              <TdHead id="attachments-sort" sorted={sort} />
              {/* Attachments */}
              <TdHead
                id="date-sort"
                onClick={handleSort}
                text="Date"
                sorted={sort}
              />
            </tr>
          </thead>
          <tbody>
            {emails.map((email, k) => (
              <Row data={email} key={k} />
            ))}
          </tbody>
        </table>
      )) || (
        <div class={style.logoContainer}>
          <img src={Logo} alt="Logo" />
        </div>
      )}
    </div>
  );
};

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

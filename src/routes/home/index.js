import { useEffect, useState } from "preact/hooks";
import {
  format,
  isWithinInterval,
  isSameDay,
  isSameWeek,
  parseISO
} from "date-fns";

import Logo from "../../assets/logo.png";
import Clip from "../../assets/icon_clip.svg";
import Search from "../../assets/icon_search.svg";
import Arrow from "../../assets/icon_arrow01.svg";
import ArrowTo from "../../assets/icon_arrow02.svg";
import MailSP from "../../assets/icon_mail_sp.svg";

import style from "./style";
import { testDb } from "../../api/";

const Home = () => {
  const [emails, setEmails] = useState([]);
  const [sort, setSort] = useState(new Map());
  const [openModal, setOpenModal] = useState(false);
  const [selectedMail, setSelectedMail] = useState({});
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

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

  function handleSearch() {
    setEmails(
      emails.filter(val => {
        return isWithinInterval(val.date, {
          start: parseISO(dateRange.startDate),
          end: parseISO(dateRange.endDate)
        });
      })
    );
  }

  // TODO: Check valid dates!
  function handleDateChange(e) {
    setDateRange(prev =>
      Object.assign({}, prev, { [e.target.name]: e.target.value })
    );
  }

  function handleModal() {
    setOpenModal(!openModal);
  }

  /**
   * FIXME: Must be a workaround to this
   */
  function handleRowClick(e) {
    const { tagName } = e.target;
    let el;
    let obj = {};

    if (tagName === "TD") {
      el = e.target.parentElement;
    } else {
      el = e.target;
    }

    for (const element of el.children) {
      const name = (element.attributes["name"] || {}).value;
      const value = element.innerText;
      if (name) {
        obj = Object.assign({}, obj, { [name]: value });
      }
    }
    setSelectedMail(obj);
    setOpenModal(true);
  }

  return (
    <div class={style.home}>
      <div class={style.searchContainer}>
        <input type="date" name="startDate" onChange={handleDateChange} />
        <input type="date" name="endDate" onChange={handleDateChange} />
        <button onClick={handleSearch}>
          <img style={{ width: "1em" }} src={Search} alt="Search" />
        </button>
      </div>
      <p class={style.results}>
        Results: <span class={style.counterSpan}>{emails.length}</span> mail(s)
      </p>
      <hr />
      {(emails.length > 0 && (
        <Table
          emails={emails}
          handleSort={handleSort}
          sort={sort}
          handleRowClick={handleRowClick}
        />
      )) || (
        <div class={style.logoContainer}>
          <img src={Logo} alt="Logo" />
        </div>
      )}
      <Modal data={selectedMail} isOpen={openModal} handleClick={handleModal} />
    </div>
  );
};

const Modal = props => (
  <div
    class={style.modal}
    style={{ display: props.isOpen ? "flex" : "none" }}
    onClick={props.handleClick}
  >
    <div class={style.modal_content}>
      <header>
        <h1
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {props.data.subject}
        </h1>
        <div style={{ display: "flex", justifyContent: "stretch" }}>
          <h2 style={{ flex: 1 }}>From: {props.data.from}</h2>
          <p style={{ flex: 1, alignSelf: "center", textAlign: "right" }}>
            Date: {props.data.date}
          </p>
        </div>
      </header>
      <main>
        <p>Here goes the content...</p>
      </main>
    </div>
  </div>
);

const Table = props => {
  return (
    <table>
      <caption style={{ display: "none" }}>Email list</caption>
      <thead>
        <tr class={style.headerDesktop}>
          <TdHead id="image-sort" sorted={props.sort} />
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
          <TdHead id="mailchain-sort" sorted={props.sort} />
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
          <TdHead id="arrow-sort" sorted={props.sort} />
        </tr>
      </thead>
      <tbody>
        {props.emails.map((email, k) => (
          <Row data={email} key={k} handleClick={props.handleRowClick} />
        ))}
      </tbody>
    </table>
  );
};

const TdHead = props => {
  const sortedType = props.sorted.get(props.id);
  return (
    <td
      id={props.id}
      onClick={props.onClick}
      class={sortedType && style.isSorted}
    >
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
    } else if (key === "to") {
      value = props.data.to.join(", ");
    } else if (key === "mailchain") {
      if (props.data.mailchain > 0)
        value = (
          <span
            class={style.td_mailchain_content}
          >{`+${props.data[key]}`}</span>
        );
      else value = null;
    } else {
      value = props.data[key];
    }
    return (
      <td name={key} class={style[`td_${key}`]}>
        {value}
      </td>
    );
  });

  return (
    <tr key={props.key} class={style.rowContainer} onClick={props.handleClick}>
      <img
        class={style.td_image}
        src={MailSP}
        alt="mail"
        style={{ width: "1em" }}
      />
      {fields.map(f => f)}
      <div class={style.td_arrow}>
        <img src={ArrowTo} alt=">" style={{ width: "0.25em" }} />
      </div>
    </tr>
  );
};

export default Home;

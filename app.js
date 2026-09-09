let json = [
  {
    id: 1,
    title: "Read 10 pages",
    category: "Reading",
    days: [true, true, false, false, false, false, false],
  },
  {
    id: 2,
    title: "Practise JavaScript",
    category: "Coding",
    days: [true, false, true, false, false, false, false],
  },
  {
    id: 3,
    title: "Review vocabulary",
    category: "Language",
    days: [false, true, false, false, false, false, false],
  },
  {
    id: 4,
    title: "Solve one exercise",
    category: "Coding",
    days: [true, true, true, false, false, false, false],
  },
  {
    id: 5,
    title: "Write a summary",
    category: "Writing",
    days: [false, false, false, false, false, false, false],
  },
];
const HABITS = json;

const CARD = document.querySelector(".card");
const TABLE = document.querySelector("table");

const TITLE_INPUT = CARD.querySelector('input[type="text"]');
const CATEGORY_SELECT = CARD.querySelector("select");
const SEARCH_INPUT = CARD.querySelector('input[placeholder="Search..."]');

const BUTTONS = CARD.querySelectorAll("button");
const ADD_BUTTON = BUTTONS[0];

const SUMMARY = CARD.querySelectorAll("p");
const COMPLETED_TEXT = SUMMARY[0];
const PROGRESS_TEXT = SUMMARY[1];

let SEARCH_TEXT = "";

/* =========================
   COMPLETED CELLS
========================= */

function GET_COMPLETED_CELLS() {
  let COUNT = 0;

  HABITS.forEach(function (HABIT) {
    HABIT.days.forEach(function (DAY) {
      if (DAY === true) {
        COUNT = COUNT + 1;
      }
    });
  });

  return COUNT;
}

/* =========================
   PROGRESS PERCENT
========================= */

function GET_PERCENT() {
  if (HABITS.length === 0) {
    return 0;
  }

  const TOTAL = HABITS.length * 7;
  const COMPLETED = GET_COMPLETED_CELLS();

  return Math.round((COMPLETED / TOTAL) * 100);
}

/* =========================
   UPDATE SUMMARY
========================= */

function UPDATE_SUMMARY() {
  const COMPLETED = GET_COMPLETED_CELLS();
  const TOTAL = HABITS.length * 7;
  const PERCENT = GET_PERCENT();

  COMPLETED_TEXT.textContent = "Completed Cells: " + COMPLETED + " / " + TOTAL;

  PROGRESS_TEXT.textContent = "Progress: " + PERCENT + "%";
}

/* =========================
   COUNT DAYS
========================= */

function COUNT_DAYS(DAYS) {
  let COUNT = 0;

  DAYS.forEach(function (DAY) {
    if (DAY === true) {
      COUNT = COUNT + 1;
    }
  });

  return COUNT;
}

/* =========================
   NEXT ID
========================= */

function GET_NEXT_ID() {
  let MAX_ID = 0;

  HABITS.forEach(function (HABIT) {
    if (HABIT.id > MAX_ID) {
      MAX_ID = HABIT.id;
    }
  });

  return MAX_ID + 1;
}

/* =========================
   RENDER
========================= */

function RENDER_HABITS() {
  const ROWS = TABLE.querySelectorAll("tr");

  ROWS.forEach(function (ROW, INDEX) {
    if (INDEX > 0) {
      ROW.remove();
    }
  });

  const FILTERED_HABITS = HABITS.filter(function (HABIT) {
    return HABIT.title.toLowerCase().includes(SEARCH_TEXT.toLowerCase());
  });

  FILTERED_HABITS.forEach(function (HABIT) {
    const ROW = document.createElement("tr");

    /* TITLE */

    const TITLE_CELL = document.createElement("td");

    TITLE_CELL.textContent = HABIT.title;

    ROW.appendChild(TITLE_CELL);

    /* CATEGORY */

    const CATEGORY_CELL = document.createElement("td");

    CATEGORY_CELL.textContent = HABIT.category;

    ROW.appendChild(CATEGORY_CELL);

    /* DAYS */

    HABIT.days.forEach(function (DAY, INDEX) {
      const DAY_CELL = document.createElement("td");

      const CHECKBOX = document.createElement("input");

      CHECKBOX.type = "checkbox";
      CHECKBOX.checked = DAY;

      CHECKBOX.addEventListener("change", function () {
        HABIT.days[INDEX] = CHECKBOX.checked;

        RENDER_HABITS();
        UPDATE_SUMMARY();
      });

      DAY_CELL.appendChild(CHECKBOX);

      ROW.appendChild(DAY_CELL);
    });

    /* COMPLETED DAYS */

    const COMPLETED_CELL = document.createElement("td");

    COMPLETED_CELL.textContent = COUNT_DAYS(HABIT.days) + " / 7";

    ROW.appendChild(COMPLETED_CELL);

    /* DELETE */

    const ACTION_CELL = document.createElement("td");

    const DELETE_BUTTON = document.createElement("button");

    DELETE_BUTTON.textContent = "Delete";

    DELETE_BUTTON.classList.add("btn");

    DELETE_BUTTON.addEventListener("click", function () {
      const INDEX = HABITS.findIndex(function (ITEM) {
        return ITEM.id === HABIT.id;
      });

      if (INDEX !== -1) {
        HABITS.splice(INDEX, 1);
      }

      RENDER_HABITS();
      UPDATE_SUMMARY();
    });

    ACTION_CELL.appendChild(DELETE_BUTTON);

    ROW.appendChild(ACTION_CELL);

    TABLE.appendChild(ROW);
  });
}

/* =========================
   ADD HABIT
========================= */

ADD_BUTTON.addEventListener("click", function () {
  const TITLE = TITLE_INPUT.value.trim();
  const CATEGORY = CATEGORY_SELECT.value;

  if (TITLE.length < 3 || TITLE.length > 80) {
    alert("Title must be between 3 and 80 characters.");

    return;
  }

  const NEW_HABIT = {
    id: GET_NEXT_ID(),

    title: TITLE,

    category: CATEGORY,

    days: [false, false, false, false, false, false, false],
  };

  HABITS.push(NEW_HABIT);

  TITLE_INPUT.value = "";

  RENDER_HABITS();
  UPDATE_SUMMARY();
});

/* =========================
   SEARCH
========================= */

SEARCH_INPUT.addEventListener("input", function () {
  SEARCH_TEXT = SEARCH_INPUT.value;

  RENDER_HABITS();
});

/* =========================
   START
========================= */

RENDER_HABITS();

UPDATE_SUMMARY();

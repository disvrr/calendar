const monthNames = [
  "Январь","Февраль","Март","Апрель","Май","Июнь",
  "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"
];

const weekDays = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
const year = new Date().getFullYear();
const today = new Date();
const container = document.getElementById("calendarContainer");

const dates = [];

const fioList = ['Ивахненко С.Н.', 'Заиченко А.', 'Загребельный С.'];

const fioColors = {};

function getRandomColor() {
  const r = Math.floor(Math.random() * 256); // 0-255
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

fioList.forEach(fio => {
  fioColors[fio] = getRandomColor();
});

function pad(n) {
  return n < 10 ? '0' + n : n;
}

for (let month = 0; month < 12; month++) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
    dates.push(dateStr);
  }
}


for (let month = 0; month < 12; month++) {
  const div = document.createElement("div");
  div.className = "month";

  const title = document.createElement("h3");
  title.textContent = `${monthNames[month]} ${year}`;
  div.appendChild(title);

  const table = document.createElement("table");
  const head = table.insertRow();
  for (const d of weekDays) {
    const th = document.createElement("th");
    th.textContent = d;
    head.appendChild(th);
  }

  // чтобы понедельник был первым
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let day = 1;
  for (let i = 0; i < 6; i++) {
    const row = table.insertRow();
    for (let j = 0; j < 7; j++) {
      const cell = row.insertCell();
      if (i === 0 && j < firstDay) continue;
      if (day > daysInMonth) break;

      cell.textContent = day;

      
      cell.dataset.date = `${year}-${pad(month + 1)}-${pad(day)}`;

      // выделяем сегодняшнюю дату
      if (
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) {
        cell.classList.add("today");
      }

      day++;

    }
    if (day > daysInMonth) break;
  }

  div.appendChild(table);
  container.appendChild(div);
}

const tableBody = document.getElementById('table-body');

const activeRanges = JSON.parse(localStorage.getItem('activeRanges') || '[]');


  
function createRow() {
  const tr = document.createElement('tr');

  const tdFio = document.createElement('td');
  tdFio.appendChild(createSelect(fioList));
  tr.appendChild(tdFio);

  const tdStart = document.createElement('td');
  tdStart.appendChild(createSelect(dates));
  tr.appendChild(tdStart);

  const tdEnd = document.createElement('td');
  tdEnd.appendChild(createSelect(dates));
  tr.appendChild(tdEnd);

const tdColor = document.createElement('td');
const colorBox = document.createElement('div');
colorBox.classList.add('color-box');
  tdColor.appendChild(colorBox);
  tr.appendChild(tdColor);


  return tr;
}

function createSelect(options) {
  const select = document.createElement('select');
  for (const optionText of options) {
    const option = document.createElement('option');
    option.value = optionText;
    option.textContent = optionText;
    select.appendChild(option);
  }
  return select;
}









function attachHighlighting(row) {
  const FioSelect = row.children[0].querySelector('select');
  const startSelect = row.children[1].querySelector('select');
  const endSelect = row.children[2].querySelector('select');
  const colorBox = row.children[3].querySelector('.color-box');
  

  function updateHighlight() {
    const FIO = FioSelect.value;
    const startDate = startSelect.value;
    const endDate = endSelect.value;

    colorBox.style.backgroundColor = fioColors[FIO];

    const index = activeRanges.findIndex(r => r.row === row);
    if (index !== -1) activeRanges.splice(index, 1);

    // Добавляем новый диапазон
    if (startDate && endDate) {
      activeRanges.push({ row, FIO, startDate, endDate });
    }

    // Перерисовываем подсветку всех диапазонов
    highlightRange();
  }

  FioSelect.addEventListener('change', updateHighlight);
  startSelect.addEventListener('change', updateHighlight);
  endSelect.addEventListener('change', updateHighlight);

  colorBox.style.backgroundColor = FioSelect.value ? fioColors[FioSelect.value] : '';

}

function highlightRange(){
  //clear
 document.querySelectorAll('#calendarContainer td').forEach(td => {
    td.style.backgroundColor = '';
  });
    activeRanges.forEach(({ FIO, startDate, endDate }) => {
      const color = fioColors[FIO];


    document.querySelectorAll('#calendarContainer td').forEach(td => {
    const date = td.dataset.date;
      if (date >= startDate && date <= endDate) {
        td.style.backgroundColor = color;
    }
  });
});
}
fioList.forEach(() => {
  const newRow = createRow();
  tableBody.appendChild(newRow);
  attachHighlighting(newRow);
});

const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

// Настройки времени работы
// Можно менять прямо здесь
const OPEN_TIME = process.env.OPEN_TIME || "10:30";
const CLOSE_TIME = process.env.CLOSE_TIME || "21:00";

// Часовой пояс Ижевска
const TIME_ZONE = "Europe/Samara";

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getIzhevskTimeParts() {
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  const parts = formatter.formatToParts(new Date());

  const hour = Number(parts.find((part) => part.type === "hour").value);
  const minute = Number(parts.find((part) => part.type === "minute").value);

  return { hour, minute };
}

function checkIsOpen() {
  const { hour, minute } = getIzhevskTimeParts();

  const currentMinutes = hour * 60 + minute;
  const openMinutes = timeToMinutes(OPEN_TIME);
  const closeMinutes = timeToMinutes(CLOSE_TIME);

  // Открыто с OPEN_TIME включительно и до CLOSE_TIME не включительно
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

app.get("/", (req, res) => {
  res.json({
    message: "API работает. Используйте /working-hours"
  });
});

app.get("/working-hours", (req, res) => {
  const isOpen = checkIsOpen();

  res.json({
    is_open: isOpen,
    message: isOpen
      ? "Заказы принимаются"
      : `Заказы принимаются с ${OPEN_TIME} до ${CLOSE_TIME}`,
    status: isOpen ? "open" : "closed",
    timezone: "Ижевск",
    working_hours: `${OPEN_TIME}-${CLOSE_TIME}`
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
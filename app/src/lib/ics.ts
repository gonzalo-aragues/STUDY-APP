// Builds an iCalendar (.ics) file with the exams, to import them into the phone's calendar.
export interface IcsExam {
  uid: string;
  titulo: string;
  fecha: string; // YYYY-MM-DD
  hora?: string; // HH:MM (local time)
  lugar?: string;
  notas?: string;
}

function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
}

function nextDay(fecha: string): string {
  const [y, m, d] = fecha.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + 1));
  return dt.toISOString().slice(0, 10).replace(/-/g, '');
}

/** Lines longer than 75 octets must be folded (RFC 5545); we fold at 70 chars to be safe. */
function fold(line: string): string {
  const out: string[] = [];
  for (let i = 0; i < line.length; i += 70) out.push((i ? ' ' : '') + line.slice(i, i + 70));
  return out.join('\r\n');
}

export function buildIcs(exams: IcsExam[], stamp = new Date()): string {
  const dtstamp = stamp.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Estudio//Examenes//ES', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Exámenes'];
  for (const e of exams) {
    const day = e.fecha.replace(/-/g, '');
    lines.push('BEGIN:VEVENT', `UID:${e.uid}@estudio`, `DTSTAMP:${dtstamp}`);
    if (e.hora) {
      const [hh, mm] = e.hora.split(':');
      const end = String(Math.min(23, Number(hh) + 3)).padStart(2, '0');
      lines.push(`DTSTART:${day}T${hh}${mm}00`, `DTEND:${day}T${end}${mm}00`);
    } else {
      lines.push(`DTSTART;VALUE=DATE:${day}`, `DTEND;VALUE=DATE:${nextDay(e.fecha)}`);
    }
    lines.push(`SUMMARY:${esc(e.titulo)}`);
    if (e.lugar) lines.push(`LOCATION:${esc(e.lugar)}`);
    if (e.notas) lines.push(`DESCRIPTION:${esc(e.notas)}`);
    // Reminder the day before at the same time.
    lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(`Mañana: ${e.titulo}`)}`, 'TRIGGER:-P1D', 'END:VALARM', 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}

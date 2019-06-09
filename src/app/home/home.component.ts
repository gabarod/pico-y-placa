import { Component, OnInit } from '@angular/core';
import { RestrictionSchedule } from '../models/restriction-schedule';
import { RestrictionDay } from '../models/restriction-day';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  schedules: Array<RestrictionSchedule>;
  days: Array<RestrictionDay>;

  licensePlate: string;
  currentDate: Date;

  visibleSidebar: boolean;
  alertMessage: string;

  es: any;
  isAlert: boolean;
  foundRange: RestrictionSchedule;

  messageOk = 'Está autorizado a transitar sin problemas';
  messageValidate = 'Por favor ingrese una placa vehicular válida.';

  constructor() {
    this.initDays();
    this.initSchedules();
    this.initDate();
    this.initSpanishLocale();
    this.initLicensePlate();
  }

  ngOnInit() {
  }

  enableSideBar(message?: string) {
    if (message) { this.alertMessage = message; this.isAlert = true; }
    this.visibleSidebar = true;
  }

  initSpanishLocale() {
    this.es = {
      // date
      closeText: 'Cerrar',
      prevText: '<Ant',
      nextText: 'Sig>',
      currentText: 'Hoy',
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun',
        'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      weekHeader: 'Sm',
      dateFormat: 'dd/mm/yy',
      firstDay: 1,
      isRTL: false,
      showMonthAfterYear: false,
      yearSuffix: '',

      // time
      timeOnlyTitle: 'Elegir una hora',
      timeText: 'Hora',
      hourText: 'Horas',
      minuteText: 'Minutos',
      secondText: 'Segundos',
      millisecText: 'Milisegundos',
      microsecText: 'Microsegundos',
      timezoneText: 'Uso horario',
      timeFormat: 'HH:mm',
      timeSuffix: '',
      amNames: ['a.m.', 'AM', 'A'],
      pmNames: ['p.m.', 'PM', 'P'],
    };
  }

  isInRange(value, range) {
    let start = range[0].split(':');
    let end = range[1].split(':');

    let date = value.split(':');

    date = +(date[0] * 60 + date[1]);

    start = +(start[0] * 60 + start[1]);
    end = +(end[0] * 60 + end[1]);


    const result = (date >= start && date <= end);
    return result;
  }

  initDays() {
    this.days = new Array<RestrictionDay>();

    let day: RestrictionDay;

    // Monday
    day = new RestrictionDay();
    day.name = 'Lunes';
    day.numberDay = 1;
    day.restrictionLastDigit = [1, 2];

    this.days.push(day);

    // Tuesday
    day = new RestrictionDay();
    day.name = 'Martes';
    day.numberDay = 2;
    day.restrictionLastDigit = [3, 4];

    this.days.push(day);

    // Wednesday
    day = new RestrictionDay();
    day.name = 'Miércoles';
    day.numberDay = 3;
    day.restrictionLastDigit = [5, 6];

    this.days.push(day);

    // Thursday
    day = new RestrictionDay();
    day.name = 'Jueves';
    day.numberDay = 4;
    day.restrictionLastDigit = [7, 8];

    this.days.push(day);

    // Friday
    day = new RestrictionDay();
    day.name = 'Viernes';
    day.numberDay = 5;
    day.restrictionLastDigit = [9, 0];

    this.days.push(day);

    // Saturday
    day = new RestrictionDay();
    day.name = 'Sábado';
    day.numberDay = 6;
    day.restrictionLastDigit = [];

    this.days.push(day);

    // Sunday
    day = new RestrictionDay();
    day.name = 'Domingo';
    day.numberDay = 0;
    day.restrictionLastDigit = [];

    this.days.push(day);
  }

  initSchedules() {
    this.schedules = new Array<RestrictionSchedule>();

    // Morning schedule
    let morning: RestrictionSchedule;
    morning = new RestrictionSchedule();
    morning.description = 'Mañana';
    morning.startHour = '7:00';
    morning.endHour = '9:30';

    // Afternoon schedule
    let afternoon: RestrictionSchedule;
    afternoon = new RestrictionSchedule();
    afternoon.description = 'Tarde';
    afternoon.startHour = '16:00';
    afternoon.endHour = '19:30';

    this.schedules.push(morning);
    this.schedules.push(afternoon);
  }

  initDate() {
    this.currentDate = new Date();
  }

  initLicensePlate() {
    this.licensePlate = '';
  }

  getDate() {
    this.currentDate.getUTCDate();
  }

  checkLicensePlate() {
    this.clearAlerts();
    if (!this.licensePlate) {
      this.enableSideBar(this.messageValidate);
      return;
    }
    const day = this.currentDate.getDay();
    const currentHour = this.currentDate.getHours() + ':' + this.currentDate.getMinutes();

    const isInDay = this.days.find(x => x.numberDay === day);

    if (!isInDay) { this.enableSideBar(this.messageOk); return; }

    if (isInDay.restrictionLastDigit.length === 0) { this.enableSideBar(this.messageOk); return; }

    const lastDigit = this.licensePlate.slice(this.licensePlate.length - 1);

    const isDayApply = isInDay.restrictionLastDigit.includes(+lastDigit);

    if (!isDayApply) { this.enableSideBar(this.messageOk); return; }

    this.foundRange = this.schedules.find(x => this.isInRange(currentHour, [x.startHour, x.endHour]));
    console.dir(this.foundRange);
    if (this.foundRange) {
      this.enableSideBar();
    } else {
      this.enableSideBar(this.messageOk);
    }
    this.enableSideBar();
  }

  clearAlerts() {
    this.visibleSidebar = false;
    this.isAlert = false;
    this.foundRange = null;
  }

}

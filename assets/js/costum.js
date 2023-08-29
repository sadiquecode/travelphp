setTimeout(function () {
  $(".hide_loading").fadeOut(10);
  $(".ShowSearchBox").fadeIn(250);
}, 2000);

// bottom button
$(document).ready(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $("#scrollToTopBtn").fadeIn();
    } else {
      $("#scrollToTopBtn").fadeOut();
    }
  });
  $("#scrollToTopBtn").click(function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
  });
});
/*! =========================================================
 * bootstrap datepicker
 * ========================================================= */
!(function ($) {
  var Datepicker = function (element, options) {
    this.element = $(element);
    this.format = DPGlobal.parseFormat(
      options.format || this.element.data("date-format") || "mm/dd/yyyy"
    );
    this.picker = $(DPGlobal.template)
      .appendTo("body")
      .on({ click: $.proxy(this.click, this) });
    this.isInput = this.element.is("input");
    this.component = this.element.is(".date")
      ? this.element.find(".add-on")
      : !1;
    if (this.isInput) {
      this.element.on({
        focus: $.proxy(this.show, this),
        keyup: $.proxy(this.update, this),
      });
    } else {
      if (this.component) {
        this.component.on("click", $.proxy(this.show, this));
      } else {
        this.element.on("click", $.proxy(this.show, this));
      }
    }
    this.minViewMode =
      options.minViewMode || this.element.data("date-minviewmode") || 0;
    if (typeof this.minViewMode === "string") {
      switch (this.minViewMode) {
        case "months":
          this.minViewMode = 1;
          break;
        case "years":
          this.minViewMode = 2;
          break;
        default:
          this.minViewMode = 0;
          break;
      }
    }
    this.viewMode = options.viewMode || this.element.data("date-viewmode") || 0;
    if (typeof this.viewMode === "string") {
      switch (this.viewMode) {
        case "months":
          this.viewMode = 1;
          break;
        case "years":
          this.viewMode = 2;
          break;
        default:
          this.viewMode = 0;
          break;
      }
    }
    this.startViewMode = this.viewMode;
    this.weekStart =
      options.weekStart || this.element.data("date-weekstart") || 0;
    this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
    this.onRender = options.onRender;
    this.fillDow();
    this.fillMonths();
    this.update();
    this.showMode();
  };
  Datepicker.prototype = {
    constructor: Datepicker,
    show: function (e) {
      this.picker.show();
      this.height = this.component
        ? this.component.outerHeight()
        : this.element.outerHeight();
      this.place();
      $(window).on("resize", $.proxy(this.place, this));
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (!this.isInput) {
      }
      var that = this;
      $(document).on("mousedown", function (ev) {
        if ($(ev.target).closest(".datepicker").length == 0) {
          that.hide();
        }
      });
      this.element.trigger({ type: "show", date: this.date });
    },
    hide: function () {
      this.picker.hide();
      $(window).off("resize", this.place);
      this.viewMode = this.startViewMode;
      this.showMode();
      if (!this.isInput) {
        $(document).off("mousedown", this.hide);
      }
      this.element.trigger({ type: "hide", date: this.date });
    },
    set: function () {
      var formated = DPGlobal.formatDate(this.date, this.format);
      if (!this.isInput) {
        if (this.component) {
          this.element.find("input").prop("value", formated);
        }
        this.element.data("date", formated);
      } else {
        this.element.prop("value", formated);
      }
    },
    setValue: function (newDate) {
      if (typeof newDate === "string") {
        this.date = DPGlobal.parseDate(newDate, this.format);
      } else {
        this.date = new Date(newDate);
      }
      this.set();
      this.viewDate = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        1,
        0,
        0,
        0,
        0
      );
      this.fill();
    },
    place: function () {
      var offset = this.component
        ? this.component.offset()
        : this.element.offset();
      this.picker.css({ top: offset.top + this.height, left: offset.left });
    },
    update: function (newDate) {
      this.date = DPGlobal.parseDate(
        typeof newDate === "string"
          ? newDate
          : this.isInput
          ? this.element.prop("value")
          : this.element.data("date"),
        this.format
      );
      this.viewDate = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        1,
        0,
        0,
        0,
        0
      );
      this.fill();
    },
    fillDow: function () {
      var dowCnt = this.weekStart;
      var html = "<tr>";
      while (dowCnt < this.weekStart + 7) {
        html +=
          '<th class="dow">' + DPGlobal.dates.daysMin[dowCnt++ % 7] + "</th>";
      }
      html += "</tr>";
      this.picker.find(".datepicker-days thead").append(html);
    },
    fillMonths: function () {
      var html = "";
      var i = 0;
      while (i < 12) {
        html +=
          '<span class="month">' + DPGlobal.dates.monthsShort[i++] + "</span>";
      }
      this.picker.find(".datepicker-months td").append(html);
    },
    fill: function () {
      var d = new Date(this.viewDate),
        year = d.getFullYear(),
        month = d.getMonth(),
        currentDate = this.date.valueOf();
      this.picker
        .find(".datepicker-days th:eq(1)")
        .text(DPGlobal.dates.months[month] + " " + year);
      var prevMonth = new Date(year, month - 1, 28, 0, 0, 0, 0),
        day = DPGlobal.getDaysInMonth(
          prevMonth.getFullYear(),
          prevMonth.getMonth()
        );
      prevMonth.setDate(day);
      prevMonth.setDate(day - ((prevMonth.getDay() - this.weekStart + 7) % 7));
      var nextMonth = new Date(prevMonth);
      nextMonth.setDate(nextMonth.getDate() + 42);
      nextMonth = nextMonth.valueOf();
      var html = [];
      var clsName, prevY, prevM;
      while (prevMonth.valueOf() < nextMonth) {
        if (prevMonth.getDay() === this.weekStart) {
          html.push("<tr>");
        }
        clsName = this.onRender(prevMonth);
        prevY = prevMonth.getFullYear();
        prevM = prevMonth.getMonth();
        if ((prevM < month && prevY === year) || prevY < year) {
          clsName += " old";
        } else if ((prevM > month && prevY === year) || prevY > year) {
          clsName += " new";
        }
        if (prevMonth.valueOf() === currentDate) {
          clsName += " active";
        }
        html.push(
          '<td class="day ' + clsName + '">' + prevMonth.getDate() + "</td>"
        );
        if (prevMonth.getDay() === this.weekEnd) {
          html.push("</tr>");
        }
        prevMonth.setDate(prevMonth.getDate() + 1);
      }
      this.picker.find(".datepicker-days tbody").empty().append(html.join(""));
      var currentYear = this.date.getFullYear();
      var months = this.picker
        .find(".datepicker-months")
        .find("th:eq(1)")
        .text(year)
        .end()
        .find("span")
        .removeClass("active");
      if (currentYear === year) {
        months.eq(this.date.getMonth()).addClass("active");
      }
      html = "";
      year = parseInt(year / 10, 10) * 10;
      var yearCont = this.picker
        .find(".datepicker-years")
        .find("th:eq(1)")
        .text(year + "-" + (year + 9))
        .end()
        .find("td");
      year -= 1;
      for (var i = -1; i < 11; i++) {
        html +=
          '<span class="year' +
          (i === -1 || i === 10 ? " old" : "") +
          (currentYear === year ? " active" : "") +
          '">' +
          year +
          "</span>";
        year += 1;
      }
      yearCont.html(html);
    },
    click: function (e) {
      e.stopPropagation();
      e.preventDefault();
      var target = $(e.target).closest("span, td, th");
      if (target.length === 1) {
        switch (target[0].nodeName.toLowerCase()) {
          case "th":
            switch (target[0].className) {
              case "switch":
                this.showMode(1);
                break;
              case "prev":
              case "next":
                this.viewDate[
                  "set" + DPGlobal.modes[this.viewMode].navFnc
                ].call(
                  this.viewDate,
                  this.viewDate[
                    "get" + DPGlobal.modes[this.viewMode].navFnc
                  ].call(this.viewDate) +
                    DPGlobal.modes[this.viewMode].navStep *
                      (target[0].className === "prev" ? -1 : 1)
                );
                this.fill();
                this.set();
                break;
            }
            break;
          case "span":
            if (target.is(".month")) {
              var month = target.parent().find("span").index(target);
              this.viewDate.setMonth(month);
            } else {
              var year = parseInt(target.text(), 10) || 0;
              this.viewDate.setFullYear(year);
            }
            if (this.viewMode !== 0) {
              this.date = new Date(this.viewDate);
              this.element.trigger({
                type: "changeDate",
                date: this.date,
                viewMode: DPGlobal.modes[this.viewMode].clsName,
              });
            }
            this.showMode(-1);
            this.fill();
            this.set();
            break;
          case "td":
            if (target.is(".day") && !target.is(".disabled")) {
              var day = parseInt(target.text(), 10) || 1;
              var month = this.viewDate.getMonth();
              if (target.is(".old")) {
                month -= 1;
              } else if (target.is(".new")) {
                month += 1;
              }
              var year = this.viewDate.getFullYear();
              this.date = new Date(year, month, day, 0, 0, 0, 0);
              this.viewDate = new Date(
                year,
                month,
                Math.min(28, day),
                0,
                0,
                0,
                0
              );
              this.fill();
              this.set();
              this.element.trigger({
                type: "changeDate",
                date: this.date,
                viewMode: DPGlobal.modes[this.viewMode].clsName,
              });
            }
            break;
        }
      }
    },
    mousedown: function (e) {
      e.stopPropagation();
      e.preventDefault();
    },
    showMode: function (dir) {
      if (dir) {
        this.viewMode = Math.max(
          this.minViewMode,
          Math.min(2, this.viewMode + dir)
        );
      }
      this.picker
        .find(">div")
        .hide()
        .filter(".datepicker-" + DPGlobal.modes[this.viewMode].clsName)
        .show();
    },
  };
  $.fn.datepicker = function (option, val) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data("datepicker"),
        options = typeof option === "object" && option;
      if (!data) {
        $this.data(
          "datepicker",
          (data = new Datepicker(
            this,
            $.extend({}, $.fn.datepicker.defaults, options)
          ))
        );
      }
      if (typeof option === "string") data[option](val);
    });
  };
  $.fn.datepicker.defaults = {
    onRender: function (date) {
      return "";
    },
  };
  $.fn.datepicker.Constructor = Datepicker;
  var DPGlobal = {
    modes: [
      { clsName: "days", navFnc: "Month", navStep: 1 },
      { clsName: "months", navFnc: "FullYear", navStep: 1 },
      { clsName: "years", navFnc: "FullYear", navStep: 10 },
    ],
    dates: {
      days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      monthsShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    isLeapYear: function (year) {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    },
    getDaysInMonth: function (year, month) {
      return [
        31,
        DPGlobal.isLeapYear(year) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
      ][month];
    },
    parseFormat: function (format) {
      var separator = format.match(/[.\/\-\s].*?/),
        parts = format.split(/\W+/);
      if (!separator || !parts || parts.length === 0) {
        throw new Error("Invalid date format.");
      }
      return { separator: separator, parts: parts };
    },
    parseDate: function (date, format) {
      var parts = date.split(format.separator),
        date = new Date(),
        val;
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      if (parts.length === format.parts.length) {
        var year = date.getFullYear(),
          day = date.getDate(),
          month = date.getMonth();
        for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
          val = parseInt(parts[i], 10) || 1;
          switch (format.parts[i]) {
            case "dd":
            case "d":
              day = val;
              date.setDate(val);
              break;
            case "mm":
            case "m":
              month = val - 1;
              date.setMonth(val - 1);
              break;
            case "yy":
              year = 2000 + val;
              date.setFullYear(2000 + val);
              break;
            case "yyyy":
              year = val;
              date.setFullYear(val);
              break;
          }
        }
        date = new Date(year, month, day, 0, 0, 0);
      }
      return date;
    },
    formatDate: function (date, format) {
      var val = {
        d: date.getDate(),
        m: date.getMonth() + 1,
        yy: date.getFullYear().toString().substring(2),
        yyyy: date.getFullYear(),
      };
      val.dd = (val.d < 10 ? "0" : "") + val.d;
      val.mm = (val.m < 10 ? "0" : "") + val.m;
      var date = [];
      for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
        date.push(val[format.parts[i]]);
      }
      return date.join(format.separator);
    },
    headTemplate:
      "<thead>" +
      "<tr>" +
      '<th class="prev"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></th>' +
      '<th colspan="5" class="switch"></th>' +
      '<th class="next"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></th>' +
      "</tr>" +
      "</thead>",
    contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
  };
  DPGlobal.template =
    '<div class="datepicker dropdown-menu">' +
    '<div class="datepicker-days">' +
    '<table class=" table-condensed">' +
    DPGlobal.headTemplate +
    "<tbody></tbody>" +
    "</table>" +
    "</div>" +
    '<div class="datepicker-months">' +
    '<table class="table-condensed">' +
    DPGlobal.headTemplate +
    DPGlobal.contTemplate +
    "</table>" +
    "</div>" +
    '<div class="datepicker-years">' +
    '<table class="table-condensed">' +
    DPGlobal.headTemplate +
    DPGlobal.contTemplate +
    "</table>" +
    "</div>" +
    "</div>";
})(window.jQuery);

// hotels datepicker
var nowTemp = new Date();
var now = new Date(
  nowTemp.getFullYear(),
  nowTemp.getMonth(),
  nowTemp.getDate(),
  0,
  0,
  0,
  0
);
var checkin = $(".checkin")
  .datepicker({
    format: "dd-mm-yyyy",
    onRender: function (date) {
      return date.valueOf() < now.valueOf() ? "disabled" : "";
    },
  })
  .on("changeDate", function (ev) {
    var newDate = new Date(ev.date);
    newDate.setDate(newDate.getDate() + 1);
    checkout.setValue(newDate);
    checkin.hide();

    $(".checkout")[0].focus();
  })
  .data("datepicker");
var checkout = $(".checkout")
  .datepicker({
    format: "dd-mm-yyyy",
    onRender: function (date) {
      return date.valueOf() <= checkin.date.valueOf() ? "disabled" : "";
    },
  })
  .on("changeDate", function (ev) {
    var newDate = new Date(ev.date);
    checkout.hide();
  })
  .data("datepicker");

// cars date picker
var nowTemp = new Date();
var now = new Date(
  nowTemp.getFullYear(),
  nowTemp.getMonth(),
  nowTemp.getDate(),
  0,
  0,
  0,
  0
);
var carfrom = $(".carfrom")
  .datepicker({
    format: "dd-mm-yyyy",
    onRender: function (date) {
      return date.valueOf() < now.valueOf() ? "disabled" : "";
    },
  })
  .on("changeDate", function (ev) {
    var newDates = new Date(ev.date);
    newDates.setDate(newDates.getDate() + 1);
    carto.setValue(newDates);
    carfrom.hide();

    $(".carto")[0].focus();
  })
  .data("datepicker");
var carto = $(".carto")
  .datepicker({
    format: "dd-mm-yyyy",
    onRender: function (date) {
      return date.valueOf() <= checkin.date.valueOf() ? "disabled" : "";
    },
  })
  .on("changeDate", function (ev) {
    var newDates = new Date(ev.date);
    carto.hide();
  })
  .data("datepicker");

/* flights */
var nowTemp = new Date();
var now = new Date(
  nowTemp.getFullYear(),
  nowTemp.getMonth(),
  nowTemp.getDate(),
  0,
  0,
  0,
  0
);
var depart = $(".depart")
  .datepicker({
    format: "dd-mm-yyyy",
    onRender: function (date) {
      return date.valueOf() < now.valueOf() ? "disabled" : "";
    },
  })
  .on("changeDate", function (ev) {
    var newDate = new Date(ev.date);
    newDate.setDate(newDate.getDate() + 1);
    returning.setValue(newDate);
    depart.hide();

    $(".returning")[0].focus();
  })
  .data("datepicker");
var returning = $(".returning")
  .datepicker({
    format: "dd-mm-yyyy",
    onRender: function (date) {
      return date.valueOf() <= depart.date.valueOf() ? "disabled" : "";
    },
  })
  .on("changeDate", function (ev) {
    var newDate = new Date(ev.date);
    returning.hide();
  })
  .data("datepicker");

/* bus */
var nowTemp = new Date();
var now = new Date(
  nowTemp.getFullYear(),
  nowTemp.getMonth(),
  nowTemp.getDate(),
  0,
  0,
  0,
  0
);
var busdepart = $(".busdepart")
  .datepicker({
    format: "dd/mm/yyyy",
    onRender: function (date) {
      return date.valueOf() < now.valueOf() ? "disabled" : "";
    },
  })
  .on("changeDate", function (ev) {
    var newDate = new Date(ev.date);
    newDate.setDate(newDate.getDate() + 1);
    busreturning.setValue(newDate);
    busdepart.hide();

    $(".busreturning")[0].focus();
  })
  .data("datepicker");
var busreturning = $(".busreturning")
  .datepicker({
    format: "dd/mm/yyyy",
    onRender: function (date) {
      return date.valueOf() <= busdepart.date.valueOf() ? "disabled" : "";
    },
  })
  .on("changeDate", function (ev) {
    var newDate = new Date(ev.date);
    busreturning.hide();
  })
  .data("datepicker");

/* datepicker */
$(".dp")
  .datepicker({
    format: "dd-mm-yyyy",
    onRender: function (date) {
      return date.valueOf() < now.valueOf() ? "disabled" : "";
    },
  })
  .on("changeDate", function (ev) {
    $(this).datepicker("hide");
  });

/* date change for tour */
$(".dp_tour")
  .datepicker({
    format: "dd-mm-yyyy",
    onRender: function (date) {
      return date.valueOf() < now.valueOf() ? "disabled" : "";
    },
  })
  .on("changeDate", function (ev) {
    $(this).datepicker("hide");

    //
    // var date = $(".date_change").val();
    // alert(date);
  });

/*=================================================================== Quests quantity total number count =========*/

(function ($) {
  "use strict";
  var $window = $(window);

  $window.on("load", function () {
    var $document = $(document);
    var $dom = $("html, body");
    var preloader = $("#preloader");
    var dropdownMenu = $(".main-menu-content .dropdown-menu-item");

    /* ======= Preloader ======= */
    preloader.delay("180").fadeOut(200);

    /*=========== Header top bar menu ============*/
    $document.on("click", ".down-button", function (event) {
      event.stopPropagation();
      $(this).toggleClass("active");
      $(".header-top-bar").slideToggle(200);
    });

    /*=========== Responsive Mobile menu ============*/
    $document.on("click", ".menu-toggler", function (event) {
      event.stopPropagation();
      $(this).toggleClass("active");
      $(".main-menu-content").slideToggle(200);
    });

    /*=========== Dropdown menu ============*/
    dropdownMenu
      .parent("li")
      .children("a")
      .append(function () {
        return '<button class="drop-menu-toggler" type="button"><i class="la la-angle-down"></i></button>';
      });

    /*=========== Dropdown menu ============*/
    $document.on(
      "click",
      ".main-menu-content .drop-menu-toggler",
      function (event) {
        event.stopPropagation();
        var Self = $(this);
        Self.parent().parent().children(".dropdown-menu-item").toggle();
        return false;
      }
    );

    /*=========== Sub menu ============*/
    $(".main-menu-content .dropdown-menu-item .sub-menu")
      .parent("li")
      .children("a")
      .append(function () {
        return '<button class="sub-menu-toggler" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>';
      });

    /*=========== Dropdown menu ============*/
    $document.on(
      "click",
      ".main-menu-content .dropdown-menu-item .sub-menu-toggler",
      function (event) {
        event.stopPropagation();
        var Self = $(this);
        Self.parent().parent().children(".sub-menu").toggle();
        return false;
      }
    );

    /*=========== Canvas menu open ============*/
    $document.on("click", ".user-menu-open", function (event) {
      event.stopPropagation();
      $(".user-canvas-container").addClass("active");
    });

    /*=========== Canvas menu close ============*/
    $document.on("click", ".side-menu-close", function (event) {
      event.stopPropagation();
      $(".user-canvas-container, .sidebar-nav").removeClass("active");
    });

    /*=========== Dashboard menu ============*/
    $document.on("click", ".menu-toggler", function (event) {
      event.stopPropagation();
      $(".sidebar-nav").toggleClass("active");
    });

    /*===== Back to top button ======*/
    $document.on("click", "#back-to-top", function (event) {
      event.stopPropagation();
      $($dom).animate(
        {
          scrollTop: 0,
        },
        800
      );
      return false;
    });

    /*==== When you will click the add another flight btn then this action will be work =====*/
    $document.on("click", ".add-flight-btn", function (event) {
      event.stopPropagation();
      // event.preventDefault();
      if ($(".multi-flight-field").length < 5) {
        // $('.multi-flight-field:last').clone().insertAfter('.multi-flight-field:last');

        let addFlightClone = document
          .querySelector("#add--flight-temp")
          .content.cloneNode(true);

        $(addFlightClone).insertAfter(".multi-flight-field:last");
        addSelect2();
      }

      // init date picker with every new clone
      $(".dp")
        .datepicker({
          format: "dd-mm-yyyy",
          onRender: function (date) {
            return date.valueOf() < now.valueOf() ? "disabled" : "";
          },
        })
        .on("changeDate", function (ev) {
          $(this).datepicker("hide");
        });

      // $('.autocomplete-airport').each(function(){var ac=$(this);ac.on('click',function(e){e.stopPropagation()}).on('focus keyup',search).on('keydown',onKeyDown);var wrap=$('<div>').addClass('autocomplete-wrapper').insertBefore(ac).append(ac);var list=$('<div>').addClass('autocomplete-results troll').on('click','.autocomplete-result',function(e){e.preventDefault();e.stopPropagation();selectIndex($(this).data('index'),ac)}).appendTo(wrap);var counter=0;counter++;$(".autocomplete-wrapper").addClass("_"+counter);$(".autocomplete-airport").focus(function(){$(ac).toggleClass("yes");$(".autocomplete-result").closest(".autocomplete-results").addClass("in")})});$(document).on('mouseover','.autocomplete-result',function(e){var index=parseInt($(this).data('index'),10);if(!isNaN(index)){$(this).attr('data-highlight',index)}}).on('click',clearResults);function clearResults(){results=[];numResults=0;$('.autocomplete-results').empty()}
      // $('.autocomplete-airport').each(function(){var ac=$(this);ac.on('click',function(e){e.stopPropagation()}).on('focus keyup',search).on('keydown',onKeyDown);var wrap=$('<div>').addClass('autocomplete-wrapper').insertBefore(ac).append(ac);var list=$('<div>').addClass('autocomplete-results troll').on('click','.autocomplete-result',function(e){e.stopPropagation();selectIndex($(this).data('index'),ac)}).appendTo(wrap);var counter=0;counter++;$(".autocomplete-wrapper").addClass("_"+counter);$(".autocomplete-airport").focus(function(){$(ac).toggleClass("yes");$(".autocomplete-result").closest(".autocomplete-results").addClass("in")})});$(document).on('mouseover','.autocomplete-result',function(e){var index=parseInt($(this).data('index'),10);if(!isNaN(index)){$(this).attr('data-highlight',index)}}).on('click',clearResults);function clearResults(){results=[];numResults=0;$('.autocomplete-results').empty()}
      $(".autocomplete-airport").each(function () {
        var ac = $(this);
        ac.on("click", function (e) {
          e.stopPropagation();
        })
          .on("focus keyup", search)
          .on("keydown", onKeyDown);
        var wrap = $("<div>")
          .addClass("autocomplete-wrapper")
          .insertBefore(ac)
          .append(ac);
        var list = $("<div>")
          .addClass("autocomplete-results troll")
          .on("click", ".autocomplete-result", function (e) {
            e.stopPropagation();
            selectIndex($(this).data("index"), ac);
          })
          .appendTo(wrap);
        var counter = 0;
        counter++;
        $(".autocomplete-wrapper").addClass("_" + counter);
        $(".autocomplete-airport").focus(function () {
          $(ac).toggleClass("yes");
          $(".autocomplete-result")
            .closest(".autocomplete-results")
            .addClass("in");
        });
      });
      $(document)
        .on("mouseover", ".autocomplete-result", function (e) {
          var index = parseInt($(this).data("index"), 10);
          if (!isNaN(index)) {
            $(this).attr("data-highlight", index);
          }
        })
        .on("click", (e) => clearResults(e));
      function clearResults(e) {
        e.stopPropagation();
        results = [];
        numResults = 0;
        $(".autocomplete-results").empty();
      }
      function selectIndex(index, autoinput) {
        if (results.length >= index + 1) {
          autoinput.val(
            results[index].iata +
              " - " +
              results[index].name +
              " - " +
              results[index].city
          );
          clearResults();
        }
      }
      var results = [];
      var numResults = 0;
      var selectedIndex = -1;
      function search(e) {
        if (e.which === 38 || e.which === 13 || e.which === 40) {
          return;
        }
        var ac = $(e.target);
        var list = ac.next();
        if (ac.val().length > 0) {
          results = _.take(fuse.search(ac.val()), 7);
          numResults = results.length;
          var divs = results.map(function (r, i) {
            return (
              '<div class="autocomplete-result" data-index="' +
              i +
              '">' +
              '<div><i class="mdi mdi-flight-takeoff"></i><b>' +
              r.iata +
              "</b><strong> " +
              r.name +
              "</strong></div>" +
              '<div class="autocomplete-location">' +
              r.city +
              ", " +
              r.country +
              "</div>" +
              "</div>"
            );
          });
          selectedIndex = -1;
          list.html(divs.join("")).attr("data-highlight", selectedIndex);
        } else {
          numResults = 0;
          list.empty();
        }
      }
      function onKeyDown(e) {
        var ac = $(e.currentTarget);
        var list = ac.next();
        switch (e.which) {
          case 38:
            selectedIndex--;
            if (selectedIndex <= -1) {
              selectedIndex = -1;
            }
            list.attr("data-highlight", selectedIndex);
            break;
          case 13:
            selectIndex(selectedIndex, ac);
            break;
          case 9:
            selectIndex(selectedIndex, ac);
            e.stopPropagation();
            return;
          case 40:
            selectedIndex++;
            if (selectedIndex >= numResults) {
              selectedIndex = numResults - 1;
            }
            list.attr("data-highlight", selectedIndex);
            break;
          default:
            return;
        }
        e.stopPropagation();
        e.preventDefault();
      }
      var counter = 0;
      $(".autocomplete-wrapper").each(function () {
        counter++;
        var self = $(this);
        self.addClass("row_" + counter);
        var tdCounter = 0;
        self.find(".autocomplete-results").each(function (index) {
          $(".autocomplete-wrapper")
            .find(".autocomplete-results")
            .addClass("intro");
        });
      });
      $(".ro-select").filter(function () {
        var $this = $(this),
          $sel = $("<ul>", { class: "ro-select-list" }),
          $wr = $("<div>", { class: "ro-select-wrapper" }),
          $inp = $("<input>", {
            type: "hidden",
            name: $this.attr("name"),
            class: "ro-select-input",
          }),
          $text = $("<div>", {
            class: "ro-select-text ro-select-text-empty",
            text: $this.attr("placeholder"),
          });
        $opts = $this.children("option");
        $text.click(function (event) {
          event.stopPropagation();
          $sel.show();
        });
        $opts.filter(function () {
          var $opt = $(this);
          $sel
            .append($("<li>", { text: $opt.text(), class: "ro-select-item" }))
            .data("value", $opt.attr("value"));
        });
        $sel.on("click", "li", function (event) {
          event.stopPropagation();
          $text.text($(this).text()).removeClass("ro-select-text-empty");
          $(this)
            .parent()
            .hide()
            .children("li")
            .removeClass("ro-select-item-active");
          $(this).addClass("ro-select-item-active");
          $inp.val($this.data("value"));
        });
        $wr.append($text);
        $wr.append($("<i>", { class: "fa fa-caret-down ro-select-caret" }));
        $this.after($wr.append($inp, $sel));
        $this.remove();
      });

      $(this)
        .closest(".multi-flight-wrap")
        .find(".multi-flight-field:last")
        .children(".multi-flight-delete-wrap")
        .show();
    });

    /*=========== multi-flight-remove ============*/
    $document.on("click", ".multi-flight-remove", function (event) {
      // event.preventDefault();
      event.stopPropagation();
      console.log("removed");

      $(".multi-flight-remove")
        .closest(".multi-flight-wrap")
        .find(".multi-flight-field")
        .not(":first")
        .last()
        .remove();
    });

    /*====  mobile dropdown menu  =====*/
    $document.on(
      "click",
      ".toggle-menu > li .toggle-menu-icon",
      function (event) {
        // event.preventDefault();
        event.stopPropagation();
        $(this)
          .closest("li")
          .siblings()
          .removeClass("active")
          .find(".toggle-drop-menu, .dropdown-menu-item")
          .slideUp(200);
        $(this)
          .closest("li")
          .toggleClass("active")
          .find(".toggle-drop-menu, .dropdown-menu-item")
          .slideToggle(200);
        return false;
      }
    );

    /*====== Dropdown btn ======*/
    $(".dropdown-btn").on("click", function (event) {
      // event.preventDefault();
      event.stopPropagation();
      $(this).next(".dropdown-menu-wrap").slideToggle(300);
    });

    /*====== When you click on the out side of dropdown menu item then its will be hide ======*/
    $document.on("click", function (event) {
      event.stopPropagation();
      // event.preventDefault();
      var $trigger = $(".dropdown-contain");
      if ($trigger !== event.target && !$trigger.has(event.target).length) {
        $(".dropdown-menu-wrap").slideUp(300);
      }
    });

    $(".progressbar-line").each(function () {
      $(this)
        .find(".progressbar-line-item")
        .animate(
          {
            width: $(this).attr("data-percent"),
          },
          6000
        );
    });
  });
})(jQuery);

/*======== Quests quantity total number count =========*/
function qtySumary() {
  var qtyInputField = document.getElementsByClassName("qtyInput_hotels");
  var totalNumber = 0;
  for (var i = 0; i < qtyInputField.length; i++) {
    if (parseInt(qtyInputField[i].value))
      totalNumber += parseInt(qtyInputField[i].value);
  }

  var cardQty = document.querySelector(".guest_hotels");
  if (cardQty) {
    cardQty.innerHTML = totalNumber;
  }

  var qtyInputField = document.getElementsByClassName("qtyInput_tours");
  var totalNumber = 0;
  for (var i = 0; i < qtyInputField.length; i++) {
    if (parseInt(qtyInputField[i].value))
      totalNumber += parseInt(qtyInputField[i].value);
  }

  var cardQty = document.querySelector(".guest_tours");
  if (cardQty) {
    cardQty.innerHTML = totalNumber;
  }

  var qtyInputField = document.getElementsByClassName("qtyInput_cars");
  var totalNumber = 0;
  for (var i = 0; i < qtyInputField.length; i++) {
    if (parseInt(qtyInputField[i].value))
      totalNumber += parseInt(qtyInputField[i].value);
  }

  var cardQty = document.querySelector(".guest_cars");
  if (cardQty) {
    cardQty.innerHTML = totalNumber;
  }

  var qtyInputField = document.getElementsByClassName("qtyInput_flights");
  var totalNumber = 0;
  for (var i = 0; i < qtyInputField.length; i++) {
    if (parseInt(qtyInputField[i].value))
      // alert(1);

      totalNumber += parseInt(qtyInputField[i].value);
  }

  var cardQty = document.querySelector(".guest_flights");
  if (cardQty) {
    cardQty.innerHTML = totalNumber;
  }
}
qtySumary();

$(".qtyBtn input").before(
  '<div class="qtyDec"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg></div>'
);
$(".qtyBtn input").after(
  '<div class="qtyInc"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg></div>'
);

$(".roomBtn input").before(
  '<div class="roomDec"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg></div>'
);
$(".roomBtn input").after(
  '<div class="roomInc"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg></div>'
);

$(".qtyDec, .qtyInc").on("click", function (event) {
  event.stopPropagation();

  var $button = $(this);
  var oldValue = $button.parent().find("input").val();

  if ($button.hasClass("qtyInc")) {
    var newVal = parseFloat(oldValue) + 1;

    if (newVal == 13) {
    }

    if (newVal == 13) {
      return;
    }
  } else {
    if (oldValue > 0) {
      var newVal = parseFloat(oldValue) - 1;
    } else {
      newVal = 1;
    }
  }

  $button.parent().find("input").val(newVal);
  qtySumary();
});

// BODY FADEOUT
$(".fadeout").click(function (event) {
  event.stopPropagation();
  $("html, body").fadeOut(250);
});
///////////////////////////////////////////////////////////////////////////////
window.onload = function () {
  /* oneway */
  document.getElementById("one-way").onclick = function () {
    document.getElementById("show").className = "col hide";
    document.getElementById("onereturn").className =
      "row g-2 contact-form-action";
    document.getElementById("multiway").className = "";
    document.getElementById("departure").className = "depart form-control";
  };

  /* return */
  document.getElementById("round-trip").onclick = function () {
    document.getElementById("show").className = "col show_";
    document.getElementById("onereturn").className =
      "row g-2 contact-form-action";
    document.getElementById("multiway").className = "";
    document.getElementById("departure").className =
      "depart form-control dateleft border-top-r0";
  };
};

function addSelect2() {
  // select 2 location init for hotels search
  var $ajax = $(".flight_location");

  function formatRepo(t) {
    return t.loading
      ? t.text
      : (console.log(t),
        '<button style="font-size: 12px; font-weight: bold;" class="btn btn-outline-danger btn-sm mx-0">' +
          t.id +
          '</button><div class="mx-2" style="line-height: 14px;"><strong>' +
          t.city +
          '<small class="px-1">' +
          t.country +
          "</small>" +
          '</strong><div class="d-block"><small>' +
          t.airport +
          "<small></div></div>");
  }

  function formatRepoSelection(t) {
    if (typeof t.city === "undefined") {
      var city = "";
    } else {
      var city = t.city;
    }

    return (
      '<div class="mt-2">' +
      city +
      " " +
      '<small><strong class="mt-2">' +
      t.id +
      " </strong></small></div>"
    );
  }

  $ajax.select2({
    ajax: {
      url: "https://phptravels.net/api/flights_locations",
      dataType: "json",
      data: function (t) {
        return {
          city: $.trim(t.term),
        };
      },
      processResults: function (t) {
        console.log(t);
        var e = [];
        return (
          t.forEach(function (t) {
            e.push({
              id: t.code,
              city: t.city,
              country: t.country,
              airport: t.airport,
            });
          }),
          console.log(e),
          {
            results: e,
          }
        );
      },
      cache: !0,
    },
    escapeMarkup: function (t) {
      return t;
    },
    minimumInputLength: 3,
    templateResult: formatRepo,
    templateSelection: formatRepoSelection,
    dropdownPosition: "below",
    cache: !0,
  });
}

addSelect2();

let _mostPolpularFlights;

$(document).on("select2:open", function (e) {
  document.querySelector(".select2-search__field").focus();

  if (
    ($('input[type="radio"]:checked').val() === "oneway" ||
      $('input[type="radio"]:checked').val() === "return") &&
    $(e.target).parents("#flights-search").length !== 0
  ) {
    if ($(e.target).parents(".from_flights").length !== 0) {
      setTimeout(() => $(".select2-results > ul > li").hide(), 10);
      _mostPolpularFlights = document
        .querySelector("#most--popular-from")
        .content.cloneNode(true);
      mostPopularFlights(e.target);
    } else if ($(e.target).parents(".to_flights").length !== 0) {
      setTimeout(() => $("#select2--results > li").hide(), 10);
      _mostPolpularFlights = document
        .querySelector("#most--popular-to")
        .content.cloneNode(true);
      mostPopularFlights(e.target);
    }
  }
});

function mostPopularFlights(_selectedId) {
  setTimeout(() => addEventFlights(_mostPolpularFlights, _selectedId), 10);
}

function addEventFlights(tempFlights, thisId) {
  let sibiling = $(thisId).siblings(".select2.select2-container");
  let change = $(sibiling).find("#select2--container > .mt-2");
  // let len = parent.querySelectorAll('div > .to--insert')
  let len = tempFlights.querySelectorAll("div > .to--insert");

  len.forEach((li) => {
    li.addEventListener("click", function (e) {
      // e.stopPropagation();
      let innerText = this.querySelector(".btn-outline-danger").textContent;
      let outterText = this.querySelector("div > strong").textContent;
      change.html(
        `${outterText} <small><strong class="mt-1"> ${innerText} </strong></small>`
      );

      $(thisId).find("option:not(:last-child)").remove();
      thisId.querySelector("option").value = innerText;

      document
        .querySelector(
          ".select2.select2-container.select2-container--default.select2-container--open"
        )
        .classList.remove("select2-container--open");

      document
        .querySelector(
          ".select2-container.select2-container--default.select2-container--open:last-child"
        )
        .remove();
    });
  });
  $(".select2-results > ul").append(_mostPolpularFlights);
}
// flights swap
document.querySelector("#swap").addEventListener("click", function () {
  var _fromFlight = document.querySelector(".from_flights");
  var _fromFlightOption = _fromFlight.querySelector("option:last-of-type");

  var _toFlight = document.querySelector(".to_flights");
  var _toFlightOption = _toFlight.querySelector("option:last-of-type");

  var _tempValue = _fromFlightOption.value;

  _fromFlightOption.value = _toFlightOption.value;
  _fromFlightOption.textContent = _toFlightOption.value;
  _toFlightOption.value = _tempValue;
  _toFlightOption.textContent = _tempValue;

  _tempValue = _fromFlight.querySelector(".mt-2").childNodes[0].nodeValue;
  _tempValue &&
    ((_fromFlight.querySelector(".mt-2").childNodes[0].nodeValue =
      _toFlight.querySelector(".mt-2").childNodes[0].nodeValue),
    (_toFlight.querySelector(".mt-2").childNodes[0].nodeValue = _tempValue));

  _fromFlight.querySelector(".mt-2 strong").innerHTML = _fromFlightOption.value;
  _toFlight.querySelector(".mt-2 strong").innerHTML = _toFlightOption.value;
});
$(".main_search ul li:first-child button").addClass("active");
$(".main_search .tab-content div:first-child").addClass("show active");

//////////////////// flights /////////////////////
$("#anchor2").rangeSlider("reset");
$("#anchor2").rangeSlider({ skin: "red", direction: "horizontal" });
$("#anchor2").rangeSlider({}, { step: 0, values: [100, 4000], max: 4000 });
// $("#anchor2").rangeSlider("onChange", (event) => console.log(event.detail));
//
$("#anchor2").rangeSlider({
  // settings: true,
  skin: "red",
  type: "interval",
  // scale: true,
});

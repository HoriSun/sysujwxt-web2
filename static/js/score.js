// Generated by CoffeeScript 1.4.0
(function() {
  var calculateGpa, drawBarChart, drawChart, drawPieChart, exports, formatScoreForBar, formatScoreForPie, genCreditRow, genGChartUrl, getEarnedCredit, getGpa, getRequiredCredit, getScore, getScript, getTno, organizeCredits;

  exports = this;

  getScore = function(ctx, year, term) {
    return $.ajax({
      url: "/api/score",
      context: ctx,
      data: {
        year: year,
        term: term
      }
    });
  };

  getScript = function(url) {
    return $.ajax({
      url: url,
      cache: true,
      dataType: "script"
    });
  };

  getGpa = function(year, term) {
    return $.ajax({
      url: "/api/gpa",
      data: {
        year: year,
        term: term
      }
    });
  };

  getTno = function() {
    return $.ajax({
      url: "/api/tno",
      async: false,
      success: function(res) {
        var nums;
        nums = eval("nums = " + res).body.parameters.result;
        exports.grade = nums.split(",")[1];
        return exports.tno = nums.split(",")[2];
      }
    });
  };

  getRequiredCredit = function() {
    if (!(typeof grade !== "undefined" && grade !== null) || !(typeof tno !== "undefined" && tno !== null)) {
      getTno();
    }
    return $.get("/api/required_credit", {
      grade: grade,
      tno: tno
    });
  };

  getEarnedCredit = function() {
    return $.get("/api/earned_credit");
  };

  organizeCredits = function(req_cdts, earn_cdts, gpas) {
    var allRequiredCreditsForNow, credits, earn_cdt, gpa, gpaWeight, key, req_cdt, _i, _j, _k, _len, _len1, _len2;
    credits = {
      "公必": {},
      "专必": {},
      "公选": {},
      "专选": {},
      "实践": {},
      "总览": {
        "req_cdt": 0,
        "earn_cdt": 0,
        "gpa": 0
      }
    };
    for (_i = 0, _len = req_cdts.length; _i < _len; _i++) {
      req_cdt = req_cdts[_i];
      credits[req_cdt.oneColumn.slice(0, 2)]["req_cdt"] = parseInt(req_cdt.twoColumn);
      credits["总览"]["req_cdt"] += parseInt(req_cdt.twoColumn);
    }
    for (_j = 0, _len1 = earn_cdts.length; _j < _len1; _j++) {
      earn_cdt = earn_cdts[_j];
      credits[earn_cdt.oneColumn.slice(0, 2)]["earn_cdt"] = parseInt(earn_cdt.twoColumn);
      credits["总览"]["earn_cdt"] += parseInt(earn_cdt.twoColumn);
    }
    for (_k = 0, _len2 = gpas.length; _k < _len2; _k++) {
      gpa = gpas[_k];
      credits[gpa.oneColumn.slice(0, 2)]["gpa"] = parseFloat(gpa.twoColumn);
      gpaWeight = parseFloat(gpa.twoColumn) * credits[gpa.oneColumn.slice(0, 2)]["earn_cdt"];
      credits["总览"]["gpa"] += gpaWeight;
    }
    credits["总览"]["gpa"] /= credits["总览"]["earn_cdt"];
    credits["总览"]["gpa"] = credits["总览"]["gpa"].toFixed(3);
    allRequiredCreditsForNow = 0;
    for (key in credits) {
      if (key === "总览" || !credits[key]["req_cdt"]) {
        break;
      } else {
        if (!credits[key]["earn_cdt"]) {
          credits[key]["earn_cdt"] = 0;
          credits[key]["gpa"] = 0;
        }
        credits[key]["req_cdt_now"] = credits[key]["earn_cdt"] >= credits[key]["req_cdt"] ? 0 : credits[key]["earn_cdt"] - credits[key]["req_cdt"];
        allRequiredCreditsForNow += credits[key]["req_cdt_now"];
      }
    }
    credits["总览"]["req_cdt_now"] = allRequiredCreditsForNow;
    return credits;
  };

  genCreditRow = function(credit, rowName) {
    var length, maxCredit, maxWidth, successTd, tr;
    if (!(credit.gpa != null) || !(credit.req_cdt != null) || !(credit.earn_cdt != null)) {
      return;
    }
    maxWidth = 420;
    maxCredit = 100;
    successTd = '<td><span class="label label-success"><i class="icon-ok icon-white"></i></span></td>';
    tr = $("<tr>");
    tr.append($("<th>").text(rowName));
    tr.append($("<td>").text(credit.gpa));
    tr.append($("<td>").text(credit.earn_cdt + "/" + credit.req_cdt));
    if (credit.req_cdt_now === 0) {
      return tr.append(successTd);
    } else {
      tr.append($("<td>").append($("<span>").addClass("label").text(credit.req_cdt_now)));
      tr.append($("<td>").append($("<div>").addClass("progress").addClass("progress-striped").data("length", (length = credit.req_cdt / maxCredit * maxWidth) > maxWidth ? maxWidth : length).width(0).append($("<div>").addClass("bar").addClass(credit.req_cdt_now === 0 ? "bar-success" : null).addClass(credit.req_cdt_now !== 0 && rowName !== "总览" ? "bar-info" : null).data("length", credit.earn_cdt / credit.req_cdt * 100 + "%")))).width(0);
      return tr;
    }
  };

  calculateGpa = function(scores) {
    var gpa, gpaWeight, score, totalCredits, zzcj, _i, _j, _len, _len1;
    gpaWeight = 0;
    totalCredits = 0;
    for (_i = 0, _len = scores.length; _i < _len; _i++) {
      score = scores[_i];
      gpaWeight += parseFloat(score.jd) * parseInt(score.xf);
      totalCredits += parseInt(score.xf);
    }
    gpa = (gpaWeight / totalCredits).toFixed(3);
    $("#gpa_origin").text(gpa);
    gpaWeight = 0;
    for (_j = 0, _len1 = scores.length; _j < _len1; _j++) {
      score = scores[_j];
      zzcj = Math.round(score.zzcj);
      if ((85 <= zzcj && zzcj <= 100)) {
        zzcj = 4.0;
      } else if ((80 <= zzcj && zzcj <= 84)) {
        zzcj = 3.5;
      } else if ((75 <= zzcj && zzcj <= 79)) {
        zzcj = 3.0;
      } else if ((70 <= zzcj && zzcj <= 74)) {
        zzcj = 2.5;
      } else if ((65 <= zzcj && zzcj <= 69)) {
        zzcj = 2.0;
      } else if ((60 <= zzcj && zzcj <= 64)) {
        zzcj = 1.5;
      } else if (zzcj < 60) {
        zzcj = 1.0;
      }
      gpaWeight += zzcj * parseInt(score.xf);
    }
    gpa = (gpaWeight / totalCredits).toFixed(3);
    return $("#gpa_new").text(gpa);
  };

  genGChartUrl = function(scores, type) {
    var url;
    scores = scores.join(",");
    return url = "http://chart.apis.google.com/chart?chs=600x200&chd=t:" + scores + "&cht=p3&chhco=ff0000&chl=<60|60-69|70-79|80-89|90-100";
  };

  formatScoreForBar = function(scores) {
    var count, data, i, j, key, map, score, _i, _j, _k, _len, _len1, _ref;
    map = {};
    data = [];
    for (_i = 0, _len = scores.length; _i < _len; _i++) {
      score = scores[_i];
      if (!map[score.xnd]) {
        map[score.xnd] = [0, 0, 0, 0, 0];
      }
    }
    for (_j = 0, _len1 = scores.length; _j < _len1; _j++) {
      score = scores[_j];
      count = 1;
      for (i = _k = 60; _k < 100; i = _k += 10) {
        if ((i <= (_ref = score.zzcj) && _ref < i + 10)) {
          map[score.xnd][count]++;
          break;
        }
        if (i > score.zzcj) {
          map[score.xnd][0]++;
        }
        count++;
      }
      if (parseInt(score.zzcj) === 100) {
        map[score.xnd][count - 1]++;
      }
    }
    j = 0;
    for (key in map) {
      data[j] = {
        name: key,
        data: map[key]
      };
      j++;
    }
    return data.sort(function(a, b) {
      return a.name < b.name;
    });
  };

  formatScoreForPie = function(scores) {
    var count, data, i, score, _i, _j, _k, _len, _ref;
    data = [["&lt;60", 0]];
    for (i = _i = 60; _i < 100; i = _i += 5) {
      if (i === 95) {
        data.push([i + "-" + (i + 5), 0]);
      } else {
        data.push([i + "-" + (i + 4), 0]);
      }
    }
    for (_j = 0, _len = scores.length; _j < _len; _j++) {
      score = scores[_j];
      count = 1;
      for (i = _k = 60; _k < 100; i = _k += 5) {
        if ((i <= (_ref = score.zzcj) && _ref < i + 5)) {
          data[count][1]++;
          break;
        }
        if (i > score.zzcj) {
          data[0][1]++;
        }
        count++;
      }
      if (parseInt(score.zzcj) === 100) {
        data[count - 1][1]++;
      }
    }
    return data;
  };

  drawChart = function(scores, type, ele) {
    switch (type) {
      case 'pie':
        return drawPieChart(scores, ele);
      case 'bar':
        return drawBarChart(scores, ele);
      case 'bubble':
        return drawBubbleChart(scores, ele);
    }
  };

  drawPieChart = function(scores, ele) {
    var chart;
    return chart = new Highcharts.Chart({
      chart: {
        renderTo: ele,
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
      },
      title: {
        text: '大学成绩分布图'
      },
      credits: {
        href: 'http://sysujwxt.com',
        text: '中大第三方教务系统'
      },
      tooltip: {
        formatter: function() {
          return '<b>' + this.point.name + '分</b><br>' + this.series.name + ':<b>' + this.point.y + '</b>';
        },
        percentageDecimals: 1
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          dataLabels: {
            enabled: true,
            color: '#000000',
            connectorColor: '#000000',
            formatter: function() {
              return '<b>' + this.point.name + '</b>: ' + this.percentage.toFixed(2) + ' %';
            }
          }
        }
      },
      series: [
        {
          type: "pie",
          name: "科目数量",
          data: formatScoreForPie(scores)
        }
      ]
    });
  };

  drawBarChart = function(scores, ele) {
    var chart;
    return chart = new Highcharts.Chart({
      chart: {
        renderTo: ele,
        type: 'column'
      },
      credits: {
        href: 'http://sysujwxt.com',
        text: '中大第三方教务系统'
      },
      title: {
        text: '大学成绩分布图'
      },
      xAxis: {
        categories: ['&lt;60', '60-70', "70-80", "80-90", "90-100"]
      },
      yAxis: {
        min: 0,
        title: {
          text: '科目数量'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
          }
        }
      },
      legend: {
        backgroundColor: '#FFFFFF',
        reversed: true
      },
      tooltip: {
        formatter: function() {
          return '' + this.series.name + '学年: ' + this.y + '';
        }
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
            formatter: function() {
              if (this.y === 0) {
                return null;
              }
              return this.y;
            }
          }
        }
      },
      series: formatScoreForBar(scores)
    });
  };

  $(function() {
    $.when(getRequiredCredit(), getEarnedCredit(), getGpa()).done(function() {
      var credits, delay, earn_cdts, gpas, req_cdts, rowName, tbody, _i, _len, _ref;
      req_cdts = eval("req_cdts = " + arguments[0][0]).body.dataStores.zxzyxfStore.rowSet.primary;
      earn_cdts = eval("earn_cdts = " + arguments[1][0]).body.dataStores.xfStore.rowSet.primary;
      gpas = eval("gpas = " + arguments[2][0]).body.dataStores.jdStore.rowSet.primary;
      credits = organizeCredits(req_cdts, earn_cdts, gpas);
      tbody = $("<tbody>");
      _ref = ["公必", "专必", "专选", "公选", "实践", "总览"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rowName = _ref[_i];
        tbody.append(genCreditRow(credits[rowName], rowName));
      }
      $("#credit-chart").append(tbody);
      delay = function(ms, func) {
        return setTimeout(func, ms);
      };
      return delay(10, function() {
        return $("#credit-chart").find("div").each(function() {
          return $(this).width($(this).data("length"));
        });
      });
    });
    $('.term-btn-group .btn').click(function(event) {
      var term, year;
      term = $(this).val();
      year = $('#year').val();
      toggleLoadingScene('#score-result', $loadingSpinner);
      return getScore($("#score-result")[0], year, term).done(function(res) {
        var $tbl, $tblBody, $tblHead, score, scores, _i, _len;
        checkRes(res, this);
        scores = eval('tableJson = ' + res).body.dataStores.kccjStore.rowSet.primary;
        if (scores.length === 0) {
          toggleLoadingScene(this, $lol);
          return;
        }
        $tblHead = $('<thead>').append($('<tr>').append($('<th>').html($('<span>').attr('class', 'label').text('类型')).append(' 课程'), $('<th>').text('学分'), $('<th>').text('成绩'), $('<th>').text('绩点'), $('<th>').text('教学班排名')));
        $tblBody = $('<tbody>');
        for (_i = 0, _len = scores.length; _i < _len; _i++) {
          score = scores[_i];
          $tblBody.append($('<tr>').append($('<th>').html($('<span>').attr('class', 'label').text(courseTypeTable[score.kclb])).append(' ' + score.kcmc), $('<td>').text(score.xf), $('<td>').text(score.zzcj), $('<td>').text(score.jd), $('<td>').text(score.jxbpm)));
        }
        $tbl = $('<table>').attr({
          'class': 'table table-condensed table-hover'
        }).append($tblHead, $tblBody);
        return toggleLoadingScene(this, $tbl, true);
      }).fail(function() {
        return $(this).html("请求失败，再试一次？");
      });
    });
    $(".chart-type-btn-group .btn").click(function(e) {
      var type;
      e.preventDefault();
      toggleLoadingScene('#gpa-chart', $loadingSpinner);
      type = $(this).val();
      return getScore($("#gpa-chart")[0]).done(function(res) {
        var scores;
        if (checkRes(res, this)) {
          scores = eval("scores =" + res).body.dataStores.kccjStore.rowSet.primary;
          calculateGpa(scores);
          return drawChart(scores, type, this);
        }
      }).fail(function() {
        return toggleLoadingScene(this, $lol);
      });
    });
    $(".chart-type-btn-group button[value=pie]").click();
    $("[rel=tooltip]").tooltip({
      trigger: 'click'
    });
    return $("[rel=tooltip]").tooltip({
      trigger: 'hover'
    });
  });

}).call(this);

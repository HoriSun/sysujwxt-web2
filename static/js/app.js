// Generated by CoffeeScript 1.4.0
(function() {
  var $loadingSpinner, $lol, campusTable, courseStatusTable, courseTypeTable, currentTerm, currentYear, examineTypeTable, exports, getData, loadClassesToday;

  exports = this;

  courseTypeTable = {
    '30': '公选',
    '21': '专选',
    '11': '专必',
    '10': '公必'
  };

  courseStatusTable = {
    '00': '不通过',
    '01': '待筛选',
    '03': '待审核',
    '04': '待确认',
    '05': '选课成功',
    '06': '已退课'
  };

  examineTypeTable = {
    '01': '笔试',
    '02': '口试',
    '03': '考查',
    '04': '操作',
    '05': '其他'
  };

  campusTable = {
    '1': '男校',
    '2': '北校',
    '3': '猪海校区',
    '4': '中东'
  };

  currentYear = '2012-2013';

  currentTerm = '1';

  $loadingSpinner = $('<img>').attr({
    'src': './static/img/loader.gif',
    'class': 'loading-img'
  });

  $lol = $('<img>').attr({
    'src': './static/img/lol.png',
    'class': 'lol-img'
  });

  exports.toggleLoadingScene = function(selector, html, animation) {
    if (animation == null) {
      animation = false;
    }
    if (animation) {
      return $(selector).empty().append(html).fadeOut(0).fadeIn();
    } else {
      return $(selector).empty().append(html);
    }
  };

  getData = function(url, param, callback) {
    return $.ajax({
      type: 'GET',
      url: url,
      cache: false,
      data: param
    }).done(callback);
  };

  loadClassesToday = function() {
    $.ajax({
      type: 'GET',
      url: '/api/timetable',
      cache: false,
      data: {
        term: currentTerm,
        year: currentYear
      }
    }).done(function(response) {
      var $tbl, $tblBody, $tblHead, classes, cls, pattern, result, today, _i, _len;
      response = response.replace(/\s/g, "");
      pattern = /jc='(.*?)'.*?kcmc='(.*?)'.*?dd='(.*?)'.*?zfw='(.*?)'.*?dsz='(.*?)'.*?weekpos=([0-9])/g;
      pattern.compile(pattern);
      classes = [];
      today = new Date().getDay();
      while ((result = pattern.exec(response)) != null) {
        if ((parseInt(result[6])) === today) {
          classes.push(result);
        }
      }
      console.log(classes);
      if (classes.length === 0) {
        toggleLoadingScene('#class-today', $lol);
        return;
      }
      $tblHead = $('<thead>').append($('<tr>').append($('<th>').text('今日课程'), $('<th>').text('时间'), $('<th>').text('教室')));
      $tblBody = $('<tbody>');
      for (_i = 0, _len = classes.length; _i < _len; _i++) {
        cls = classes[_i];
        $tblBody.append($('<tr>').append($('<td>').text(cls[2]), $('<td>').text(cls[1]), $('<td>').text(cls[3])));
      }
      $tbl = $('<table>').attr({
        'class': 'table table-hover'
      }).append($tblHead, $tblBody);
      return toggleLoadingScene('#class-today', $tbl, true);
    });
    return toggleLoadingScene('#class-today', $loadingSpinner);
  };

  $(function() {
    $('.remove-class-btn').live('click', function() {
      var choice,
        _this = this;
      choice = confirm('确定退课？');
      if (choice) {
        return $.ajax({
          type: 'GET',
          url: '/api/remove_course',
          cache: false,
          data: {
            id: $(this).val()
          }
        }).done(function(response) {
          eval('tableJson = ' + response);
          return $(_this).replaceWith("<span>" + "退课状态:" + tableJson.body.parameters.dataSave + "(请重新查询进行确认)" + "</span>");
        });
      }
    });
    if ($('#class-today').length) {
      loadClassesToday();
    }
    $('.term-btn-group .btn').click(function(event) {
      var term, year;
      event.preventDefault();
      console.log(($(this)).val());
      console.log(($('#year')).val());
      term = $(this).val();
      year = $('#year').val();
      $.ajax({
        type: 'GET',
        url: '/api/score',
        cache: false,
        data: {
          term: term,
          year: year
        }
      }).done(function(response) {
        var $tbl, $tblBody, $tblHead, score, scores, _i, _len;
        console.log(response);
        eval('tableJson = ' + response);
        scores = tableJson.body.dataStores.kccjStore.rowSet.primary;
        console.log(tableJson);
        if (scores.length === 0) {
          toggleLoadingScene('#score-result', $lol);
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
        return toggleLoadingScene('#score-result', $tbl, true);
      });
      return toggleLoadingScene('#score-result', $loadingSpinner);
    });
    $('.course-type-btn-group .btn').click(function(event) {
      event.preventDefault();
      return console.log(($(this)).val());
    });
    return $('.term-btn-group2 .btn').click(function(event) {
      var term, year;
      event.preventDefault();
      console.log(($(this)).val());
      console.log(($('#year')).val());
      term = $(this).val();
      year = $('#year').val();
      $.ajax({
        type: 'GET',
        url: '/api/course_result',
        cache: false,
        data: {
          term: term,
          year: year
        }
      }).done(function(response) {
        var $tbl, $tblBody, $tblHead, course, courses, _i, _len, _name, _ref;
        eval('tableJson = ' + response);
        courses = tableJson.body.dataStores.xsxkjgStore.rowSet.primary;
        if (courses.length === 0) {
          toggleLoadingScene('#course-result', $lol);
          return;
        }
        $tblHead = $('<thead>').append($('<tr>').append($('<th>').html($('<span>').attr('class', 'label').text('类型')).append(' 已选课程'), $('<th>').text('学分'), $('<th>').text('考核方式'), $('<th>').text('筛选情况'), $('<th>').text('退课')));
        $tblBody = $('<tbody>');
        for (_i = 0, _len = courses.length; _i < _len; _i++) {
          course = courses[_i];
          $tblBody.append($('<tr>').append($('<th>').html($('<span>').attr('class', 'label').text(courseTypeTable[course.kclbm])).append(' ' + course.kcmc), $('<td>').text(course.xf), $('<td>').text((_ref = examineTypeTable[_name = course.khfs]) != null ? _ref : examineTypeTable[_name] = ''), $('<td>').text(courseStatusTable[course.xkcgbz]), $('<td>').html($('<button>').text('退课').addClass('btn btn-danger remove-class-btn').val(course.resource_id))));
        }
        $tbl = $('<table>').attr({
          'class': 'table table-condensed table-hover'
        }).append($tblHead, $tblBody);
        return toggleLoadingScene('#course-result', $tbl, true);
      });
      return toggleLoadingScene('#course-result', $loadingSpinner);
    });
  });

}).call(this);

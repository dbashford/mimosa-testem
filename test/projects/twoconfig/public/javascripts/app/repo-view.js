var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['jquery', 'lodash', 'moment', 'templates'], function($, _, moment, templates) {
  var OwnerRepoListView;
  return OwnerRepoListView = (function() {
    function OwnerRepoListView() {
      this.searchOwner = __bind(this.searchOwner, this);
      this.searchCheck = __bind(this.searchCheck, this);
      $('button').click(this.searchOwner);
      $('input').keyup(this.searchCheck);
    }

    OwnerRepoListView.prototype.searchCheck = function(e) {
      if (e.keyCode === 13) {
        return this.searchOwner();
      }
    };

    OwnerRepoListView.prototype.searchOwner = function() {
      var repoName;
      repoName = $('input').val();
      if (repoName.length > 0) {
        return this.executeSearch(repoName);
      }
    };

    OwnerRepoListView.prototype.executeSearch = function(repo) {
      var url;
      url = "https://api.github.com/users/" + repo + "/repos?type=owner&sort=updated&date=" + (new Date().getTime());
      return $.getJSON(url).success(this.searchSuccess(repo)).fail(this.searchFail(repo));
    };

    OwnerRepoListView.prototype.searchSuccess = function(repo) {
      var _this = this;
      return function(data, status, xhr) {
        var results;
        results = _this.buildResults(data, xhr, repo);
        return _this.render(results);
      };
    };

    OwnerRepoListView.prototype.searchFail = function(repo) {
      var _this = this;
      return function(xhr) {
        var results;
        results = _this.buildResults([], xhr, repo);
        return _this.render(results);
      };
    };

    OwnerRepoListView.prototype.buildResults = function(data, xhr, repo) {
      var processedData, rateLimitingData;
      processedData = this.processData(data);
      rateLimitingData = this.rateLimiting(xhr.getResponseHeader);
      return _.extend({
        results: processedData,
        name: repo
      }, rateLimitingData);
    };

    OwnerRepoListView.prototype.rateLimiting = function(rhs) {
      return {
        limit: rhs('X-RateLimit-Limit'),
        remaining: rhs('X-RateLimit-Remaining'),
        limited: rhs('X-RateLimit-Remaining') === "0",
        canUseWhen: moment(new Date(rhs('X-RateLimit-Reset') * 1000)).fromNow()
      };
    };

    OwnerRepoListView.prototype.processData = function(data) {
      if (data.length > 25) {
        data = _.initial(data, data.length - 25);
      }
      return _.map(data, function(result) {
        return {
          name: result.name,
          url: result.html_url,
          desc: result.description
        };
      });
    };

    OwnerRepoListView.prototype.render = function(data) {
      return $('#results').html(templates.results(data));
    };

    return OwnerRepoListView;

  })();
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2RiYXNoZm9yZC9teWdpdGh1Yi9NaW1vc2FUZXN0ZW0vcHVibGljL2phdmFzY3JpcHRzL2FwcC9yZXBvLXZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvZGJhc2hmb3JkL215Z2l0aHViL01pbW9zYVRlc3RlbS9hc3NldHMvamF2YXNjcmlwdHMvYXBwL3JlcG8tdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSw4RUFBQTs7QUFBQSxDQUFBLENBQ0UsQ0FHRixHQUpBLEVBQU8sQ0FJTixFQUpNO0NBTUwsS0FBQSxXQUFBO1NBQU07Q0FFUyxFQUFBLENBQUEsdUJBQUE7Q0FDWCxnREFBQTtDQUFBLGdEQUFBO0NBQUEsR0FBbUIsQ0FBbkIsQ0FBQSxFQUFBLEdBQUE7Q0FBQSxHQUNrQixDQUFsQixDQUFBLENBQUEsSUFBQTtDQUZGLElBQWE7O0NBQWIsRUFJYSxNQUFDLEVBQWQ7Q0FDRSxDQUFBLEVBQWtCLENBQWEsQ0FBL0IsQ0FBa0I7Q0FBakIsR0FBQSxPQUFELElBQUE7UUFEVztDQUpiLElBSWE7O0NBSmIsRUFPYSxNQUFBLEVBQWI7Q0FDRSxPQUFBLEVBQUE7Q0FBQSxFQUFXLEdBQVgsQ0FBVyxDQUFYO0NBQ0EsRUFBcUIsQ0FBbEIsRUFBSCxFQUFXO0NBQ1IsR0FBQSxJQUFELEtBQUEsRUFBQTtRQUhTO0NBUGIsSUFPYTs7Q0FQYixFQVllLENBQUEsS0FBQyxJQUFoQjtDQUNFLEVBQUEsT0FBQTtDQUFBLEVBQUEsQ0FBTyxFQUFQLENBQW9GLHdCQUE3RSxPQUFBO0NBQ04sRUFBRCxDQUF3QixHQUF4QixHQUFpRCxHQUFqRDtDQWRGLElBWWU7O0NBWmYsRUFnQmUsQ0FBQSxLQUFDLElBQWhCO0NBQ0UsU0FBQSxFQUFBO0VBQU8sQ0FBUCxDQUFBLEVBQUEsR0FBQyxJQUFEO0NBQ0UsTUFBQSxLQUFBO0NBQUEsQ0FBOEIsQ0FBcEIsQ0FBQSxDQUFDLEVBQVgsQ0FBQSxJQUFVO0NBQ1QsSUFBQSxDQUFELENBQUEsUUFBQTtDQUhXLE1BQ2I7Q0FqQkYsSUFnQmU7O0NBaEJmLEVBcUJZLENBQUEsS0FBQyxDQUFiO0NBQ0UsU0FBQSxFQUFBO0dBQUEsTUFBQyxJQUFEO0NBQ0UsTUFBQSxLQUFBO0NBQUEsQ0FBVSxDQUFBLENBQUEsQ0FBQyxFQUFYLENBQUEsSUFBVTtDQUNULElBQUEsQ0FBRCxDQUFBLFFBQUE7Q0FIUSxNQUNWO0NBdEJGLElBcUJZOztDQXJCWixDQTBCcUIsQ0FBUCxDQUFBLEtBQUMsR0FBZjtDQUNFLFNBQUEscUJBQUE7Q0FBQSxFQUFnQixDQUFDLEVBQWpCLEtBQWdCLEVBQWhCO0NBQUEsRUFDbUIsQ0FBQyxFQUFwQixNQUFtQixJQUFuQixDQUFtQjtDQUNsQixLQUFELE9BQUE7Q0FBUyxDQUFVLEtBQVQsQ0FBQSxLQUFEO0NBQUEsQ0FBOEIsRUFBTCxJQUFBO0NBSHRCLENBR2tDLE1BQTlDLFFBQUE7Q0E3QkYsSUEwQmM7O0NBMUJkLEVBK0JjLE1BQUMsR0FBZjthQUNFO0NBQUEsQ0FBTyxDQUFBLEVBQVAsR0FBQSxXQUFPO0NBQVAsQ0FDVyxDQUFBLEtBQVgsQ0FBQSxjQUFXO0NBRFgsQ0FFUyxDQUFBLEVBQWdDLEVBQXpDLENBQUEsZUFBUztDQUZULENBR1ksQ0FBZ0IsQ0FBTCxFQUFYLENBQUEsQ0FBWixFQUFBLFNBQTRCO0NBSmhCO0NBL0JkLElBK0JjOztDQS9CZCxFQXFDYSxDQUFBLEtBQUMsRUFBZDtDQUNFLENBQUEsQ0FBaUIsQ0FBZCxFQUFIO0NBQ0UsQ0FBdUIsQ0FBaEIsQ0FBUCxFQUF1QixDQUFoQixDQUFQO1FBREY7Q0FHQyxDQUFXLENBQVosQ0FBQSxFQUFZLEdBQUMsSUFBYjtlQUNFO0NBQUEsQ0FBTSxFQUFOLEVBQVksSUFBWjtDQUFBLENBQ00sQ0FBTixHQUFZLEVBRFosRUFDQTtDQURBLENBRU0sRUFBTixFQUFZLElBQVosQ0FGQTtDQURVO0NBQVosTUFBWTtDQXpDZCxJQXFDYTs7Q0FyQ2IsRUE4Q1EsQ0FBQSxFQUFSLEdBQVM7Q0FDUCxHQUFBLEdBQW1CLEVBQVMsQ0FBNUIsR0FBQTtDQS9DRixJQThDUTs7Q0E5Q1I7O0NBSko7Q0FBQSIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSBbJ2pxdWVyeScsXG4gICdsb2Rhc2gnLFxuICAnbW9tZW50JyxcbiAgJ3RlbXBsYXRlcyddLFxuKCQsIF8sIG1vbWVudCwgdGVtcGxhdGVzKSAtPlxuXG4gIGNsYXNzIE93bmVyUmVwb0xpc3RWaWV3XG5cbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgICQoJ2J1dHRvbicpLmNsaWNrKEBzZWFyY2hPd25lcilcbiAgICAgICQoJ2lucHV0Jykua2V5dXAoQHNlYXJjaENoZWNrKVxuXG4gICAgc2VhcmNoQ2hlY2s6IChlKSA9PlxuICAgICAgQHNlYXJjaE93bmVyKCkgaWYgZS5rZXlDb2RlIGlzIDEzXG5cbiAgICBzZWFyY2hPd25lcjogPT5cbiAgICAgIHJlcG9OYW1lID0gJCgnaW5wdXQnKS52YWwoKVxuICAgICAgaWYgcmVwb05hbWUubGVuZ3RoID4gMFxuICAgICAgICBAZXhlY3V0ZVNlYXJjaCByZXBvTmFtZVxuXG4gICAgZXhlY3V0ZVNlYXJjaDogKHJlcG8pIC0+XG4gICAgICB1cmwgPSBcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vdXNlcnMvI3tyZXBvfS9yZXBvcz90eXBlPW93bmVyJnNvcnQ9dXBkYXRlZCZkYXRlPSN7bmV3IERhdGUoKS5nZXRUaW1lKCl9XCJcbiAgICAgICQuZ2V0SlNPTih1cmwpLnN1Y2Nlc3MoQHNlYXJjaFN1Y2Nlc3MgcmVwbykuZmFpbChAc2VhcmNoRmFpbCByZXBvKVxuXG4gICAgc2VhcmNoU3VjY2VzczogKHJlcG8pIC0+XG4gICAgICAoZGF0YSwgc3RhdHVzLCB4aHIpID0+XG4gICAgICAgIHJlc3VsdHMgPSBAYnVpbGRSZXN1bHRzIGRhdGEsIHhociwgcmVwb1xuICAgICAgICBAcmVuZGVyIHJlc3VsdHNcblxuICAgIHNlYXJjaEZhaWw6IChyZXBvKSAtPlxuICAgICAgKHhocikgPT5cbiAgICAgICAgcmVzdWx0cyA9IEBidWlsZFJlc3VsdHMgW10sIHhociwgcmVwb1xuICAgICAgICBAcmVuZGVyIHJlc3VsdHNcblxuICAgIGJ1aWxkUmVzdWx0czogKGRhdGEsIHhociwgcmVwbykgLT5cbiAgICAgIHByb2Nlc3NlZERhdGEgPSBAcHJvY2Vzc0RhdGEgZGF0YVxuICAgICAgcmF0ZUxpbWl0aW5nRGF0YSA9IEByYXRlTGltaXRpbmcgeGhyLmdldFJlc3BvbnNlSGVhZGVyXG4gICAgICBfLmV4dGVuZCB7cmVzdWx0czogcHJvY2Vzc2VkRGF0YSwgbmFtZTpyZXBvfSwgcmF0ZUxpbWl0aW5nRGF0YVxuXG4gICAgcmF0ZUxpbWl0aW5nOiAocmhzKSAtPlxuICAgICAgbGltaXQ6IHJocyAnWC1SYXRlTGltaXQtTGltaXQnXG4gICAgICByZW1haW5pbmc6IHJocyAnWC1SYXRlTGltaXQtUmVtYWluaW5nJ1xuICAgICAgbGltaXRlZDogcmhzKCdYLVJhdGVMaW1pdC1SZW1haW5pbmcnKSBpcyBcIjBcIlxuICAgICAgY2FuVXNlV2hlbjogbW9tZW50KG5ldyBEYXRlKHJocygnWC1SYXRlTGltaXQtUmVzZXQnKSAqIDEwMDApKS5mcm9tTm93KClcblxuICAgIHByb2Nlc3NEYXRhOiAoZGF0YSkgLT5cbiAgICAgIGlmIGRhdGEubGVuZ3RoID4gMjVcbiAgICAgICAgZGF0YSA9IF8uaW5pdGlhbCBkYXRhLCBkYXRhLmxlbmd0aCAtIDI1XG5cbiAgICAgIF8ubWFwIGRhdGEsIChyZXN1bHQpIC0+XG4gICAgICAgIG5hbWU6IHJlc3VsdC5uYW1lXG4gICAgICAgIHVybDogIHJlc3VsdC5odG1sX3VybFxuICAgICAgICBkZXNjOiByZXN1bHQuZGVzY3JpcHRpb25cblxuICAgIHJlbmRlcjogKGRhdGEpIC0+XG4gICAgICAkKCcjcmVzdWx0cycpLmh0bWwgdGVtcGxhdGVzLnJlc3VsdHMoZGF0YSkiXX0=

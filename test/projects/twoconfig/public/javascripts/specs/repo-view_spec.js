define(['jquery', 'app/repo-view', './data-helper'], function($, RepoView, data) {
  var $button, $input, view;
  view = null;
  $button = null;
  $input = null;
  before(function() {
    $('body').append("<input id='spec_test_input' /><button id='spec_test_button' /><div id='results'></div>");
    view = new RepoView();
    $button = $('button');
    return $input = $('input');
  });
  after(function() {
    return $('[id^=spec_test_]').remove();
  });
  describe('when the button is clicked', function() {
    var searchStub;
    searchStub = null;
    beforeEach(function() {
      return searchStub = sinon.stub(view, "executeSearch");
    });
    afterEach(function() {
      return searchStub.restore();
    });
    it('and there is no value in the box, search should not be called', function() {
      $input.val('');
      $button.click();
      return expect(searchStub.called).to.be["false"];
    });
    return it('and there is a value in the box, search should be called', function() {
      $input.val('foo');
      $button.click();
      return expect(searchStub.called).to.be["true"];
    });
  });
  describe('when search is executed', function() {
    var setupSearch, teardownSearch;
    setupSearch = function() {
      var buildResultsStub, renderStub, requests, xhr;
      xhr = sinon.useFakeXMLHttpRequest();
      xhr.onCreate = function(xhr) {
        return requests.push(xhr);
      };
      requests = [];
      buildResultsStub = sinon.stub(view, "buildResults");
      renderStub = sinon.stub(view, "render");
      view.executeSearch("foo");
      return [xhr, requests, buildResultsStub, renderStub];
    };
    teardownSearch = function(xhr, buildResultsStub, renderStub) {
      xhr.restore();
      buildResultsStub.restore();
      return renderStub.restore();
    };
    describe('and the owner does not exist', function() {
      var buildResultsStub, renderStub, requests, xhr;
      xhr = null;
      requests = null;
      buildResultsStub = null;
      renderStub = null;
      before(function() {
        var _ref;
        _ref = setupSearch(), xhr = _ref[0], requests = _ref[1], buildResultsStub = _ref[2], renderStub = _ref[3];
        return requests[0].respond(404, {
          "Content-Type": "application/json"
        }, '{"message": "Not Found"}');
      });
      after(function() {
        return teardownSearch(xhr, buildResultsStub, renderStub);
      });
      it('should have made one ajax request', function() {
        return expect(requests.length).to.equal(1);
      });
      it('results should be built with an empty array', function() {
        expect(buildResultsStub.calledOnce).to.be["true"];
        return expect(buildResultsStub.args[0][0].length).to.equal(0);
      });
      return it('render should be called', function() {
        return expect(renderStub.called).to.be["true"];
      });
    });
    return describe('and the owner exists', function() {
      var buildResultsStub, renderStub, requests, xhr;
      xhr = null;
      requests = null;
      buildResultsStub = null;
      renderStub = null;
      before(function() {
        var _ref;
        _ref = setupSearch(), xhr = _ref[0], requests = _ref[1], buildResultsStub = _ref[2], renderStub = _ref[3];
        return requests[0].respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(data.fullRepoResult));
      });
      after(function() {
        return teardownSearch(xhr, buildResultsStub, renderStub);
      });
      it('should have made one ajax request', function() {
        return expect(requests.length).to.equal(1);
      });
      it('results should be built with an empty array', function() {
        expect(buildResultsStub.calledOnce).to.be["true"];
        return expect(buildResultsStub.args[0][0].length).to.equal(30);
      });
      return it('render should be called', function() {
        return expect(renderStub.called).to.be["true"];
      });
    });
  });
  describe('when results are built they should contain', function() {
    var results;
    results = null;
    before(function() {
      return results = view.buildResults(data.fullRepoResult, data.fakeXhr("10"), "foo");
    });
    it('repo owner results', function() {
      return expect(results.results.length).to.equal(25);
    });
    it('the queried owner name', function() {
      return expect(results.name).to.equal("foo");
    });
    return describe('the rate limiting information', function() {
      it('when the user has not been limited', function() {
        expect(results.limit).to.equal("60");
        expect(results.remaining).to.equal("10");
        return expect(results.limited).to.be["false"];
      });
      return it('when the user has been limited', function() {
        var limitedResults;
        limitedResults = view.buildResults(data.fullRepoResult, data.fakeXhr("0"), "foo");
        expect(limitedResults.limit).to.equal("60");
        expect(limitedResults.remaining).to.equal("0");
        expect(limitedResults.limited).to.be["true"];
        return expect(limitedResults.canUseWhen).to.equal("in 2 minutes");
      });
    });
  });
  describe('data processing', function() {
    var results;
    results = null;
    before(function() {
      return results = view.processData(data.fullRepoResult);
    });
    it('should limit results to 25', function() {
      return expect(results.length).to.equal(25);
    });
    return it('should pull out the pertinent information', function() {
      var result, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = results.length; _i < _len; _i++) {
        result = results[_i];
        expect(Object.keys(result).length).to.equal(3);
        expect(result.name).to.exist;
        expect(result.url).to.exist;
        _results.push(expect(result.desc).to.exist);
      }
      return _results;
    });
  });
  return describe('when rendering', function() {
    describe('with results', function() {
      var viewData;
      viewData = null;
      before(function() {
        viewData = data.viewDataResults();
        return view.render(viewData);
      });
      after(function() {
        return $('#results').empty();
      });
      it('should show the repo owner searched', function() {
        return expect($('#repo-owner').html()).to.equal('foo');
      });
      it('should show the limiting information', function() {
        return expect($('#limiting-information').length).to.equal(1);
      });
      describe('when not rate limited', function() {
        return it('should not show the limiting alert', function() {
          return expect($('#shutdown').length).to.equal(0);
        });
      });
      return describe('should show a result list', function() {
        var $listItems;
        $listItems = null;
        before(function() {
          return $listItems = $('#result-list li');
        });
        it('with the correct number of entries', function() {
          return expect($listItems.length).to.equal(30);
        });
        return it('with each result containing a link to the repo', function() {
          return expect($listItems.find('a').length).to.equal(30);
        });
      });
    });
    describe('with no results', function() {
      var viewData;
      viewData = null;
      before(function() {
        viewData = data.viewDataNoResults();
        return view.render(viewData);
      });
      after(function() {
        return $('#results').empty();
      });
      it('should show the owner owner searched', function() {
        return expect($('#repo-owner').html()).to.equal('foo');
      });
      it('should show the limiting information', function() {
        return expect($('#limiting-information').length).to.equal(1);
      });
      return it('should show that the owner is unknown to github', function() {
        return expect($('#unknown-owner').length).to.equal(7);
      });
    });
    return describe('when rate limited', function() {
      var viewData;
      viewData = null;
      before(function() {
        viewData = data.viewDataRateLimited();
        return view.render(viewData);
      });
      after(function() {
        return $('#results').empty();
      });
      it('should not have a result list', function() {
        return expect($('#result-list').length).to.equal(0);
      });
      return it('should show the rate limited alert', function() {
        return expect($('#shutdown').length).to.equal(0);
      });
    });
  });
});

require({
  urlArgs: "b=" + (new Date().getTime()),
  paths: {
    jquery: 'vendor/jquery',
    lodash: 'vendor/lodash',
    moment: 'vendor/moment'
  }
}, ['app/repo-view'], function(OwnerRepoListView) {
  return new OwnerRepoListView().searchOwner();
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2RiYXNoZm9yZC9teWdpdGh1Yi9NaW1vc2FUZXN0ZW0vcHVibGljL2phdmFzY3JpcHRzL21haW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvZGJhc2hmb3JkL215Z2l0aHViL01pbW9zYVRlc3RlbS9hc3NldHMvamF2YXNjcmlwdHMvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FDRSxNQURGO0NBQ0UsQ0FBQSxDQUFhLENBQUgsR0FBVjtDQUFBLENBQ0EsR0FBQTtDQUNFLENBQVEsRUFBUixFQUFBLFNBQUE7Q0FBQSxDQUNRLEVBQVIsRUFBQSxTQURBO0NBQUEsQ0FFUSxFQUFSLEVBQUEsU0FGQTtJQUZGO0NBS0csQ0FOTCxDQU9JLE1BQUMsTUFERCxFQUNBO0NBQ0ksR0FBQSxLQUFBLEVBQUEsTUFBQTtDQURKIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZVxuICB1cmxBcmdzOiBcImI9I3tuZXcgRGF0ZSgpLmdldFRpbWUoKX1cIlxuICBwYXRoczpcbiAgICBqcXVlcnk6ICd2ZW5kb3IvanF1ZXJ5J1xuICAgIGxvZGFzaDogJ3ZlbmRvci9sb2Rhc2gnXG4gICAgbW9tZW50OiAndmVuZG9yL21vbWVudCdcbiAgLCBbJ2FwcC9yZXBvLXZpZXcnXVxuICAsIChPd25lclJlcG9MaXN0VmlldykgLT5cbiAgICBuZXcgT3duZXJSZXBvTGlzdFZpZXcoKS5zZWFyY2hPd25lcigpIl19
